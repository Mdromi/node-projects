import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from './apiService';
import { CardWidget } from "./CardWidget";

export const initStripe = async () => {
  const stripe = await loadStripe(
    "pk_test_51MihhYSClHMWnXXFhLWCh9dLfIaVrajqfrBXHv27iQ8izPswkVvBQgo7RYvoa9O88NKzeIDswd80FP6nNHwpbjqz00rvcJfu9S"
  );

  let card = null;

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) return;

  paymentType.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      // Display Widget
      card = new CardWidget(stripe);
      card.mount();
    } else card.destroy();
  });

  // Ajax Call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(paymentForm);
      const formObject = {};

      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      if (!card) { 
        // Ajax
        placeOrder(formObject);
        return;
      }

      const token = await card.createToken();
      formObject.stripeToken = token.id;
      placeOrder(formObject);
    });
  }
};
