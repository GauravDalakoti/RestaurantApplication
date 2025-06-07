import mongoose, { mongo, Schema } from 'mongoose';

const CartItemSchema = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    itemId: {

        type: String,
        required: true
    }

}, {
    timestamps: true
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

export default CartItem;