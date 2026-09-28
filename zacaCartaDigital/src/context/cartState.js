import { createContext } from 'react'

export const CartContext = createContext(null)

export const initialCartState = {
  items: [],
  tipPercentage: 0,
  isCartOpen: false,
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add-item': {
      const existingItem = state.items.find((item) => item.id === action.item.id)
      const items = existingItem
        ? state.items.map((item) => item.id === action.item.id
          ? { ...item, quantity: item.quantity + action.item.quantity }
          : item)
        : [...state.items, action.item]

      return { ...state, items }
    }
    case 'set-quantity':
      return {
        ...state,
        items: state.items.map((item) => item.id === action.id
          ? { ...item, quantity: action.quantity }
          : item),
      }
    case 'remove-item':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) }
    case 'clear-cart':
      return { ...state, items: [], tipPercentage: 0 }
    case 'set-tip':
      return { ...state, tipPercentage: action.percentage }
    case 'open-cart':
      return { ...state, isCartOpen: true }
    case 'close-cart':
      return { ...state, isCartOpen: false }
    default:
      return state
  }
}