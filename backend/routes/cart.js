const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const cartcontroller = require("../controllers/cart.js")

router.post('/', isLoggedIn, cartcontroller.addTocart);

router.get('/', isLoggedIn, cartcontroller.getCart);

router.delete('/', isLoggedIn, cartcontroller.clearUserCart);

router.delete('/:listingId', isLoggedIn, cartcontroller.deletecart);

module.exports = router;
