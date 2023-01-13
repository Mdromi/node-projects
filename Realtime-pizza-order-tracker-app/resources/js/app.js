import axios from 'axios'
import Noty from 'noty'
// import { initAdmin } from './admin'
// import moment from 'moment'
// import { initStripe } from './stripe'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        console.log(res);
    })
}

addToCart.forEach(btn => {
    btn.addEventListener('click', e => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})