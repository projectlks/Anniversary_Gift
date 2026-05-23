import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500">Last updated: May 23, 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <p className="mb-4">
              Welcome to <strong>Anniversary Space</strong>. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our application. We respect your privacy
              and are committed to protecting it. Please read this privacy
              policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-2">
              When you log in and use our services via Google OAuth, we request
              only the necessary permissions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>Basic Profile Information:</strong> Your name, email
                address, and profile picture. This is used exclusively to
                authenticate you and connect your account with your
                partner&apos;s account securely.
              </li>
              <li>
                <strong>Google Drive Access (Restricted Scope):</strong> We
                request the specific, restricted permission{" "}
                <code>https://www.googleapis.com/auth/drive.file</code>. This
                permission <strong>only</strong> allows our app to view, edit,
                create, and delete files that were created by{" "}
                <i>this app itself</i>. We cannot and do not access, view, or
                modify any of your personal files, folders, or other content
                stored in your Google Drive.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              2. How We Use Your Information
            </h2>
            <p className="mb-2">
              We use the information we collect strictly to provide and maintain
              your private couple space:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                To authenticate your login securely and prevent unauthorized
                access.
              </li>
              <li>
                To create a secure, shared link between your account and your
                partner&apos;s account.
              </li>
              <li>
                To seamlessly upload your shared anniversary memories directly
                to the specific folder created by our app within your personal
                Google Drive, ensuring you retain full ownership of your data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              3. Google API Services Limited Use Policy
            </h2>
            <p className="mb-2">
              <strong>Anniversary Space</strong>&apos;s use and transfer to any
              other app of information received from Google APIs will adhere to
              the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                We <strong>do not</strong> use your Google Drive data, profile
                information, or any uploaded images to train artificial
                intelligence (AI) or machine learning (ML) models.
              </li>
              <li>
                We <strong>do not</strong> sell, share, or transfer your data to
                any third parties for marketing, advertising, or data brokering
                purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              4. Data Storage and Security
            </h2>
            <p>
              We do not store your actual images on our own servers. All images
              are securely uploaded directly to your authenticated Google Drive
              using the restricted <code>drive.file</code> scope. We only store
              the access links (URLs) to those specific images in our database
              to display them within the app. Your database information is
              protected using industry-standard encryption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              5. Data Retention and Deletion
            </h2>
            <p>
              You maintain full ownership and control over your data. Because
              the images are stored in your own Google Drive, you can delete
              them directly from your Drive at any time. If you wish to delete
              your Anniversary Space account and all associated database records
              (such as image links and Couple IDs), please contact us, and we
              will permanently erase your information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              6. Contact Us
            </h2>
            <p className="mb-2">
              If you have any questions or concerns about this Privacy Policy or
              how we handle your data, please contact us at:
            </p>
            <ul className="pl-5 text-slate-600">
              <li>
                <strong>Email:</strong> mglinkar08@gmail.com
              </li>
              <li>
                <strong>Developer:</strong> Linkar Soe
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
