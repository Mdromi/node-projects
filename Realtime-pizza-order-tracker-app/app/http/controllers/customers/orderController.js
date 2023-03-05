const Order = require("../../../models/order");
const moment = require('moment')

const orderController = () => {
    return {
        async store(req, res) {
            const {phone , address} = req.body;

            // validate request
            if(!phone || !address) {
                req.flash('error', 'All fields require');
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            try {
                await order.save();
                req.flash('success', 'Order placed successfully');
                delete req.session.cart
                return res.redirect('/customers/orders');
            } catch (err) {
                req.flash('error', 'Something want wrong');
                return res.redirect('/cart');
            }
        },
        async index(req, res) {
            const orders = await Order.find({customerId: req.user._id}, null, {sort: {'createdAt': -1}});
            res.header('Cache-Control', 'no-store');
            res.render('customers/orders', {orders: orders, moment: moment})
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
    }
}

module.exports = orderController;