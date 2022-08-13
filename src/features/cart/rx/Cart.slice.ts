import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../../app/store";

export interface CartState {
  items : {
    [productID: string]: number
  }
}

const initialState: CartState = {
  items: {}
}

const cartSlice = createSlice({
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
    }
  }
});

export const { addToCart } = cartSlice.actions;
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