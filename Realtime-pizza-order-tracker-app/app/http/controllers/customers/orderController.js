const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const orderController = () => {
  return {
    async store(req, res) {
      const { phone, address, stripeToken, paymentType } = req.body;

      // validate request
      if (!phone || !address)
        return res.status(422).json({ message: "All fields are required" });

        console.log('req.session.cart', req.session.cart);

      const order = await new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });

      try {
        const result = await order.save();
        Order.populate(
          result,
          { path: "customerId" },
          async (err, placedOrder) => {
            // Stripe payment
            if (paymentType === "card") {
              try {
                stripe.charges.create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "inr",
                  description: `Pizza order: ${placedOrder._id}`,
                });

                placedOrder.paymentStatus = true;
                placedOrder.paymentType = paymentType;
                const ord = await placedOrder.save();

                // Emit
                const eventEmitter = req.app.get("eventEmitter");
                eventEmitter.emit("orderPlaced", ord);
                delete req.session.cart;
                return res.json({
                  message: "Payment successful, Order placed successfully",
                });
              } catch (err) {
                console.log(err);
                delete req.session.cart;
                return res.json({
                  message:
                    "OrderPlaced but payment failed, You can pay at delivery time",
                });
              }
            } else {
              // Emit
              const eventEmitter = req.app.get("eventEmitter");
              delete req.session.cart;
              eventEmitter.emit("orderPlaced", placedOrder);
              return res.json({ message: "Order placed successfully" });
            }
          }
        );
      } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
      }
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header("Cache-Control", "no-store");
      res.render("customers/orders", { orders: orders, moment: moment });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // Authorize user
      if (req.user._id.toString() === order.customerId.toString())
        return res.render("customers/singleOrder", { order });
      return res.redirect("/");
    },
  };
};

module.exports = orderController;
