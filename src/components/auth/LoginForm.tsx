import { useState } from "react";
import { School, Shield, Eye, EyeOff, Coins } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { RoleSelector } from "./RoleSelector";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/auth.ts";
import type { LoginFormData, UserRole } from "../../types/auth.ts";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginService({
        username: formData.username,
        password: formData.password,
      });

      if (response.role !== formData.role) {
        throw new Error("Invalid credentials");
      }

      login(response.token, {
        _id: response._id,
        username: response.username,
        email: response.email,
        role: response.role,
      });
    } catch (err) {
      setError("Wrong username or password");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md bg-white rounded-lg shadow-lg p-8 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-6 hover-lift">
            <Coins className="h-12 w-12 text-[#FFD700]" />
            <h1 className="text-3xl font-bold text-[#2C3E50]">EDU COIN</h1>
          </div>
          <div className="flex justify-center mb-6 hover-lift">
            {formData.role === "admin" ? (
              <Shield className="h-12 w-12 text-[#FFD700]" />
            ) : (
              <School className="h-12 w-12 text-[#FFD700]" />
            )}
          </div>
          <p className="text-[#666] text-sm">
            Welcome back! Please login to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                error={error}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[#2C3E50] font-medium">
              Select Role
            </label>
            <RoleSelector
              selectedRole={formData.role}
              onChange={handleRoleChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link
              to="/forgot-password"
              className="text-[#2C3E50] hover:text-[#1A2533] transition-colors"
            >
              Forgot password?
            </Link>
            <Link
              to="/register"
              className="text-[#2C3E50] hover:text-[#1A2533] transition-colors"
            >
              Register
            </Link>
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading
              ? "Logging in..."
              : `Login as ${
                  formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
                }`}
          </Button>
        </form>
      </div>
    </div>
  );
};
