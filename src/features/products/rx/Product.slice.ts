import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../app/api"


export interface ProductState {
  [id: string]: Product;
}

export interface ProductsState {
  products: ProductState
}

const initialState: ProductsState = {
  products: {}
}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    receivedProducts(state, action: PayloadAction<Product[]>) {
      const products = action.payload;

      products.forEach(product => {
        state.products[product.id] = product;
      })
    }
  }
});

export const { receivedProducts } = productSlice.actions;
export default productSlice.reducer;