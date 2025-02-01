interface PaymentCategoryProps {
    category: string;
    isSelected: boolean;
    onClick: () => void;
  }
  
  export const PaymentCategory = ({ 
    category, 
    isSelected, 
    onClick 
  }: PaymentCategoryProps) => {
    return (
      <button
        onClick={onClick}
        className={`p-4 rounded-lg border-2 transition-all duration-200 text-center
          ${isSelected 
            ? 'border-[#2C3E50] bg-[#2C3E50] text-white' 
            : 'border-gray-200 hover:border-[#2C3E50] text-gray-600 hover:text-[#2C3E50]'
          }`}
      >
        <span className="font-medium">{category}</span>
      </button>
    );
  };