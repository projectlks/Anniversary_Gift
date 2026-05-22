import type { Prisma } from "@prisma/client";

export type CoupleWithMembers = Prisma.CoupleGetPayload<{
  include: {
    members: true;
  };
}>;

export type CouplesSearchParams = {
  [key: string]: string | string[] | undefined;
};
