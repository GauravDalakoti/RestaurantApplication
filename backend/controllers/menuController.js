import MenuItem from '../models/menuModel.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res) => {
  try {
    const category = req.query.category;
    let query = {};

    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = async (req, res) => {

  try {

    const { name, description, price, category, featured } = req.body;

    // Manual validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const image = req.file
    const uploadedImage = await uploadOnCloudinary(image.path)

    if(!uploadedImage){
      return res.status(400).json({ message: 'Error while uploading on cloudinary' });

    }

    console.log(uploadOnCloudinary);
    
    const menuItem = new MenuItem({
      name,
      description,
      price,
      image: uploadedImage.url,
      category,
      featured: featured || false
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, featured } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
      menuItem.category = category || menuItem.category;
      menuItem.featured = featured !== undefined ? featured : menuItem.featured;

      if (req.file) {
        menuItem.image = `/uploads/${req.file.filename}`;
      }

      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      await menuItem.deleteOne();
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch featured menu items
// @route   GET /api/menu/featured
// @access  Public
export const getFeaturedItems = async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({ featured: true });
    res.json(featuredItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};