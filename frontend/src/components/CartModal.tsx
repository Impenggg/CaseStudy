import React from 'react';

const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="#6b7280">No Image</text>
    </svg>`
  );

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
  // Optional: disable checkout action (e.g., for artisan users)
  disableCheckout?: boolean;
  // Optional: reason to display when checkout is disabled
  disabledReason?: string;
  // Optional: disable increasing quantity (treat as adding)
  disableIncrease?: boolean;
  // Optional: reason to display when increase is disabled
  disableIncreaseReason?: string;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  disableCheckout = false,
  disabledReason,
  disableIncrease = false,
  disableIncreaseReason
}) => {
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 z-[90] pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 relative z-[100] pointer-events-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-cordillera-olive to-cordillera-sage text-cordillera-cream p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cordillera-gold/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cordillera-gold/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6 text-cordillera-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-light tracking-wide">Shopping Cart</h3>
                  <p className="text-cordillera-cream/90 text-sm font-medium">
                    {cartCount === 0 ? 'Your cart is empty' : `${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart`}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-cordillera-gold/20 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-cordillera-sage/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-cordillera-olive/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9" />
                  </svg>
                </div>
                <h4 className="text-xl font-serif text-cordillera-olive mb-2">Your cart is empty</h4>
                <p className="text-cordillera-olive/60 mb-6">Start shopping to add items to your cart</p>
                <button 
                  onClick={onClose}
                  className="bg-cordillera-gold text-cordillera-olive px-6 py-3 rounded-lg font-medium hover:bg-cordillera-gold/90 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="group bg-cordillera-cream/30 rounded-2xl border border-cordillera-sage/20 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={item.image || PLACEHOLDER_IMG}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border border-cordillera-sage/30"
                          onError={(e) => { const t = e.currentTarget as HTMLImageElement; if (t.src !== PLACEHOLDER_IMG) t.src = PLACEHOLDER_IMG; }}
                        />
                        <div className="absolute -top-2 -right-2 bg-cordillera-gold text-cordillera-olive text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-cordillera-olive truncate mb-1">{item.name}</h4>
                        {typeof item.stock === 'number' && (
                          <p className="text-xs mb-1">
                            {item.stock === 0 ? (
                              <span className="text-red-600 font-medium">Out of stock</span>
                            ) : item.stock <= 5 ? (
                              <span className="text-orange-600">Only <span className="font-semibold">{item.stock}</span> left</span>
                            ) : (
                              <span className="text-cordillera-olive/70">Available: <span className="font-medium text-cordillera-olive">{item.stock}</span></span>
                            )}
                          </p>
                        )}
                        <p className="text-cordillera-gold font-bold text-lg">₱{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-cordillera-sage/40 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => onDecrement(item.id)} 
                            className="px-3 py-1 bg-cordillera-sage/10 hover:bg-cordillera-sage/20 transition-colors text-cordillera-olive font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-cordillera-olive font-bold bg-white min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onIncrement(item.id)} 
                            disabled={disableIncrease || (typeof item.stock === 'number' && item.quantity >= item.stock)}
                            title={
                              disableIncrease
                                ? (disableIncreaseReason || 'Quantity increase is disabled')
                                : (typeof item.stock === 'number' && item.quantity >= item.stock)
                                  ? 'Reached available stock'
                                  : undefined
                            }
                            className={`px-3 py-1 bg-cordillera-sage/10 hover:bg-cordillera-sage/20 transition-colors text-cordillera-olive font-bold ${
                              disableIncrease || (typeof item.stock === 'number' && item.quantity >= item.stock)
                                ? 'opacity-50 cursor-not-allowed hover:bg-cordillera-sage/10'
                                : ''
                            }`}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)} 
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-cordillera-olive font-bold text-lg">₱{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-cordillera-sage/30 bg-gradient-to-r from-white to-cordillera-cream/30 p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold text-cordillera-olive">
                  <span>Total ({cartCount} items)</span>
                  <span className="text-2xl text-cordillera-gold">₱{cartTotal.toLocaleString()}</span>
                </div>
                {disableCheckout && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3" role="note">
                    {disabledReason || 'Checkout is disabled for your account.'}
                  </div>
                )}
                <div className="flex gap-3">
                  <button 
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border-2 border-cordillera-olive/20 text-cordillera-olive rounded-lg font-medium hover:bg-cordillera-olive/5 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button 
                    onClick={onCheckout}
                    disabled={disableCheckout}
                    title={disableCheckout ? (disabledReason || 'Checkout disabled') : undefined}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors shadow-lg transform ${disableCheckout 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90 hover:shadow-xl hover:-translate-y-0.5'}`}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;

