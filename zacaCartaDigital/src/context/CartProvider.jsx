import { useReducer } from 'react'
import { CartContext, cartReducer, initialCartState } from './cartState'

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tipAmount = Math.round(subtotal * state.tipPercentage / 100)

  const value = {
    ...state,
    itemCount,
    subtotal,
    tipAmount,
    total: subtotal + tipAmount,
    addItem: (item, quantity) => dispatch({
      type: 'add-item',
      item: { ...item, quantity },
    }),
    setQuantity: (id, quantity) => dispatch({ type: 'set-quantity', id, quantity }),
    removeItem: (id) => dispatch({ type: 'remove-item', id }),
    clearCart: () => dispatch({ type: 'clear-cart' }),
    setTipPercentage: (percentage) => dispatch({ type: 'set-tip', percentage }),
    openCart: () => dispatch({ type: 'open-cart' }),
    closeCart: () => dispatch({ type: 'close-cart' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider