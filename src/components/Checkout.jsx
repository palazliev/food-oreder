import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContect from "../store/CartContect";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContect from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestconfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartContext = useContext(CartContect);
  const userProgressContext = useContext(UserProgressContect);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestconfig);

  const cartTotal = cartContext.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);

  function handleClose() {
    userProgressContext.hideCheckout();
  }

  function handleFinish() {
    userProgressContext.hideCheckout();
    cartContext.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault(0);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartContext.items,
          customer: data,
        },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressContext.progress === "checkout"}
        onClose={handleClose}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully!</p>
        <p>
          We will get back to you with more details via email in the next few
          minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>OK</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      open={userProgressContext.progress === "checkout"}
      onClose={userProgressContext.progress === "checkout" ? handleClose : null}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input id="name" label="Full name" type="text" />
        <Input id="email" label="Email" type="email" />
        <Input id="street" label="Street" type="text" />
        <div className="control-row">
          <Input id="postal-code" label="Postal code" type="text" />
          <Input id="city" label="City" type="text" />
        </div>

        {error && <Error title="Failed to submit order!" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
