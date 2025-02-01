import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface BudgetPlannerProps {
  budgets: Record<string, number>;
  onUpdateBudget: (category: string, amount: number) => Promise<void>;
}

const CATEGORIES = ['canteen', 'library', 'lab', 'club', 'other'];

export const BudgetPlanner = ({ budgets, onUpdateBudget }: BudgetPlannerProps) => {
  const [editMode, setEditMode] = useState(false);
  const [newBudgets, setNewBudgets] = useState(budgets);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    try {
      await Promise.all(
        Object.entries(newBudgets).map(([category, amount]) => 
          onUpdateBudget(category, amount)
        )
      );
      setEditMode(false);
    } catch (err) {
      setError('Failed to update budgets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#2C3E50]">Budget Planning</h3>
        {!editMode && (
          <Button onClick={() => setEditMode(true)}>Edit Budgets</Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 capitalize">{category}</span>
              {editMode ? (
                <input
                  type="number"
                  value={newBudgets[category]}
                  onChange={(e) => setNewBudgets(prev => ({
                    ...prev,
                    [category]: Number(e.target.value)
                  }))}
                  className="w-24 px-2 py-1 border rounded-md"
                  min="0"
                  step="100"
                />
              ) : (
                <span className="font-medium text-[#2C3E50]">
                  ৳{budgets[category]?.toLocaleString()}
                </span>
              )}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    ((budgets[category] || 0) / (newBudgets[category] || 1)) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {editMode && (
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              setEditMode(false);
              setNewBudgets(budgets);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
};