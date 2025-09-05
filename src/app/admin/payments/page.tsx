"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  status: "success" | "failed" | "pending";
  provider: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  orderId: string;
  orderStatus: string;
  customerName: string;
  customerEmail: string;
  phoneNumber?: string;
  mpesaReceiptNumber?: string;
  merchantRequestId?: string;
  resultCode?: number;
  resultDescription?: string;
  failureReason?: string;
  callbackTimestamp?: string;
}

interface PaymentsResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter, dateFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (statusFilter) params.append("status", statusFilter);
      if (dateFilter) {
        const [startDate, endDate] = dateFilter.split(" to ");
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
      }
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/payments?${params}`);
      const data: PaymentsResponse = await response.json();

      if (response.ok) {
        setPayments(data.payments);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch payments:", data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPayments();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Transactions
          </h1>
          <p className="text-gray-600">Manage and monitor M-Pesa payments</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Transaction ID, customer name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No payments found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.transactionId}
                        </div>
                        {payment.mpesaReceiptNumber && (
                          <div className="text-sm text-gray-500">
                            Receipt: {payment.mpesaReceiptNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.customerEmail}
                        </div>
                        {payment.phoneNumber && (
                          <div className="text-sm text-gray-500">
                            {payment.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          #{payment.orderId}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {payment.orderStatus}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.pages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * pagination.limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * pagination.limit,
                          pagination.total
                        )}
                      </span>{" "}
                      of <span className="font-medium">{pagination.total}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Details
                </h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transaction ID
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.transactionId}
                  </p>
                </div>

                {selectedPayment.mpesaReceiptNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      M-Pesa Receipt
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedPayment.mpesaReceiptNumber}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedPayment.status
                    )}`}
                  >
                    {getStatusIcon(selectedPayment.status)}
                    <span className="ml-1 capitalize">
                      {selectedPayment.status}
                    </span>
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedPayment.customerEmail}
                  </p>
                  {selectedPayment.phoneNumber && (
                    <p className="text-sm text-gray-500">
                      {selectedPayment.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order
                  </label>
                  <p className="text-sm text-gray-900">
                    #{selectedPayment.orderId}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {selectedPayment.orderStatus}
                  </p>
                </div>

                {selectedPayment.failureReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Failure Reason
                    </label>
                    <p className="text-sm text-red-600">
                      {selectedPayment.failureReason}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedPayment.createdAt)}
                  </p>
                </div>

                {selectedPayment.callbackTimestamp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Callback Received
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedPayment.callbackTimestamp)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
