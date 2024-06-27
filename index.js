require('dotenv').config();

const Shopify = require('shopify-api-node');
const express = require('express');
const cors = require('cors')
const helmet = require('helmet')

const app = express();
const port = 3000;

const shopify = new Shopify({
    shopName: 'int-tns.myshopify.com',
    apiKey: process.env.API_KEY,
    password: process.env.API_SECRET
});

app.use(helmet());

/* app.use((req, res, next) => {
    if(req.secure) {
        return next()
    }
    res.redirect(`https://${req.headers.host}${req.url}`)
}); */

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse JSON bodies
app.use(
    cors({
        origin: "https://www.tns.us"
    })
);

// Endpoint to check customer tags
app.post('/check-customer-tags', async (req, res) => {
    const { customerEmail, tags } = req.body;

    if (!customerEmail || !tags) {
        return res.status(400).json({ error: 'Customer ID and tags are required' });
    }

    try {
        // Fetch customer details from Shopify
        const customer = await shopify.customer.search({query:`${customerEmail}`});

        // Check if the customer has the specified tags
        const customerTags = customer[0].tags.split(', ').map(tag => tag.trim());
        const hasTags = tags.every(tag => customerTags.includes(tag));

        res.json({ hasTags });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching customer details' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});