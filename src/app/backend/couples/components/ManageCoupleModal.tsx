import { TrashIcon } from "@heroicons/react/24/outline";

import {
  archiveCoupleAction,
  inviteMemberAction,
  updateLimitsAction,
  updatePasscodeAction,
} from "../action";
import { inputClass, labelClass } from "../styles";
import type { CoupleWithMembers } from "../types";
import ModalShell from "./ModalShell";

type ManageCoupleModalProps = {
  couple: CoupleWithMembers;
};

export default function ManageCoupleModal({
  couple,
}: ManageCoupleModalProps) {
  return (
    <ModalShell
      title="Manage Space"
      subtitle={`/${couple.slug}`}
      bodyClassName="space-y-8 p-6"
      panelClassName="flex max-h-[90vh] flex-col overflow-y-auto"
      stickyHeader>
      {/* Each section submits independently, so admins can update one setting without touching the others. */}
      <div>
        <h3 className={labelClass}>Connected Members</h3>
        <div className="mb-4 space-y-2">
          {couple.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-bold uppercase text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {member.email.charAt(0)}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {member.email}
                </span>
              </div>
              <span className="rounded border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {member.role}
              </span>
            </div>
          ))}
        </div>
        <form
          action={inviteMemberAction}
          className="flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="coupleId" value={couple.id} />
          <div className="relative grow">
            <input
              name="email"
              type="email"
              placeholder="Invite email"
              className={inputClass}
              required
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">
            Invite
          </button>
        </form>
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      <div>
        <h3 className={labelClass}>Security Settings</h3>
        <form
          action={updatePasscodeAction}
          className="flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="coupleId" value={couple.id} />
          <div className="relative grow">
            <input
              name="passcode"
              placeholder="New passcode"
              className={`${inputClass} font-mono tracking-widest`}
              minLength={4}
              required
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
            Update
          </button>
        </form>
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      <div>
        <h3 className={labelClass}>Storage Limits</h3>
        <form action={updateLimitsAction} className="flex items-end gap-4">
          <input type="hidden" name="coupleId" value={couple.id} />
          <div className="w-1/2">
            <label className="mb-1 block text-xs">Images</label>
            <input
              name="maxMemories"
              type="number"
              defaultValue={couple.maxMemories}
              className={inputClass}
            />
          </div>
      
          <button className="h-10.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">
            Save
          </button>
        </form>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-700">
        <form
          action={archiveCoupleAction}
          className="flex flex-col items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/10 sm:flex-row sm:items-center">
          <input type="hidden" name="coupleId" value={couple.id} />
          <div>
            <h4 className="text-sm font-bold text-red-700 dark:text-red-500">
              Archive Space
            </h4>
            <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/70">
              Hidden from active users.
            </p>
          </div>
          <button className="flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
            <TrashIcon className="h-4 w-4" />
            Archive
          </button>
        </form>
      </div>
    </ModalShell>
  );
}
