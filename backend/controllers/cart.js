const Cart = require('../models/cart');

module.exports.addTocart = async (req, res) => {
    try{
    const userId = req.user._id;
    const { listingId } = req.body;

    let cart = await Cart.findOne({ user: userId });
    // console.log(cart);
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }
    const existingItem = cart.items.find(item => item.listing.equals(listingId));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({ listing: listingId, quantity: 1 });
    }
    await cart.save();
    res.json({ success: true });}
    catch(err){
        next(err)
    }
};

module.exports.getCart = async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.listing');
    if (!cart) {
        return res.json({ items: [] });
    }
    res.json({ items: cart.items });
}

module.exports.deletecart = async (req, res) => {
    try {
        const userId = req.user._id; 
        const listingId = req.params.listingId;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.json({ success: true });  
        }
        cart.items = cart.items.filter(item => item.listing.toString() !== listingId);
        await cart.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
}