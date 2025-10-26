const Cart = require('../models/cart');
const Listing = require('../models/listing');

module.exports.addTocart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { listingId } = req.body;

        if (!listingId) {
            return res.status(400).json({ success: false, message: 'Listing ID is required.' });
        }

        const listingExists = await Listing.findById(listingId);
        if (!listingExists) {
            return res.status(404).json({ success: false, message: 'Listing not found.' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item =>
            item.listing && item.listing.toString() === listingId.toString()
        );

        let addedOrUpdatedItemStructure;

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += 1;
            addedOrUpdatedItemStructure = cart.items[existingItemIndex];
        } else {
            const newItem = { listing: listingId, quantity: 1 };
            cart.items.push(newItem);
            addedOrUpdatedItemStructure = newItem;
        }

        const savedCart = await cart.save();

        const finalItem = savedCart.items.find(item => item.listing.toString() === listingId.toString());

        if (!finalItem) {
            console.error("Cart item not found after save, listingId:", listingId);
            return res.status(500).json({ success: false, message: 'Error retrieving item after adding to cart.' });
        }

        const responseItem = {
            _id: finalItem._id,
            quantity: finalItem.quantity,
            listing: {
                _id: listingExists._id,
                title: listingExists.title,
                price: listingExists.price,
                image: listingExists.image
            }
        };

        res.status(200).json({
            success: true,
            message: 'Item added to cart.',
            item: responseItem
        });
    } catch (err) {
        console.error("Error in addTocart:", err);
        next(err);
    }
};

module.exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.listing',
                select: 'title price image country location'
            });

        if (!cart || !cart.items) {
            return res.status(200).json({ items: [] });
        }

        const validItems = cart.items.filter(item => item.listing != null);
        if (validItems.length !== cart.items.length) {
            console.warn(`User ${userId} cart contained items with null listings.`);
        }
        res.status(200).json({ items: validItems });

    } catch (err) {
        next(err);
    }
};

module.exports.deletecart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { listingId } = req.params;

        if (!listingId) {
            return res.status(400).json({ success: false, message: 'Listing ID parameter is required.' });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found.' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.listing && item.listing.toString() !== listingId.toString());

        if (cart.items.length === initialLength) {
            return res.status(404).json({ success: false, message: 'Item not found in cart.' });
        }

        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart.' });
    } catch (err) {
        next(err);
    }
};

module.exports.clearUserCart = async (req, res, next) => {
    try {
        const userId = req.user.__id;

        const result = await Cart.findOneAndDelete({ user: userId });

        if (!result) {
            return res.status(200).json({ success: true, message: 'Cart is already empty.' });
        }

        res.status(200).json({ success: true, message: 'Cart cleared successfully (Order Placed - Placeholder).' });
    } catch (err) {
        console.error("Error clearing cart:", err);
        next(err);
    }
};
