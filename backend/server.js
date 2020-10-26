import path from 'path';
import express from 'express'
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import products from './data/products.js';

// import our API router
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const app = express();

// hooked up express.json middleware to accept JSON data in the req.body
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running...');
})

// mount our routes for our API
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.get('/api/v1/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// we have to make 'uploads' a static folder to load it into the browser
// __dirname is not available for ES modules, it's only available for Common JS (require syntax)
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);

app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));