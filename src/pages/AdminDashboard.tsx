import { useState } from 'react';
import { Search, Edit2, Trash2, History, Coins, MessageSquare, LayoutDashboard, User } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { MessageInbox } from '../components/admin/MessageInbox';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/dateTime';
import { searchUser, updateUser, deleteUser } from '../services/admin';

interface Transaction {
  transactionId: string;
  amount: number;
  transactionType: 'deposit' | 'purchase';
  category?: string;
  transactionDate: string;
  description: string;
}

interface UserData {
  user: {
    _id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  balance: number;
  transactions: Transaction[];
}

export const AdminDashboard = () => {
  const [searchId, setSearchId] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
  });
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const data = await searchUser(searchId);
      setUserData(data);
      setEditForm({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      });
      setShowAnalytics(false);
      setShowMessages(false);
    } catch (err) {
      setError('User not found');
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      await updateUser(userData.user._id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
      });
      const updatedData = await searchUser(searchId);
      setUserData(updatedData);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!userData) return;

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userData.user._id);
        setUserData(null);
        setSearchId('');
        setError('');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <Header username={user?.username || ""} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#2C3E50]">
              {getGreeting()}, Admin
            </h2>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowAnalytics(true);
                  setShowMessages(false);
                  setUserData(null);
                }}
                className={`flex items-center gap-2 ${
                  showAnalytics ? "bg-[#2C3E50]" : "bg-gray-500"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowAnalytics(false);
                  setUserData(null);
                }}
                className={`flex items-center gap-2 ${
                  showMessages ? "bg-[#2C3E50]" : "bg-gray-500"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                Messages
              </Button>
            </div>
          </div>

          {/* Prominent Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by Student ID"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    setError("");
                  }}
                  error={error}
                  className="text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center gap-2 px-8"
              >
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {userData ? (
            <div className="grid gap-8">
              {/* User Information Card */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#2C3E50] text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="h-6 w-6" />
                      <h3 className="text-xl font-semibold">
                        User Information
                      </h3>
                    </div>
                    {isEditing ? (
                      <div className="space-y-4">
                        <Input
                          label="First Name"
                          value={editForm.firstName}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className="bg-white text-[#2C3E50]"
                        />
                        <Input
                          label="Last Name"
                          value={editForm.lastName}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className="bg-white text-[#2C3E50]"
                        />
                        <div className="flex gap-4">
                          <Button onClick={handleSave}>Save</Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setIsEditing(false);
                              setEditForm({
                                firstName: userData.user.firstName,
                                lastName: userData.user.lastName,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <p>
                            <span className="text-gray-300">ID:</span>{" "}
                            {userData.user.studentId}
                          </p>
                          <p>
                            <span className="text-gray-300">Name:</span>{" "}
                            {userData.user.firstName} {userData.user.lastName}
                          </p>
                          <p>
                            <span className="text-gray-300">Email:</span>{" "}
                            {userData.user.email}
                          </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                          <Button
                            variant="secondary"
                            onClick={handleEdit}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={handleDelete}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-[#2C3E50] text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <Coins className="h-6 w-6" />
                      <h3 className="text-xl font-semibold">
                        Wallet Information
                      </h3>
                    </div>
                    <div className="text-4xl font-bold text-[#FFD700] mb-6">
                      ৳{userData.balance.toFixed(2)}
                    </div>
                    <Button
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex items-center gap-2 w-full"
                    >
                      <History className="h-4 w-4" />
                      {showHistory ? "Hide History" : "View History"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              {showHistory && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <History className="h-6 w-6 text-[#2C3E50]" />
                    <h3 className="text-xl font-semibold text-[#2C3E50]">
                      Transaction History
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left">Transaction ID</th>
                          <th className="py-3 text-left">Date</th>
                          <th className="py-3 text-left">Type</th>
                          <th className="py-3 text-left">Category</th>
                          <th className="py-3 text-left">Amount</th>
                          <th className="py-3 text-left">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.transactions.length > 0 ? (
                          userData.transactions.map((transaction) => (
                            <tr
                              key={transaction.transactionId}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 font-mono text-sm">
                                {transaction.transactionId}
                              </td>
                              <td className="py-3">
                                {new Date(
                                  transaction.transactionDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${
                                    transaction.transactionType === "deposit"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {transaction.transactionType}
                                </span>
                              </td>
                              <td className="py-3 capitalize">
                                {transaction.category || "-"}
                              </td>
                              <td
                                className={`py-3 font-medium ${
                                  transaction.transactionType === "deposit"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.transactionType === "deposit"
                                  ? "+"
                                  : "-"}
                                ৳{transaction.amount.toFixed(2)}
                              </td>
                              <td className="py-3">
                                {transaction.description}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-8 text-center text-gray-500"
                            >
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : showMessages ? (
            <MessageInbox />
          ) : showAnalytics ? (
            <AnalyticsDashboard />
          ) : null}
        </div>
      </main>
    </div>
  );
};