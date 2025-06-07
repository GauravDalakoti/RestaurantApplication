import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Starters', 'Mains', 'Desserts', 'Drinks']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;