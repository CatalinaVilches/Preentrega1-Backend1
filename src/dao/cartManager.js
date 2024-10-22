import path from "path";
import { fileURLToPath } from "url";
import cartsValidation from "../validaciones/cartsValidation.js";
import fs from 'fs/promises'

export default class CartManager {
    #filename = "";
    #dirname = "";
    #dataDirectory = "";
    #cartsFilePath = "";

    constructor() {
        this.carts = [];
        this.#filename = fileURLToPath(import.meta.url);
        this.#dirname = path.dirname(this.#filename);
        this.#dataDirectory = path.join(this.#dirname, '../data');
        this.#cartsFilePath = path.join(this.#dataDirectory, 'carts.json');
    }

    async fetchCarts(limit) {
        try {
            await fs.mkdir(this.#dataDirectory, { recursive: true });

            try {
                const cartsData = await fs.readFile(this.#cartsFilePath, 'utf-8');
                this.carts = JSON.parse(cartsData);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    this.carts = [];
                } else {
                    throw error;
                }
            }

            return this.carts.slice(0, limit);
        } catch (error) {
            console.error('Error al recuperar los carritos:', error);
            throw error;
        }
    }

    async fetchCartById(cartId) {
        try {
            const carts = await this.fetchCarts();
            const foundCart = carts.find(cart => cart.id === cartId);
            if (!foundCart) {
                throw new Error('Carrito no encontrado');
            }

            return foundCart.products;
        } catch (error) {
            console.error('El carrito no existe:', error);
            throw error;
        }
    }

    async createNewCart() {
        try {
            await this.fetchCarts();

            const newId = this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1;
            const cartToCreate = {
                id: newId,
                products: []
            };

            this.carts.push(cartToCreate);
            await fs.writeFile(this.#cartsFilePath, JSON.stringify(this.carts, null, 5));

            return cartToCreate;
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.carts = [];
            } else {
                throw new Error('Ocurrió un error inesperado, revisa el sistema.');
            }
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        await validateCart(cartId, productId, quantity);
        try {
            await this.fetchCartById(cartId);
            const cart = this.carts.find(cart => cart.id === cartId);
            if (!cart) return false;

            const existingProduct = cart.products.find(product => product.product === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await fs.writeFile(this.#cartsFilePath, JSON.stringify(this.carts, null, 5));
            return true;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }
}