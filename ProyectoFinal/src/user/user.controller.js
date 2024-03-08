'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'


export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err})
    }
}

export const login = async(req, res)=>{
    try{
        let { username, email, password } = req.body
        let user = await User.findOne({
            $or: [{ username }, { email }]
        })
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Failed to login'})
    }
}

export const update = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumbmitted some data that cannot be updated or missing data'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const updateR = async(req, res)=>{
    try {
        const { id } = req.params
        const { role } = req.body

        if(!['ADMIN', 'CLIENT'].includes(role)){
            return res.status(400).send({message: 'Invalid Role'})
        }
        const updatedUser = await User.findByIdAndUpdate(id, { role }, {new: true})
        if(!updatedUser){
            return res.status(400).send({message: 'User not found'})
        }
        return res.send({message: 'User role updated successfully', user: updatedUser})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating user role'})
    }
}

export const deleteU = async(req, res)=>{
    try {
        const { id } = req.params
        const { password } = req.body
        const userD = await User.findById(id)
        if(!userD) return res.status(404).send({message: 'Account not found and not deleted'})
        const passwordFind = await checkPassword(password, userD.password)
        if(passwordFind){
            const deleteU = await User.findOneAndDelete({_id: id})
            return res.send({message: `Account with  username ${deleteU.username} deleted succesfully`})
        }else{
            return res.status(401).send({message: 'Incorrect passwrod and account not deleted'})
        }
    } catch (error) {
       console.error(error) 
       return res.status(500).send({message: 'If you want to delete your account, enter your password'})
    }
   
}

export const get = async(req, res)=>{
    try {
        let user = await User.find()
        res.status(200).send(user)
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting users'})
    }
}