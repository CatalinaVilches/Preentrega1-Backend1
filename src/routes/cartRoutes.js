import express from 'express';
import CartManager from '../dao/cartManager.js';

const router = express.Router();
const cartManager = new CartManager();


router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; 
    try {
        const cartsList = await cartManager.getCarts(limit);
        res.status(200).json(cartsList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cartDetails = await cartManager.getCartsById(Number(cid));
        res.status(200).json(cartDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/:cid/products/:pid', async (req, res) => {
    const { pid, cid } = req.params;
    const { quantity } = req.body;
    try {
        const result = await cartManager.addProductCart(Number(cid), Number(pid), quantity);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
