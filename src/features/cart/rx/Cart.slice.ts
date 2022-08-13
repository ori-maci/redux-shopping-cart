import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "../../../app/store";
import classNames from "classnames";
import { CartItems, checkout } from "../../../app/api";

type CheckoutState = "LOADING" | "READY" | "ERROR";

export interface CartState {
  items : {
    [productID: string]: number;
  },
  checkoutState: CheckoutState;
  errorMessage: string;
}

const initialState: CartState = {
  items: {},
  checkoutState: "READY",
  errorMessage: ""
}

export const checkoutCart = createAsyncThunk("cart/checkout", async (items: CartItems) => {
  const response = await checkout(items);
  return response;
})

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state.items[id]) {
        state.items[id]++;
      } else {
        state.items[id] = 1;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    updateQuantity(state, action: PayloadAction<{ id: string, quantity: number}>) {
      const { id, quantity } = action.payload;
      state.items[id] = quantity;
    }
  },
  extraReducers: function(builder) {
    builder.addCase(checkoutCart.pending, (state) => {
      state.checkoutState = "LOADING";
    })
    builder.addCase(checkoutCart.fulfilled, (state) => {
      state.checkoutState = "READY";
    })
    builder.addCase(checkoutCart.rejected, (state, action) => {
      state.checkoutState = "ERROR";
      state.errorMessage = action.error.message || "";
    })
  }
});

// export function checkout() {
//   return function checkoutThunk(dispatch: AppDispatch) {
//     dispatch({ type: "cart/checkout/pending" });
//     setTimeout(() => dispatch({ type: "cart/checkout/fulfilled" }), 500);
//   }
// }

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;


// Called several times 
export function getNumItems(state: RootState) {

  console.log(`Calling numItems`);

  let numItems = 0;

  for (let id in state.cart.items) { 
    numItems += state.cart.items[id];
  }

  return numItems;
}

// vs called once because value of slice has not changed
export const getMemoizedNumItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => {
    console.log(`Calling getMemoizedNumItems`);

    let numItems = 0;

    for (let id in items) { 
      numItems += items[id];
    }

    return numItems;
  }
);

export const getTotalPrice = createSelector<RootState, any, any, string>(
  (state: RootState) => state.cart.items,
  (state: RootState) => state.products.products,
  (items, products) => {
    let total = 0;

    for (let id in items) {
      total += products[id].price * items[id];
    }

    return total.toFixed(2);
  }
)