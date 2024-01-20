import { useContext } from "react";
import HeaderLogo from "../assets/logo.jpg";
import Button from "./UI/Button";
import CartContect from "../store/CartContect";
import UserProgressContect from "../store/UserProgressContext";

export default function Header() {
  const cartContext = useContext(CartContect);
  const userProgressContect = useContext(UserProgressContect);

  const totalCartItems = cartContext.items.reduce(
    (totalNumberOfItems, item) => {
      return totalNumberOfItems + item.quantity;
    },
    0
  );

  function handleShowCart() {
    userProgressContect.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={HeaderLogo} alt="Logo" />
        <h1>Food Ordering App</h1>
      </div>
      <nav>
        <Button onClick={handleShowCart} textOnly>
          Cart ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
