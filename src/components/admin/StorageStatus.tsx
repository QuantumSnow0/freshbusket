"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface StorageStatusData {
  success: boolean;
  error: string | null;
  buckets: string[] | null;
  bucketInfo?: any;
}

export function StorageStatus() {
  const [status, setStatus] = useState<StorageStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStorageStatus();
  }, []);

  const checkStorageStatus = async () => {
    try {
      const response = await fetch("/api/admin/storage-check");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error checking storage status:", error);
      setStatus({
        success: false,
        error: "Failed to check storage status",
        buckets: null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-600">Checking storage...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Storage check failed</span>
      </div>
    );
  }

  if (status.success) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Storage ready</span>
        </div>
        <div className="text-xs text-gray-500">
          Buckets: {status.buckets?.join(", ") || "None"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Storage issue</span>
      </div>
      <div className="text-xs text-red-500">{status.error}</div>
      <button
        onClick={checkStorageStatus}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        Check again
      </button>
    </div>
  );
}



