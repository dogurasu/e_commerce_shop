import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// @desc    fetch all products
// @route   GET /api/products
// @access  Public route
//      access  - some routes need a token
//              - e.g. to purchase a product you need to be logged in; you need to send a token to specific routes (private if purchasing)
//              - in this case, this is a public route to our API
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    // purposefully output an error to test our error catching in Redux
    // res.status(401);
    // throw new Error('Not Authorized');

    res.json(products);
})

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404); // .json({ message: "Product not found"})
        throw new Error('Product not found');
    }
})

// @desc   Delete a single product
// @route  DELETE /api/products/:id
// @access Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
    // first find the product
    const product = await Product.findById(req.params.id);

    // any admin could make or delete a product - u can change it so that the admin who created the product can only delete it
    if (product) {
        await product.remove();
        res.json({ message: 'Product removed' })
    } else {
        res.status(404); // .json({ message: "Product not found"})
        throw new Error('Product not found');
    }
})

// @desc   Create a single product
// @route  POST /api/products
// @access Private/Admin

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

// @desc   Update a single product
// @route  PUT /api/v1/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
}