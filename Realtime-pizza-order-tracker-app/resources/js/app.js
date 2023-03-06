import axios from "axios";
import moment from "moment";
import toast from "toast-me";
import { initAdmin } from "./admin";
import { initStripe } from "./stripe";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");

const updateCart = (pizza) => {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      console.log(res);
      cartCounter.innerText = res.data.totalQty;
      toast("Item added to cart");
    })
    .catch((err) => {
      toast("Something want wrong", "error");
    });
};

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

// Remove alert message after X seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Change order status
let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;

    if (stepCompleted) status.classList.add("step-completed");

    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling)
        status.nextElementSibling.classList.add("current");
    }
  });
}

updateStatus(order); 

initStripe()


// Socket
let socket = io();

// join
if (order) socket.emit("join", `order_${order._id}`);

let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updateOrder = { ...order };
  updateOrder.updatedAt = moment().format();
  updateOrder.status = data.status;
  console.log(order);
  updateStatus(updateOrder);
});
