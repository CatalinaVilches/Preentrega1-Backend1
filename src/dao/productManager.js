import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs/promises';
import validateProduct from "../validaciones/productsValidation.js";

class ProductManager {
    #filePath = "";
    #directoryPath = "";
    #productsFile = "";

    constructor() {
        this.products = [];
        this.#filePath = fileURLToPath(import.meta.url);
        this.#directoryPath = path.dirname(this.#filePath);
        this.#productsFile = path.join(this.#directoryPath, '../data/products.json');
    }

    async fetchProducts(limit) {
        try {
            await fs.mkdir(path.dirname(this.#productsFile), { recursive: true });

            try {
                const fileData = await fs.readFile(this.#productsFile, 'utf-8');
                this.products = JSON.parse(fileData);
                if (!Array.isArray(this.products)) {
                    throw new Error('El archivo de productos debe contener un array válido');
                }
            } catch (error) {
                if (error.code === 'ENOENT') {
                    this.products = [];
                } else {
                    throw error;
                }
            }

            return this.products.slice(0, limit || this.products.length);
        } catch (error) {
            console.error('Error al recuperar productos:', error);
            throw error;
        }
    }

    async fetchProductById(productId) {
        try {
            const productsList = await this.fetchProducts();
            const foundProduct = productsList.find(p => p.id === Number(productId));
            return foundProduct || null;
        } catch (error) {
            console.error('Error al buscar el producto:', error);
            throw error;
        }
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnails = ['default.jpg']) {
        validateProduct(title, description, code, price, status, stock, category, thumbnails);

        try {
            const currentProducts = await this.fetchProducts();
            const existingProduct = currentProducts.find(p => p.code === code);

            if (existingProduct) {
                throw new Error('El producto ya existe');
            }

            const newId = currentProducts.length ? currentProducts[currentProducts.length - 1].id + 1 : 1;
            const newProduct = {
                id: newId,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            };

            this.products.push(newProduct);
            await fs.writeFile(this.#productsFile, JSON.stringify(this.products, null, 5));

            return newProduct;
        } catch (error) {
            console.error('Error al añadir el producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedData) {
        validateProduct(updatedData.title, updatedData.description, updatedData.code, updatedData.price, updatedData.status, updatedData.stock, updatedData.category, updatedData.thumbnails);

        try {
            const currentProducts = await this.fetchProducts();
            const productIndex = currentProducts.findIndex(p => p.id === id);
            if (productIndex === -1) {
                console.log('Producto no encontrado');
                return false;
            }

            this.products[productIndex] = {
                id,
                ...updatedData
            };

            await fs.writeFile(this.#productsFile, JSON.stringify(this.products, null, 5));
            return true;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const currentProducts = await this.fetchProducts();
            const productIndex = currentProducts.findIndex(p => p.id === id);
            if (productIndex === -1) {
                throw new Error('El producto no existe');
            }

            currentProducts.splice(productIndex, 1);
            await fs.writeFile(this.#productsFile, JSON.stringify(currentProducts, null, 5));
            return true;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
}

export default ProductManager;
