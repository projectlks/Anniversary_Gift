import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { CoupleMemberStatus, UserRole } from "@prisma/client";
import { appendFile } from "node:fs/promises";
import { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { logAudit } from "@/libs/audit";
import { prisma } from "@/libs/prisma";
import { normalizeEmail } from "@/libs/security";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.EMAIL_FROM;
const smtpSecure = process.env.SMTP_SECURE === "true";

const hasSmtpConfig = Boolean(
  smtpHost &&
  Number.isFinite(smtpPort) &&
  smtpPort > 0 &&
  smtpUser &&
  smtpPass &&
  smtpFrom,
);
const isProduction = process.env.NODE_ENV === "production";
const DEV_MAGIC_LINK_FROM = "no-reply@example.com";

const smtpTransport = hasSmtpConfig
  ? nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
  : null;

async function logMagicLink(identifier: string, url: string) {
  if (isProduction) return;
  const line = `[${new Date().toISOString()}] ${identifier} => ${url}\n`;
  try {
    await appendFile("generated/dev-magic-links.log", line, "utf8");
  } catch (error) {
    console.warn(`[DEV MAGIC LINK] Failed to write debug log:`, error);
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  providers: [
    EmailProvider({
      from: smtpFrom ?? DEV_MAGIC_LINK_FROM,
      maxAge: 15 * 60,
      async sendVerificationRequest({ identifier, url, provider }) {

        // 1. QR Code ကို အစက်အဖြူ၊ နောက်ခံပန်းရောင် ဖြင့် ထုတ်လုပ်ခြင်း
        let qrCodeBuffer: Buffer | null = null;
        try {
          qrCodeBuffer = await QRCode.toBuffer(url, {
            color: {
              dark: "#ffffff",  // အစက်များကို အဖြူရောင်ထားမည်
              light: "#f43f5e", // နောက်ခံကို ပန်းရောင်ထားမည် (Heart Color နှင့် တူစေရန်)
            },
            width: 140, // Base Square Size
            margin: 1,
          });
        } catch (err) {
          console.error("Failed to generate QR code buffer", err);
        }

        const host = new URL(url).host;

        // 2. Email HTML တွင် အစ်ကိုပြောသည့် Geometry Trick ကို အသုံးပြုခြင်း
        const htmlTemplate = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px 20px; color: #000000; line-height: 1.6;">
    <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff;">
      
      <div style="text-align: center; margin-bottom: 28px;">
        <svg width="36" height="32" viewBox="0 0 100 100" fill="#000000">
          <polygon points="50,0 100,100 0,100"/>
        </svg>
      </div>

      <div style="text-align: center; margin-bottom: 40px; font-size: 20px;">
        <strong>Sign In Request</strong>:<br>
        A request has been made to access your <strong>Anniversary Space</strong>
      </div>

      <div style="font-size: 16px; color: #000000; margin-bottom: 30px;">
        Hi,<br><br>
        A request to sign in to your private space was recently made.
        <br><br>
        In order to ensure your account's security, please view and confirm this request to continue to your installation.
        <br><br>
        To complete the process, please click the button below:
      </div>

      <div style="text-align: center; margin-bottom: 36px;">
        <a href="${url}" style="display: inline-block; background-color: #000000; color: #ffffff; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 6px; letter-spacing: 0.5px;">
          SIGN IN
        </a>
      </div>

      <div style="font-size: 14px; color: #000000; margin-bottom: 44px;">
        or copy and paste this URL into your browser:<br>
        <a href="${url}" style="color: #0070f3; text-decoration: none; word-break: break-all; margin-top: 8px; display: inline-block;">${url}</a>
      </div>

      <hr style="border: none; border-top: 1px solid #eaeaea; margin-bottom: 28px;">

      <div style="font-size: 13px; color: #666666; line-height: 1.6;">
        If you’d like to report an issue, reach out to <a href="#" style="color: #0070f3; text-decoration: none;">Support</a>.<br><br>
        Copyright © ${new Date().getFullYear()} Anniversary App. All rights reserved.<br>
        Myanmar (Burma)
      </div>
      
    </div>
  </div>
`;
        if (smtpTransport) {
          try {
            await smtpTransport.sendMail({
              from: provider.from ?? smtpFrom ?? DEV_MAGIC_LINK_FROM,
              to: identifier,
              subject: `💖 Sign in to ${host}`,
              html: htmlTemplate,
              attachments: qrCodeBuffer ? [
                {
                  filename: 'qrcode.png',
                  content: qrCodeBuffer,
                  cid: 'magic-qr'
                }
              ] : []
            });
            if (!isProduction) await logMagicLink(identifier, url);
            return;
          } catch (error) {
            console.error(`[auth] SMTP send failed:`, error);
            if (!isProduction) await logMagicLink(identifier, url);
            else throw error;
          }
        }

        if (!isProduction) {
          await logMagicLink(identifier, url);
          return;
        }

        throw new Error("SMTP variables must be configured in production.");
      },
    }),

    // 🌟 (၂) Google Drive အတွက် အသစ်ပေါင်းထည့်လိုက်သော Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // အရေးကြီးဆုံး - Drive ကိုပါ သုံးခွင့်တောင်းခြင်း
          scope: "openid email profile https://www.googleapis.com/auth/drive.file",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),

  ],
  callbacks: {
    async signIn({ user, email }) {
      if (email?.verificationRequest) return true;
      if (!user.email) return false;

      const normalizedUserEmail = normalizeEmail(user.email);
      const adminEmail = process.env.SUPER_ADMIN_EMAIL ? normalizeEmail(process.env.SUPER_ADMIN_EMAIL) : null;

      if (adminEmail && normalizedUserEmail === adminEmail) {
        await prisma.user.upsert({
          where: { email: normalizedUserEmail },
          update: { role: UserRole.SUPER_ADMIN },
          create: { email: normalizedUserEmail, name: user.name ?? null, image: user.image ?? null, role: UserRole.SUPER_ADMIN, emailVerified: new Date() },
        });
        return true;
      }

      const membership = await prisma.coupleMember.findFirst({
        where: { email: normalizedUserEmail, status: { in: [CoupleMemberStatus.INVITED, CoupleMemberStatus.ACTIVE] } },
      });

      if (!membership) return false;

      const memberUser = await prisma.user.upsert({
        where: { email: normalizedUserEmail },
        update: { name: user.name ?? undefined, image: user.image ?? undefined, emailVerified: new Date() },
        create: { email: normalizedUserEmail, name: user.name ?? null, image: user.image ?? null, role: UserRole.MEMBER, emailVerified: new Date() },
      });

      await prisma.coupleMember.update({
        where: { id: membership.id },
        data: { userId: memberUser.id, status: CoupleMemberStatus.ACTIVE, joinedAt: membership.joinedAt ?? new Date() },
      });

      return true;
    },
    async jwt({ token, user }) {
      const userId = user?.id ?? token.sub;
      if (!userId) return token;

      if (!user || !token.role) {
        const [dbUser, membership] = await Promise.all([
          prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
          prisma.coupleMember.findUnique({ where: { userId }, include: { couple: true } }),
        ]);

        token.role = dbUser?.role ?? UserRole.MEMBER;
        token.coupleId = membership?.coupleId ?? null;
        token.coupleName = membership?.couple?.name ?? null;
        token.canEdit = membership?.canEdit ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) return session;
      session.user.id = token.sub ?? "";
      session.user.role = (token.role as UserRole | undefined) ?? UserRole.MEMBER;
      session.user.coupleId = (token.coupleId as string | null | undefined) ?? null;
      session.user.coupleName = (token.coupleName as string | null | undefined) ?? null;
      session.user.canEdit = Boolean(token.canEdit);
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await logAudit({ actorId: user.id, action: "AUTH_SIGN_IN", entityType: "USER", entityId: user.id, details: { email: user.email ?? null } });
    },
  },
  secret: process.env.AUTH_SECRET,
};

export function auth() {
  return getServerSession(authOptions);
}
