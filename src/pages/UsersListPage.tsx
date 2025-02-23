import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, CheckCircle, XCircle, Eye, EyeOff, History } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { SuccessModal } from '../components/common/SuccessModal';
import { ErrorModal } from '../components/common/ErrorModal';
import api from '../services/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  isActive: boolean;
  balance: number;
}

interface Transaction {
  transactionId: string;
  amount: number;
  transactionType: 'deposit' | 'purchase';
  category?: string;
  description: string;
  transactionDate: string;
}

interface EditUserData {
  firstName: string;
  lastName: string;
  pin: string;
}

export const UsersListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editData, setEditData] = useState<EditUserData>({
    firstName: '',
    lastName: '',
    pin: '',
  });
  const [showPin, setShowPin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      await fetchUsers();
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/users/${searchId}`);
      setUsers([response.data.user]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'User not found');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        await fetchUsers();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user');
        setShowError(true);
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      pin: '',
    });
    setShowEditModal(true);
  };

  const handleViewTransactions = async (user: User) => {
    try {
      const response = await api.get(`/admin/users/${user.studentId}`);
      setTransactions(response.data.transactions);
      setSelectedUser(user);
      setShowTransactionModal(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      setShowError(true);
    }
  };

  const validatePin = (pin: string): boolean => {
    return /^\d{5}$/.test(pin);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    // Validate first name and last name
    if (!editData.firstName.trim() || !editData.lastName.trim()) {
      setError('First name and last name are required');
      setShowError(true);
      return;
    }

    // Validate PIN if provided
    if (editData.pin) {
      if (!validatePin(editData.pin)) {
        setError('PIN must be exactly 5 digits');
        setShowError(true);
        return;
      }
    }

    try {
      await api.put(`/admin/users/${selectedUser._id}`, editData);
      setShowSuccess(true);
      setShowEditModal(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by Student ID"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    setError('');
                  }}
                  error={error}
                  className="text-lg"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="flex items-center gap-2 px-8">
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50] mx-auto"></div>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ৳{user.balance.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.isActive ? (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit User"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleViewTransactions(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Transactions"
                            >
                              <History className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-[#2C3E50] mb-6">
              Edit User: {selectedUser.studentId}
            </h3>
            <div className="space-y-4">
              <Input
                label="First Name"
                value={editData.firstName}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, firstName: e.target.value }))
                }
              />
              <Input
                label="Last Name"
                value={editData.lastName}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
              <div className="relative">
                <Input
                  label="New PIN (optional)"
                  type={showPin ? 'text' : 'password'}
                  value={editData.pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setEditData((prev) => ({ ...prev, pin: value }));
                  }}
                  placeholder="Enter new 5-digit PIN"
                  maxLength={5}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                >
                  {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {editData.pin && !validatePin(editData.pin) && (
                  <p className="mt-1 text-sm text-red-500">PIN must be exactly 5 digits</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update User</Button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {showTransactionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#2C3E50]">
                Transaction History: {selectedUser.studentId}
              </h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.transactionId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.transactionType === 'deposit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm capitalize">{transaction.category || '-'}</td>
                      <td className="px-4 py-2 text-sm font-medium">
                        <span
                          className={
                            transaction.transactionType === 'deposit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {transaction.transactionType === 'deposit' ? '+' : '-'}৳
                          {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{transaction.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        show={showSuccess}
        message="User updated successfully!"
        onClose={() => setShowSuccess(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        show={showError}
        message={error}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};