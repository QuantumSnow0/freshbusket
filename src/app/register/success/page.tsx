"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function RegistrationSuccessPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [email, setEmail] = useState("");

  // Get email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage("");

    try {
      if (!email) {
        setResendMessage("Email not found. Please try registering again.");
        return;
      }

      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage("Confirmation email sent! Check your inbox.");
      } else {
        // Handle specific error cases
        if (data.error && data.error.includes("already registered")) {
          setResendMessage(
            "This email is already registered and confirmed. Please try logging in instead."
          );
        } else {
          setResendMessage(
            data.error || "Failed to resend email. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Resend error:", error);
      setResendMessage("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent you a confirmation link
          </p>
          {email && (
            <p className="mt-1 text-center text-sm text-gray-500">
              to <strong>{email}</strong>
            </p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                Almost there!
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  We've sent a confirmation link to your email address. Please
                  check your inbox and click the link to activate your account.
                </p>
                <p className="mt-2">
                  <strong>Don't see the email?</strong> Check your spam folder
                  or{" "}
                  <button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="text-green-600 hover:text-green-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="inline h-4 w-4 animate-spin mr-1" />
                        Sending...
                      </>
                    ) : (
                      "resend confirmation email"
                    )}
                  </button>
                </p>
                {resendMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      resendMessage.includes("sent")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {resendMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Back to Login
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already confirmed your email?{" "}
            <Link
              href="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
