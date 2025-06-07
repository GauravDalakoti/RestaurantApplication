import CartItem from "../models/cartModel.js";
import MenuItem from "../models/menuModel.js";

// @desc    add item to cart
// @route   POST /api/cart
// @access  Public
export const addToCart = async (req, res) => {
    try {
        const id = req.params.id;

        // Manual validation
        if (!id) {
            return res.status(400).json({ message: 'Id is required' });
        }

        // Create Cart Item
        const cartItem = await CartItem.create({
            itemId: id,
            userId: req.user?._id
        });

        if (cartItem) {
            res.status(201).json({
                cartItem
            });
        } else {
            res.status(400).json({ message: 'Invalid cart data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    add item to cart
// @route   POST /api/cart
// @access  Public
export const getCartItems = async (req, res) => {
    try {


        // Fetch Cart Items
        const items = await CartItem.find({ userId: req.user?._id })

        // Extract dish IDs from items
        const itemIds = items.map(item => item.itemId);

        const allCartItems = await MenuItem.find({ _id: { $in: itemIds } })

        if (allCartItems) {
            res.json(allCartItems);
        } else {
            res.status(400).json({ message: 'Invalid cart data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findOne({ itemId: req.params.id });

        if (cartItem) {
            await cartItem.deleteOne();
            res.json({ message: 'Cart item removed' });
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};