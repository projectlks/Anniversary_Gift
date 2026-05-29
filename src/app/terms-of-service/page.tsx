import React from "react";
import Link from "next/link";
import { ShieldCheckIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Terms of Service | Our Space",
  description: "Terms of Service for Our Space Application",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-rose-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-rose-400 to-pink-500 py-10 px-8 text-center text-white">
          <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-white/90" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-rose-100 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10 space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="text-rose-500">1.</span> Introduction
            </h2>
            <p>
              Welcome to <strong>Our Space</strong> (&quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;). By accessing or using our
              application, you agree to be bound by these Terms of Service. If
              you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="text-rose-500">2.</span> Description of Service
            </h2>
            <p>
              <strong>Our Space</strong> is a private anniversary application
              designed to store and share personal memories, photos, and
              interactive experiences. The application utilizes third-party
              services, including Google Drive API, to facilitate the storage of
              user-uploaded content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="text-rose-500">3.</span> Use of Google Drive API
            </h2>
            <p className="mb-3">
              Our application requests access to your Google Drive via the{" "}
              <code>drive.file</code> scope. By granting this permission, you
              agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                We will only create, access, and manage files and folders
                specifically created by this application.
              </li>
              <li>
                We will not access, read, or modify any other personal files in
                your Google Drive.
              </li>
              <li>
                You retain full ownership and control over the content uploaded
                to your Drive.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="text-rose-500">4.</span> User Responsibilities
            </h2>
            <p className="mb-3">When using Our Space, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Upload any content that is illegal, harmful, or violates the
                rights of others.
              </li>
              <li>
                Attempt to gain unauthorized access to the application&apos;s
                systems or other users&apos; accounts.
              </li>
              <li>
                Use the application in any manner that could damage, disable, or
                impair our services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="text-rose-500">5.</span> Privacy & Data Handling
            </h2>
            <p>
              Your privacy is extremely important to us. Our use of your data,
              including how we handle information obtained from Google APIs, is
              strictly governed by our{" "}
              <Link
                href="/privacy"
                className="text-rose-600 hover:text-rose-800 font-semibold underline decoration-rose-300 underline-offset-2 transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="text-rose-500">6.</span> Modifications to the
              Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time.
              We will notify users of any significant changes. Your continued
              use of the application after changes are posted constitutes your
              acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
              <span className="text-rose-500">7.</span> Contact Information
            </h2>
            <p>
              If you have any questions or concerns regarding these Terms of
              Service, please contact us at: <br />
              <a
                href="mailto:mglinkar08@gmail.com"
                className="text-rose-600 font-medium hover:underline mt-2 inline-block">
                mglinkar08@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
