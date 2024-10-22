const validateProduct = (name, details, sku, cost, isAvailable, inventory, group, images) => {
    if (!name || !details || !sku || cost === undefined || isAvailable === undefined || !inventory || !group || !images) {
        throw new Error('Todos los campos son necesarios');
    }

    if (typeof name !== 'string' || typeof details !== 'string' || typeof sku !== 'string' || typeof group !== 'string') {
        throw new Error('El nombre, detalles, SKU y grupo deben ser cadenas de texto');
    }

    if (typeof cost !== 'number' || typeof inventory !== 'number') {
        throw new Error('El costo y el inventario deben ser números');
    }

    if (typeof isAvailable !== 'boolean') {
        throw new Error('La disponibilidad debe ser un valor booleano');
    }

    if (cost <= 0 || inventory <= 0) {
        throw new Error('El costo y el inventario deben ser mayores a 0');
    }

    if (images && (!Array.isArray(images) || !images.every(item => typeof item === 'string'))) {
        throw new Error('Las imágenes deben ser un array de cadenas de texto');
    }
}

export default validateProduct;