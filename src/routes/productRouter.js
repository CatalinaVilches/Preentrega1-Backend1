import express from 'express';
import ProductManager from '../dao/productManager.js';

const router = express.Router();
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; 
    try {
        const productList = await productManager.getProducts(limit);
        if (productList) {
            res.status(200).json(productList);
        } else {
            res.status(404).json({ error: 'No se encontraron productos.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productDetails = await productManager.getProductsById(Number(id));
        if (productDetails) {
            res.status(200).json(productDetails);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.', id });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, id });
    }
});


router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    try {
        const newProduct = await productManager.addProducts(title, description, code, price, status, stock, category, thumbnail);
        if (newProduct) {
            res.status(201).json(newProduct);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    try {
        const updatedProduct = await productManager.updateProduct(Number(pid), { title, description, code, price, status, stock, category, thumbnail });
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ error: 'No se pudo actualizar el producto.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deletionResult = await productManager.deleteProduct(Number(pid));
        if (deletionResult) {
            res.status(200).json({ message: 'Producto eliminado exitosamente.' });
        } else {
            res.status(404).json({ error: 'El producto no existe.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;