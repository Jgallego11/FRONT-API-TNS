require('dotenv').config();
const express = require('express');
const cors = require('cors')
const helmet = require('helmet')

const app = express();
const port = 3000;

app.use(helmet());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse JSON bodies
app.use(
    cors({
        origin: process.env.SHOP_NAME
    })
);

const customerRouter = require('./routes/customer')
app.use('/customer', customerRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});