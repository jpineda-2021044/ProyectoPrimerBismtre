'use strict'

import express from 'express'
import { isAdmin, validateJwt} from '../middlewares/validate.jwt.js'
import {register, login, update, deleteU, get, updateR} from './user.controller.js'

const api = express.Router()

api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteU)
api.get('/get', [validateJwt], get)
api.put('/updateR/:id', [validateJwt, isAdmin], updateR)

api.post('/register', register)
api.post('/login', login)

export default api
