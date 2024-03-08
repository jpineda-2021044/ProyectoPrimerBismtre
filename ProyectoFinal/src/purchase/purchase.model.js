'use strict'
import {Schema, model} from 'mongoose'

const purchaseSchema = new Schema({
   user:{
    type: Schema.ObjectId,
    ref: 'user',
    required: true
   },
   product:[{
        productId:{
            type:Schema.ObjectId,
            ref: 'product',
            required: true
        },
        quantity:{
            type:Number,
            required: true
        },
        price:{
            type:Number,
            required: true
        },
        subtotal:{
            type:Number,
            required: true
        }
   }],
   total:{
    type:Number,
    required: true
   },
   paymentMethod:{
    type:String,
    required: true
   },
   date:{
    type:Date,
    default: Date.now()
   }
},
    {versionKey: false}
)

export default model('purchase', purchaseSchema)