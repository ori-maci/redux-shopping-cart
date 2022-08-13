import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/rx/Cart.slice";
import productsReducer from "../features/products/rx/Product.slice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.getState;