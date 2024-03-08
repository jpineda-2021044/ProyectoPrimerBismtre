import ShoppingCar from './shopCart.model.js'
import Product from '../product/product.model.js'
import mongoose from 'mongoose'

export const createCart = async (id) => {
    try {
        const existingCart = await ShoppingCar.findOne({ user: id });

        if (existingCart) {
            console.log('You already have a shopping cart')
            return existingCart;
        }
        // Crear un nuevo carrito para el usuario
        const newCart = new ShoppingCar({
            user: id,
            products: [],
            total: 0
        })
        // Guardar el nuevo carrito en la base de datos
        await newCart.save();
        console.log('Shopping cart successfully created')
        return newCart;
    } catch (error) {
        console.error(error)
        throw new Error('Error creating shopping cart')
    }
}


export const addToCart = async (req, res) => {
    try {
        let {product, quantity} = req.body
        let {_id} = req.user
        let price = await Product.findOne({_id:product})
        let subtotal = quantity * price.price
        // Buscar el carrito de compras del usuario
        let cart = await ShoppingCar.findOne({ user: _id })
        if (!cart) {
            cart = await createCart(_id);
        }
        cart.products.push({
            product: product,
            quantity: quantity,
            price: price.price,
            subtotal: subtotal
        })

        cart.total = cart.products.reduce((total, product) => {
            return total + product.subtotal
        }, 0)
        cart.total = parseFloat(cart.total.toFixed(2));
        await cart.save();
        return res.send({message: 'Product added successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error adding products'})
    }
}

export const clearCart = async (userId) => {
    try {

        const cart = await ShoppingCar.findOne({ user: userId })
        if (!cart) {
            console.log('You do not have a shopping cart.')
            return;
        }

        cart.products = []
        cart.total = 0

        await cart.save()
    } catch (error) {
        console.error(error)
        throw new Error(
            'Error clearing cart')
    }
}

export const remove = async(req, res)=>{
    try {
        let {id} = req.params
        let {_id} = req.user
        let producto = await Product.findOne({_id: id})
        console.log(producto)
        let cart = await ShopCar.findOne({user:_id})
        if(!cart) return res.status(404).send({ message: 'You do not have a shopping cart.'})
        let ObjectId =  mongoose.Types.ObjectId;
        let productIndex = cart.products.findIndex(product => product.product.equals(new ObjectId(id)));
        if(productIndex === -1) return res.status(404).send({ message: 'Product not found in cart'})
        cart.products.splice(productIndex, 1)
        cart.total = cart.products.reduce((total, product)=>{
            return total + product.subtotal
        },0)
        await cart.save()
        return res.send({ message: 'Product removed successfully'})
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error removing cart' })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { quantity } = req.body
        let { _id } = req.user
        let cart = await ShopCar.findOne({ user: _id })
        if (!cart) {
            return res.status(404).send({ message: 'You do not have a shopping cart.' })
        }
        let ObjectId =  mongoose.Types.ObjectId;
        let productIndex = cart.products.findIndex(product => product.product.equals(new ObjectId(id)));
        console.log(productIndex)
        if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not found in shopping cart' })
        }
        cart.products[productIndex].quantity = quantity
        cart.products[productIndex].subtotal = quantity * cart.products[productIndex].price
        cart.subtotal = cart.products.reduce((total, product) => total + product.total, 0)
        await cart.save()
        return res.send({ message: 'Product quantity updated successfully', cart })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating product quantity in cart' })
    }
}

export const view = async(req, res)=>{
    try {
        let {_id} = req.user
        let cart = await ShopCar.findOne({user: _id})
        return res.send({message:'Your Shopping Cart', cart})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error showing your shopping cart'})
    }
}
