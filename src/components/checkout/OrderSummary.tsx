import { CartItem } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface OrderSummaryProps {
  items: CartItem[];
  subtotalInCurrentCurrency: number;
  currencySymbol: string;
  taxes: {
    gst: number;
    pst: number;
    hst: number;
  };
  selectedShippingOption: {
    price: number;
    name: string;
  } | undefined;
  total: number;
  activePromoCode: {
    code: string;
    discount: number;
  } | null;
}

export const OrderSummary = ({
  items,
  subtotalInCurrentCurrency,
  currencySymbol,
  taxes,
  selectedShippingOption,
  total,
  activePromoCode
}: OrderSummaryProps) => {
  const [promoCode, setPromoCode] = useState("");
  const { applyPromoCode, removePromoCode } = useCart();

  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      applyPromoCode(promoCode.trim());
      setPromoCode("");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
      
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>{item.quantity}x {item.name}</span>
          <span>{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="border-t pt-4 mt-4">
        <div className="space-y-2 mb-4">
          <h3 className="font-medium">Promo Code</h3>
          {activePromoCode ? (
            <div className="flex justify-between items-center bg-accent-green p-2 rounded">
              <span className="text-sm">
                Code <strong>{activePromoCode.code}</strong> applied ({activePromoCode.discount}% off)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={removePromoCode}
                className="text-sm hover:bg-red-100"
              >
                Remove
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePromoCodeSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">Apply</Button>
            </form>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currencySymbol}{subtotalInCurrentCurrency.toFixed(2)}</span>
          </div>
          
          {activePromoCode && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({activePromoCode.discount}%)</span>
              <span>-{currencySymbol}{(subtotalInCurrentCurrency * activePromoCode.discount / 100).toFixed(2)}</span>
            </div>
          )}

          {taxes.gst > 0 && (
            <div className="flex justify-between">
              <span>GST ({taxes.gst}%)</span>
              <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.gst / 100).toFixed(2)}</span>
            </div>
          )}
          
          {taxes.pst > 0 && (
            <div className="flex justify-between">
              <span>PST ({taxes.pst}%)</span>
              <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.pst / 100).toFixed(2)}</span>
            </div>
          )}
          
          {taxes.hst > 0 && (
            <div className="flex justify-between">
              <span>HST ({taxes.hst}%)</span>
              <span>{currencySymbol}{(subtotalInCurrentCurrency * taxes.hst / 100).toFixed(2)}</span>
            </div>
          )}
          
          {selectedShippingOption && (
            <div className="flex justify-between">
              <span>Shipping ({selectedShippingOption.name})</span>
              <span>{currencySymbol}{selectedShippingOption.price.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};