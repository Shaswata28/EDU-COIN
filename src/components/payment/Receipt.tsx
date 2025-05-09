import { Download, Coins } from 'lucide-react';
import { Button } from '../common/Button';
import jsPDF from 'jspdf';

interface ReceiptProps {
  transactionId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  onClose: () => void;
}

export const Receipt = ({ 
  transactionId, 
  amount, 
  category, 
  description, 
  date,
  onClose 
}: ReceiptProps) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add logo and header
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80); // #2C3E50
    doc.text('EDU COIN', 105, 20, { align: 'center' });
    
    // Add receipt details
    doc.setFontSize(16);
    doc.text('Payment Receipt', 105, 40, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    
    const startY = 60;
    const lineHeight = 10;
    
    doc.text(`Transaction ID: ${transactionId}`, 20, startY);
    doc.text(`Date: ${new Date(date).toLocaleString()}`, 20, startY + lineHeight);
    doc.text(`Category: ${category}`, 20, startY + lineHeight * 2);
    doc.text(`Description: ${description}`, 20, startY + lineHeight * 3);
    
    // Add amount with larger font
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'normal'); // Ensure a font that supports the symbol is used
    doc.text(`Amount: BDT ${amount.toFixed(2)}`, 20, startY + lineHeight * 4);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for using EDU COIN', 105, 250, { align: 'center' });
    
    // Save PDF
    doc.save(`EDU_COIN_Receipt_${transactionId}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full animate-scaleIn">
      <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-[#2C3E50]">Payment Successful!</h2>
          </div>
          <p className="text-gray-600">Your transaction has been completed.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-medium text-[#2C3E50]">{transactionId}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Date</span>
            <span className="font-medium text-[#2C3E50]">
              {new Date(date).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Category</span>
            <span className="font-medium text-[#2C3E50] capitalize">{category}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Description</span>
            <span className="font-medium text-[#2C3E50]">{description}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Amount</span>
            <span className="text-xl font-bold text-[#2C3E50]">৳{amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={generatePDF}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};