import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  getUserProfile,
  updateProfile,
  updatePassword,
} from "../services/profile";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Eye, EyeOff, User, Lock, Save, Edit, Mail, Hash } from "lucide-react";
import { PasswordStrengthIndicator } from "../components/common/PasswordStrengthIndicator";
import { SuccessModal } from "../components/common/SuccessModal";
import { ErrorModal } from "../components/common/ErrorModal";

export const ProfilePage = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
  });
  const [originalProfileData, setOriginalProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    pin: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        const profileInfo = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email || "",
          studentId: profile.studentId || "",
        };
        setProfileData(profileInfo);
        setOriginalProfileData(profileInfo);
      } catch (err) {
        setError("Failed to load profile");
        setShowError(true);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.firstName || !profileData.lastName) {
      setError("Both first and last name are required");
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(profileData);
      setOriginalProfileData({ ...profileData });
      setSuccessMessage("Profile updated successfully!");
      setShowSuccess(true);
      setIsEditMode(false);
    } catch (err) {
      setError("Failed to update profile");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.pin
    ) {
      setError("All fields are required");
      setShowError(true);
      return;
    }

    if (passwordData.pin.length !== 5) {
      setError("PIN must be exactly 5 digits");
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(passwordData);
      setSuccessMessage("Password updated successfully!");
      setShowSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        pin: "",
      });
    } catch (err) {
      setError(
        "Failed to update password. Please check your current password and PIN."
      );
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({ ...originalProfileData });
    setIsEditMode(false);
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      <Header
        username={user.username}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2C3E50]">
                  Profile Settings
                </h2>
                {activeTab === "profile" && !isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Edit profile"
                  >
                    <Edit className="h-5 w-5 text-[#2C3E50]" />
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    if (isEditMode) {
                      setProfileData({ ...originalProfileData });
                      setIsEditMode(false);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${
                      activeTab === "profile"
                        ? "bg-[#2C3E50] text-white"
                        : "text-[#2C3E50] hover:bg-gray-100"
                    }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab("security");
                    if (isEditMode) {
                      setProfileData({ ...originalProfileData });
                      setIsEditMode(false);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${
                      activeTab === "security"
                        ? "bg-[#2C3E50] text-white"
                        : "text-[#2C3E50] hover:bg-gray-100"
                    }`}
                >
                  <Lock className="h-4 w-4" />
                  Security
                </button>
              </div>

              {/* Profile View/Edit Form */}
              {activeTab === "profile" && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Read-only Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                        </div>
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                          {profileData.email}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Hash className="h-4 w-4 text-gray-500 mr-2" />
                          <label className="block text-sm font-medium text-gray-700">
                            Student ID
                          </label>
                        </div>
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                          {profileData.studentId}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editable Information */}
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditMode ? (
                      <>
                        <Input
                          label="First Name"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
                        <Input
                          label="Last Name"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                            {profileData.firstName}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                            {profileData.lastName}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {isEditMode && (
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-red-500 text-white hover:bg-red-600" // Updated this line
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
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </form>
              )}

              {/* Security Form */}
              {activeTab === "security" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
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
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
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

                  <PasswordStrengthIndicator
                    password={passwordData.newPassword}
                  />

                  <div className="relative">
                    <Input
                      label="Confirm with PIN"
                      type={showPin ? "text" : "password"}
                      maxLength={5}
                      value={passwordData.pin}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          pin: e.target.value.replace(/\D/g, "").slice(0, 5),
                        }))
                      }
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

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>

      <SuccessModal
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />

      <ErrorModal
        show={showError}
        message={error}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};
