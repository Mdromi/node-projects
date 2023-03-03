import axios from 'axios';
import toast from 'toast-me';
// import { initAdmin } from './admin'
// import moment from 'moment'
// import { initStripe } from './stripe'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

const updateCart = (pizza) => {
    axios.post('/update-cart', pizza).then(res => {
        console.log(res);
        cartCounter.innerText = res.data.totalQty
        toast('Item added to cart');
    }).catch(err => {
        toast('Something want wrong', 'error');
    })
}

addToCart.forEach(btn => {
    btn.addEventListener('click', e => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza)
    })
})