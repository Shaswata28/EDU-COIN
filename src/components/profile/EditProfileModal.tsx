import { useState, useEffect } from 'react';
import { X, Save, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SuccessModal } from '../common/SuccessModal';
import { ErrorModal } from '../common/ErrorModal';
import { PasswordStrengthIndicator } from '../common/PasswordStrengthIndicator';
import { getUserProfile, updateProfile, updatePassword } from '../../services/profile';

interface EditProfileModalProps {
  onClose: () => void;
}

type EditMode = 'profile' | 'password';

export const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
  const [editMode, setEditMode] = useState<EditMode>('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    pin: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setProfileData({
          firstName: profile.firstName,
          lastName: profile.lastName,
        });
      } catch (err) {
        setError('Failed to load profile');
        setShowError(true);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.firstName || !profileData.lastName) {
      setError('Both first and last name are required');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(profileData);
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to update profile');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.pin) {
      setError('All fields are required');
      setShowError(true);
      return;
    }

    if (passwordData.pin.length !== 5) {
      setError('PIN must be exactly 5 digits');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(passwordData);
      setShowSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        pin: ''
      });
    } catch (err) {
      setError('Failed to update password. Please check your current password and PIN.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2C3E50]">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setEditMode('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${editMode === 'profile'
                ? 'bg-[#2C3E50] text-white'
                : 'text-[#2C3E50] hover:bg-gray-100'
              }`}
          >
            <User className="h-4 w-4" />
            Edit Name
          </button>
          <button
            onClick={() => setEditMode('password')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${editMode === 'password'
                ? 'bg-[#2C3E50] text-white'
                : 'text-[#2C3E50] hover:bg-gray-100'
              }`}
          >
            <Lock className="h-4 w-4" />
            Change Password
          </button>
        </div>

        {editMode === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                disabled={isLoading}
              />
              <Input
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <PasswordStrengthIndicator password={passwordData.newPassword} />

            <div className="relative">
              <Input
                label="Confirm with PIN"
                type={showPin ? "text" : "password"}
                maxLength={5}
                value={passwordData.pin}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  pin: e.target.value.replace(/\D/g, '').slice(0, 5)
                }))}
                placeholder="Enter your 5-digit PIN"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPin ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        )}

        <SuccessModal
          show={showSuccess}
          message={editMode === 'profile' 
            ? "Profile updated successfully!" 
            : "Password updated successfully!"}
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />

        <ErrorModal
          show={showError}
          message={error}
          onClose={() => setShowError(false)}
        />
      </div>
    </div>
  );
};