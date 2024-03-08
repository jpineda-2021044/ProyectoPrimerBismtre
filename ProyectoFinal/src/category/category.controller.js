'use strict'
import Categoy from './category.model.js'
import Product from './category.model.js'

export const save = async(req, res)=>{
    try {
        let data = req.body
        let category = new Categoy(data)
        await category.save()
        return res.send({message: 'Category saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving category'})
    }
}

export const update = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body
        let updateCategory = await Categoy.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(404).send({message: 'Category not found, not update'})
        return res.send({message: 'Category update successfully', updateCategory})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating category'})
    }
}

export const deleteC = async(req, res)=>{
    try {
        let {id} = req.params
        let deleteCategory = await Categoy.findOneAndDelete({_id: id})
        if(!deleteCategory) return res.status(404).send({message: 'Category not found and not deleted'})
        let defaultC = 'Default'
        let idDefault = await Categoy.findOne({name: defaultC})
        console.log(idDefault)
        await Product.updateMany({category: id}, {$set:{category: idDefault._id}})
        return res.send({message: `Category with name ${deleteCategory.name} deleted succesfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting category', error})
    }
}

export const getAll = async(req, res)=>{
    try {
        let categories = await Categoy.find()
        res.status(200).send(categories)
    } catch (error) {
        
    }
}