import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      coupleId: string | null;
      coupleName: string | null;
      canEdit: boolean;
    };
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    coupleId?: string | null;
    coupleName?: string | null;
    canEdit?: boolean;
  }
}
