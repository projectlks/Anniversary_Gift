import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { auth } from "@/libs/auth";

export default async function AuthRedirectPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (session.user.role === UserRole.SUPER_ADMIN) {
    redirect("/backend");
  }

  redirect("/lock");
}
