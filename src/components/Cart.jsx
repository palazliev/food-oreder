import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContect from "../store/CartContect";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import UserProgressContect from "../store/UserProgressContext";
import CartItem from "./CartItem";

export default function Cart() {
  const cartContext = useContext(CartContect);
  const userProgressContect = useContext(UserProgressContect);

  const cartTotal = cartContext.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);

  function handleCloseCart() {
    userProgressContect.hideCart();
  }

  function handleGoToCheckout() {
    userProgressContect.showCheckout();
  }

  return (
    <Modal
      className="cart"
      open={userProgressContect.progress === "cart"}
      onClose={userProgressContect.progress === "cart" ? handleCloseCart : null}
    >
      <h2>Your cart</h2>

      <ul>
        {cartContext.items.map((item) => {
          return (
            <CartItem
              key={item.id}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
              onIncrease={() => cartContext.addItem(item)}
              onDescrease={() => cartContext.removeItem(item.id)}
            />
          );
        })}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button onClick={handleCloseCart} textOnly>
          Close
        </Button>
        {cartContext.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go To Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
