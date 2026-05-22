import { Cog6ToothIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import type { CoupleWithMembers } from "../types";

type CouplesTableProps = {
  couples: CoupleWithMembers[];
};

function MemberAvatarStack({ couple }: { couple: CoupleWithMembers }) {
  if (couple.members.length === 0) {
    return <span className="text-xs italic text-gray-400">None</span>;
  }

  return (
    <>
      {couple.members.map((member) => (
        <div
          key={member.id}
          title={member.email}
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold uppercase text-gray-600 shadow-sm dark:border-gray-900">
          {member.email.charAt(0)}
        </div>
      ))}
    </>
  );
}

export default function CouplesTable({ couples }: CouplesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 shadow-sm dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Active Spaces
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="?action=new"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <PlusIcon className="h-5 w-5 stroke-2" />
            Add New
          </Link>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-y border-gray-100 dark:border-gray-800">
              <th className="py-3 text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Space Name
                </p>
              </th>
              <th className="py-3 text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Members
                </p>
              </th>
              <th className="py-3 text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Limits
                </p>
              </th>
              <th className="py-3 text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </p>
              </th>
              <th className="py-3 text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </p>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {couples.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-sm italic text-gray-500">
                  No active spaces found.
                </td>
              </tr>
            )}
            {couples.map((couple) => (
              <tr
                key={couple.id}
                className="transition-colors hover:bg-gray-50/50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11.25 w-11.25 items-center justify-center overflow-hidden rounded-md border border-blue-100 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10">
                      <span className="text-lg font-bold uppercase text-blue-600">
                        {couple.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {couple.name}
                      </p>
                      <span className="text-xs font-mono text-gray-400">
                        /{couple.slug}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex -space-x-2">
                    <MemberAvatarStack couple={couple} />
                  </div>
                </td>
                <td className="py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-800 dark:text-white/80">
                      {couple.maxMemories}
                    </span>{" "}
                    Img
                    <span className="mx-1 text-gray-300">/</span>
                    <span className="font-semibold text-gray-800 dark:text-white/80">
                      {couple.maxPuzzleImages}
                    </span>{" "}
                    Pzl
                  </p>
                </td>
                <td className="py-4">
                  <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    Active
                  </span>
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`?action=manage&id=${couple.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white">
                    <Cog6ToothIcon className="h-4 w-4" />
                    MANAGE
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
