import { CheckCircle } from 'lucide-react';
import { Modal } from './Modal';

interface SuccessModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessModal = ({ show, message, onClose }: SuccessModalProps) => {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center gap-3 text-green-600 mb-2">
        <CheckCircle className="h-6 w-6" />
        <h3 className="text-lg font-semibold">Success</h3>
      </div>
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
};