import { AlertCircle } from 'lucide-react';
import { Modal } from './Modal';

interface ErrorModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const ErrorModal = ({ show, message, onClose }: ErrorModalProps) => {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center gap-3 text-red-600 mb-2">
        <AlertCircle className="h-6 w-6" />
        <h3 className="text-lg font-semibold">Error</h3>
      </div>
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
};