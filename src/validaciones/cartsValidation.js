import ProductManager from "../dao/productManager.js";
const productManager = new ProductManager();

const validateCart = async (cartId, productId, quantity) => {
    const product = await productManager.getProductsById(productId); // Verifica si el producto existe
    if (!product) {
        throw new Error('El producto que deseas agregar no se encuentra disponible.');
    }
    if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor que 0.');
    }

    if (!productId || !quantity) {
        throw new Error('Todos los campos son necesarios.');
    }

    if (typeof productId === 'string' || typeof quantity !== 'number' || typeof cartId === 'string') {
        throw new Error('Los valores de cartId, productId y quantity deben ser números.');
    }
}

export default validateCart;