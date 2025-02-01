import { CreditCard, Wallet, History, Lock } from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  icon: JSX.Element;
}

const guides: GuideStep[] = [
  {
    title: "Making Payments",
    description: "Select 'Make Payment' from the sidebar, choose a payment category, enter the amount and description, then verify with your PIN.",
    icon: <CreditCard className="h-6 w-6" />
  },
  {
    title: "Top Up Your Wallet",
    description: "Click 'Wallet Top Up', enter the amount (minimum 100 Taka), and choose your preferred payment method.",
    icon: <Wallet className="h-6 w-6" />
  },
  {
    title: "View Transactions",
    description: "Access your transaction history through the sidebar to view all past payments and top-ups.",
    icon: <History className="h-6 w-6" />
  },
  {
    title: "Security Tips",
    description: "Never share your PIN, regularly check your transaction history, and contact support if you notice any suspicious activity.",
    icon: <Lock className="h-6 w-6" />
  }
];

export const GuideSection = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {guides.map((guide, index) => (
        <div
          key={index}
          className="p-6 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4 text-[#2C3E50]">
            {guide.icon}
            <h3 className="font-semibold">{guide.title}</h3>
          </div>
          <p className="text-gray-600">{guide.description}</p>
        </div>
      ))}
    </div>
  );
};