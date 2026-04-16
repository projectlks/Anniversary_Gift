import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { CoupleMemberStatus, UserRole } from "@prisma/client";
import { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
import { logAudit } from "@/libs/audit";
import { prisma } from "@/libs/prisma";
import { normalizeEmail } from "@/libs/security";

const resendApiKey = process.env.AUTH_RESEND_KEY;
const resendFrom = process.env.AUTH_RESEND_FROM;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const hasResendConfig = Boolean(resendApiKey && resendFrom);
const isProduction = process.env.NODE_ENV === "production";
const DEV_MAGIC_LINK_FROM = "onboarding@resend.dev";

if (!hasResendConfig && isProduction) {
  console.warn(
    "AUTH_RESEND_KEY or AUTH_RESEND_FROM is not configured. Magic link login will fail until configured.",
  );
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
      from: resendFrom ?? DEV_MAGIC_LINK_FROM,
      maxAge: 15 * 60,
      async sendVerificationRequest({ identifier, url, provider }) {
        if (resend && hasResendConfig) {
          try {
            const host = new URL(url).host;
            await resend.emails.send({
              from: provider.from,
              to: identifier,
              subject: `Sign in to ${host}`,
              text: `Use this magic link to sign in:\n${url}\n\nIf this was not you, ignore this message.`,
              html: `<p>Use this magic link to sign in:</p><p><a href="${url}">${url}</a></p><p>If this was not you, ignore this message.</p>`,
            });
            return;
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Unknown Resend error";
            console.error(`[auth] Resend send failed: ${message}`);

            if (!isProduction) {
              console.warn(
                `[DEV MAGIC LINK] Falling back because email send failed. Use this link for ${identifier}: ${url}`,
              );
              return;
            }

            throw error;
          }
        }

        if (!isProduction) {
          console.warn(
            `[DEV MAGIC LINK] Resend is not configured. Use this link to sign in ${identifier}: ${url}`,
          );
          return;
        }

        throw new Error(
          "AUTH_RESEND_KEY and AUTH_RESEND_FROM must be configured in production.",
        );
      },
    }),
  ],
  callbacks: {
    async signIn({ user, email }) {
      if (email?.verificationRequest) {
        return true;
      }

      if (!user.email) return false;

      const normalizedUserEmail = normalizeEmail(user.email);
      const adminEmail = process.env.SUPER_ADMIN_EMAIL
        ? normalizeEmail(process.env.SUPER_ADMIN_EMAIL)
        : null;

      if (adminEmail && normalizedUserEmail === adminEmail) {
        await prisma.user.upsert({
          where: { email: normalizedUserEmail },
          update: { role: UserRole.SUPER_ADMIN },
          create: {
            email: normalizedUserEmail,
            name: user.name ?? null,
            image: user.image ?? null,
            role: UserRole.SUPER_ADMIN,
            emailVerified: new Date(),
          },
        });
        return true;
      }

      if (!user.id) return false;

      const membership = await prisma.coupleMember.findFirst({
        where: {
          email: normalizedUserEmail,
          status: { in: [CoupleMemberStatus.INVITED, CoupleMemberStatus.ACTIVE] },
        },
      });

      if (!membership) {
        return false;
      }

      await prisma.coupleMember.update({
        where: { id: membership.id },
        data: {
          userId: user.id,
          status: CoupleMemberStatus.ACTIVE,
          joinedAt: membership.joinedAt ?? new Date(),
        },
      });

      return true;
    },
    async jwt({ token, user }) {
      const userId = user?.id ?? token.sub;
      if (!userId) return token;

      if (!user || !token.role) {
        const [dbUser, membership] = await Promise.all([
          prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
          }),
          prisma.coupleMember.findUnique({
            where: { userId },
            include: { couple: true },
          }),
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
      await logAudit({
        actorId: user.id,
        action: "AUTH_SIGN_IN",
        entityType: "USER",
        entityId: user.id,
        details: { email: user.email ?? null },
      });
    },
  },
  secret: process.env.AUTH_SECRET,
};

export function auth() {
  return getServerSession(authOptions);
}
