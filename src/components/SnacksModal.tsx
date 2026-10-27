import React from 'react';
import { FoodItem, SnackOrderItem } from '../types';
import { Plus, Minus, Popcorn, ArrowRight, X, UtensilsCrossed } from 'lucide-react';

interface SnacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItems: FoodItem[];
  selectedSnacks: SnackOrderItem[];
  onUpdateQuantity: (item: FoodItem, delta: number) => void;
  onProceedToCheckout: () => void;
}

export const SnacksModal: React.FC<SnacksModalProps> = ({
  isOpen,
  onClose,
  foodItems,
  selectedSnacks,
  onUpdateQuantity,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const getQuantity = (itemId: string) => {
    const found = selectedSnacks.find((s) => s.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const totalSnacksAmount = selectedSnacks.reduce(
    (acc, s) => acc + s.item.price * s.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#090D16]">
          <div className="flex items-center gap-2">
            <Popcorn className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Grab Cinema Bites & Gourmet Popcorn
              </h3>
              <p className="text-xs text-slate-400">
                Freshly prepared and delivered straight to your cinema seat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close snack selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snacks Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foodItems.map((item) => {
              const qty = getQuantity(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-[#090D16] border border-slate-800 rounded-2xl p-3 flex gap-3 hover:border-slate-700 transition-colors"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        />
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ₹{item.price}
                      </span>

                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                          <button
                            onClick={() => onUpdateQuantity(item, -1)}
                            className="text-slate-300 hover:text-white p-0.5"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white font-mono w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item, 1)}
                            className="text-slate-300 hover:text-white p-0.5"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onUpdateQuantity(item, 1)}
                          className="px-3 py-1 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 hover:border-rose-500 transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Food & Beverages</span>
            <span className="text-base font-mono font-bold text-emerald-400">
              ₹{totalSnacksAmount}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onProceedToCheckout}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold hover:text-white transition-colors"
            >
              Skip F&B
            </button>
            <button
              onClick={onProceedToCheckout}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950/40 flex items-center gap-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
