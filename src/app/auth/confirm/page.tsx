"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function ConfirmEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!token || type !== "signup") {
        setStatus("error");
        setMessage("Invalid confirmation link");
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        });

        if (error) {
          setStatus("error");
          setMessage(error.message);
        } else {
          setStatus("success");
          setMessage("Email confirmed successfully! You can now sign in.");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred");
      }
    };

    handleEmailConfirmation();
  }, [searchParams, supabase.auth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Confirming Email...
              </h2>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Email Confirmed!
              </h2>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Confirmation Failed
              </h2>
            </>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">{message}</p>

            {status === "success" && (
              <p className="text-sm text-gray-500">
                Redirecting to login page in 3 seconds...
              </p>
            )}

            <div className="mt-6 space-y-3">
              {status === "success" && (
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Go to Login
                </Link>
              )}

              {status === "error" && (
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/login"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Back to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
