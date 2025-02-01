import { type ReactNode } from 'react';
import { School, Shield } from 'lucide-react';
import type { UserRole } from '../../types/auth';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

interface RoleOption {
  value: UserRole;
  label: string;
  icon: ReactNode;
}

const roles: RoleOption[] = [
  { value: 'student', label: 'Student', icon: <School className="h-5 w-5" /> },
  { value: 'admin', label: 'Admin', icon: <Shield className="h-5 w-5" /> },
];

export const RoleSelector = ({ selectedRole, onChange, disabled }: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          disabled={disabled}
          className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200
            ${selectedRole === value
              ? 'border-[#2C3E50] bg-[#2C3E50] text-white'
              : 'border-gray-200 hover:border-[#2C3E50] text-gray-600 hover:text-[#2C3E50]'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {icon}
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};