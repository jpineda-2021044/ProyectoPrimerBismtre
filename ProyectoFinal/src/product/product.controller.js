'use strict'
import Product from './product.model.js'
import Category from '../category/category.model.js'

export const save = async (req, res) =>{
    try {
        let data = req.body
        let category = await Category.findOne({_id: data.category})
        if(!category) return res.status(404).send({message: 'category not found'})
        let product = new Product(data)
        await product.save()
        return res.send({message: 'Product saved succesfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving product', error})
    }
}

export const search = async (req, res)=>{
    try {
        let { category, name } = req.body
        let products
        if(!name){
            products = await Product.find({category: category}).populate('category', ['name', 'description'])
            return res.send(products)
        }
        if(!category){
            const product = await Product.find({name: name}).populate('category', ['name', 'description'])
            return res.send(product)
        }
        products = await Product.find({name: name, category: category}).populate('category', ['name', 'description'])
        return res.send(products)
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'Error searching products'})
    }
}

export const moreSellers = async(req, res)=>{
    try {
        let products = await Product.find().sort({sellCount: -1}).populate('category', ['name', 'description'])
        return res.send(products)
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'Error displaying bestSellers'})
    }
}

export const get = async(req, res)=>{
    try {
        let products =await Product.find().populate('category',['name','description'])
        console.log(products.category)
        res.send(products)
    } catch (error) {
        console.error(error)
        res.status(500).send({message:'Error get products'})
    }
}

export const update = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let updateProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}

        ).populate('category', ['name', 'description'])
        if(!updateProduct) return res.status(404).send({message: 'Product not found, not update'})
        return res.send({message: 'Product updated succesfully', updateProduct})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const deleteP = async(req, res)=>{
    try {
        let {id} = req.params
        let deleteProduct = await Product.findOneAndDelete({_id: id})
        if(!deleteProduct) return res.status(404).send({message: 'Product not found, not deleted'})
        return res.send({message: 'deleting product succesfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting product'})
    }
}

