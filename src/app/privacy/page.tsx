import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
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
          <p className="text-slate-500">Last updated: May 22, 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <p className="mb-4">
              Welcome to <strong>Anniversary Space</strong>. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our application. Please read this privacy
              policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-2">
              When you log in using Google OAuth, we securely access and store
              the following information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>Profile Information:</strong> Your name, email address,
                and profile picture (to identify your account and pair you with
                your partner).
              </li>
              <li>
                <strong>Google Drive Access:</strong> We request access to your
                Google Drive (`https://www.googleapis.com/auth/drive`). We only
                use this permission to create a specific shared folder and
                upload your memory images into your own designated Google Drive
                space.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              2. How We Use Your Information
            </h2>
            <p className="mb-2">
              We use the information we collect primarily to provide, maintain,
              and improve our services. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Authenticate your login securely.</li>
              <li>
                Connect your account with your partner&apos;s account via a
                unique Couple ID.
              </li>
              <li>
                Upload, organize, and retrieve your anniversary images directly
                to/from your connected Google Drive.
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
                We <strong>do not</strong> use your Google Drive data or
                personal information to train artificial intelligence (AI) or
                machine learning (ML) models.
              </li>
              <li>
                We <strong>do not</strong> sell, share, or transfer your data to
                third parties for marketing or advertising purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              4. Data Storage and Security
            </h2>
            <p>
              We do not store your actual images on our own servers. All images
              are securely uploaded directly to your authenticated Google Drive.
              We only store the &quot;links&quot; (URLs) to those images in our
              database to display them within the app. Your data is protected
              using industry-standard encryption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              5. Data Retention and Deletion
            </h2>
            <p>
              You have full control over your data. You can delete your images
              directly from your Google Drive at any time. If you wish to delete
              your account and all associated data from our database, you can
              contact us, and we will permanently erase your records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              6. Contact Us
            </h2>
            <p className="mb-2">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
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
