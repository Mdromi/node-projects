import axios from "axios";

export const initStripe = async () => {
    const stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    
  const paymentType = document.querySelector("#paymentType");
  paymentType.addEventListener("change", (e) => {
   if(e.target.value === 'card') {
    // Display widget
   } else {

   }
  });

  // Ajax Call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(paymentForm);
      const formObject = {};

      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      try {
        const data = axios.post("/orders", formObject);
        window.location.href = "/customer/orders";
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    });
  }
};

