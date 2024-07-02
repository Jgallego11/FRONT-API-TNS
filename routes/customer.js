const express = require('express')
const router = express.Router()
const shopify = require('../shopifyClient')

// Endpoint to check customer tags
router.post('/hastags', async (req, res) => {
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

module.exports = router