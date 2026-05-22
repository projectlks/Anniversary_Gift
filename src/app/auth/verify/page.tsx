export default function VerifyRequestPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-xl p-8 space-y-4 text-center">
        <h1 className="text-2xl font-bold text-rose-700">Check Your Email</h1>
        <p className="text-gray-600">
          We sent a sign-in magic link. Open your inbox and click the link to continue.
        </p>
      </div>
    </main>
  );
}
