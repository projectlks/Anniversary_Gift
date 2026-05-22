import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { createCoupleAction } from "../action";
import CustomDatePicker from "../CustomDatePicker";
import { inputClass, labelClass } from "../styles";
import ModalShell from "./ModalShell";

export default function CreateCoupleModal() {
  return (
    <ModalShell title="Create New Space">
      <form
        action={createCoupleAction}
        className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Display Name</label>
          <input
            name="name"
            placeholder="John & Jane"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Secret Passcode</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <KeyIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              name="passcode"
              placeholder="143143"
              className={`${inputClass} pl-10 font-mono tracking-widest`}
              minLength={4}
              required
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Owner Email</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              name="ownerEmail"
              type="email"
              placeholder="owner@domain.com"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            Partner Email{" "}
            <span className="font-normal text-gray-400">(Optional)</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              name="partnerEmail"
              type="email"
              placeholder="partner@domain.com"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="sm:col-span-2 space-x-5  grid grid-cols-10 ">
          <div className="col-span-7">
            <label className={labelClass}>Anniversary Date</label>
            {/* The calendar stays client-side, but the form still posts directly to the server action. */}
            <CustomDatePicker name="startDate" />
          </div>
          <div className="col-span-3">
            <label className={labelClass}>Time</label>

            <input
              type="time"
              name="startTime"
              lang="en-GB"
              className="
      w-full rounded-lg border border-neutral-300
      bg-white px-3 py-2 text-sm
      outline-none focus:ring-2 focus:ring-black
    "
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:col-span-2">
          <div>
            <label className={labelClass}>Max Memories</label>
            <input
              name="maxMemories"
              type="number"
              min={1}
              defaultValue={120}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Max Puzzles</label>
            <input
              name="maxPuzzleImages"
              type="number"
              min={1}
              defaultValue={30}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-700 sm:col-span-2">
          <Link
            href="?"
            scroll={false}
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:w-auto">
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 sm:w-auto">
            Create Space
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
