"use client";

export function RealtimeTestButton() {
  const handleTestRealtime = async () => {
    try {
      const response = await fetch("/api/test-realtime", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert(
          "Test order created! Check the orders page for real-time update."
        );
      } else {
        alert("Test failed: " + data.error);
      }
    } catch (error) {
      alert("Test failed: " + error);
    }
  };

  const handleDebugRealtime = async () => {
    try {
      const response = await fetch("/api/debug-realtime");
      const data = await response.json();

      let message = "Real-time Debug Results:\n\n";
      if (data.success) {
        message += `Orders Access: ${data.debug.ordersAccess}\n`;
        message += `Orders Count: ${data.debug.ordersCount}\n`;
        message += `Real-time Status: ${data.debug.realtimeStatus}\n\n`;
        message += "Instructions:\n";
        data.debug.instructions.forEach(
          (instruction: string, index: number) => {
            message += `${instruction}\n`;
          }
        );
      } else {
        message += `Error: ${data.error}\n\n`;
        message += "Instructions:\n";
        data.instructions.forEach((instruction: string, index: number) => {
          message += `${instruction}\n`;
        });
      }

      alert(message);
    } catch (error) {
      alert("Debug failed: " + error);
    }
  };

  const handleCheckPayments = async () => {
    try {
      const response = await fetch("/api/create-payments-table", {
        method: "POST",
      });
      const data = await response.json();

      let message = "Payments Table Check:\n\n";
      if (data.success) {
        message += `Status: ${data.message}\n`;
        message += `Table Exists: ${data.tableExists}\n`;
      } else {
        message += `Status: ${data.message}\n\n`;
        message += "Instructions:\n";
        data.instructions.forEach((instruction: string, index: number) => {
          message += `${instruction}\n`;
        });
      }

      alert(message);
    } catch (error) {
      alert("Check payments failed: " + error);
    }
  };

  const handleCheckOrderStatus = async () => {
    try {
      const response = await fetch("/api/add-order-status-column", {
        method: "POST",
      });
      const data = await response.json();

      let message = "Order Status Column Check:\n\n";
      if (data.success) {
        message += `Status: ${data.message}\n`;
        message += `Column Exists: ${data.columnExists}\n`;
      } else {
        message += `Status: ${data.message}\n\n`;
        message += "Instructions:\n";
        data.instructions.forEach((instruction: string, index: number) => {
          message += `${instruction}\n`;
        });
      }

      alert(message);
    } catch (error) {
      alert("Check order status column failed: " + error);
    }
  };

  const handleTestEmail = async () => {
    try {
      const response = await fetch("/api/test-email");
      const data = await response.json();

      if (data.success) {
        alert("✅ Test email sent! Check the console for email content.");
      } else {
        alert("❌ Test email failed: " + data.error);
      }
    } catch (error) {
      alert("Test email failed: " + error);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleTestRealtime}
        className="block w-full text-left px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Test Real-time
      </button>
      <button
        onClick={handleDebugRealtime}
        className="block w-full text-left px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
      >
        Debug Real-time
      </button>
      <button
        onClick={handleCheckPayments}
        className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Check Payments Table
      </button>
      <button
        onClick={handleCheckOrderStatus}
        className="block w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Check Order Status Column
      </button>
      <button
        onClick={handleTestEmail}
        className="block w-full text-left px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Test Email System
      </button>
    </div>
  );
}
