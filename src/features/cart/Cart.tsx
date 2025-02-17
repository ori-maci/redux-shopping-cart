import classNames from "classnames";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./Cart.module.css";
import { checkoutCart, getTotalPrice, removeFromCart, updateQuantity } from "./rx/Cart.slice";

export function Cart() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const items = useAppSelector((state) => state.cart.items);
  const totalPrice = useAppSelector(getTotalPrice);
  const checkoutState = useAppSelector((state) => state.cart.checkoutState);
  const errorMessage = useAppSelector((state) => state.cart.errorMessage);

  function onQuantityChanged(
    e: React.FocusEvent<HTMLInputElement>,
    id: string
  ) {
    const quantity = +e.target.value || 0;
    dispatch(updateQuantity({ id, quantity }));
  }

  const tableClasses = classNames({
    [styles.table]: true,
    [styles.checkoutError]: checkoutState === "ERROR",
    [styles.checkoutLoading]: checkoutState === "LOADING"
  });

  function onCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(checkoutCart());
  }

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([id, quantity]) => {
            return (
              <tr>
                <td>{products[id].name}</td>
                <td>
                  <input
                    type="text"
                    className={styles.input}
                    defaultValue={quantity}
                    onBlur={(e) => onQuantityChanged(e, id)}
                  />
                </td>
                <td>${products[id].price}</td>
                <td>
                  <button
                    aria-label={`Remove ${products[id].name} from Shopping Cart`}
                    onClick={() => dispatch(removeFromCart(id))}
                  >
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={onCheckout}>
        {
          checkoutState === "ERROR" && errorMessage ? 
          (
            <p className={styles.errorBox}>
              {errorMessage}
            </p>
          ) : null
        }
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}
