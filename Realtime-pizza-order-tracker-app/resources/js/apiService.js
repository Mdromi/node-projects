import axios from "axios";

export const placeOrder = (formObject) => {
  try {
    const data = axios.post("/orders", formObject);
    window.location.href = "/customer/orders";
  } catch (err) {
    console.log(err);
  }
};
