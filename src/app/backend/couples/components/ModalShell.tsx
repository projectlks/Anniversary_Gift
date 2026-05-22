import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { ReactNode } from "react";

type ModalShellProps = {
  bodyClassName?: string;
  children: ReactNode;
  maxWidthClassName?: string;
  panelClassName?: string;
  stickyHeader?: boolean;
  subtitle?: string;
  title: string;
};

export default function ModalShell({
  bodyClassName = "p-6",
  children,
  maxWidthClassName = "max-w-2xl",
  panelClassName = "",
  stickyHeader = false,
  subtitle,
  title,
}: ModalShellProps) {
  const headerClassName = stickyHeader
    ? "sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:bg-gray-800/95 dark:border-gray-700"
    : "flex items-center justify-between border-b border-gray-100 bg-transparent px-6 py-4 dark:border-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 ${maxWidthClassName} ${panelClassName}`.trim()}>
        {/* Shared dialog chrome keeps both modals visually aligned. */}
        <div className={headerClassName}>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs font-mono text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href="?"
            scroll={false}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  );
}
