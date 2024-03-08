import { Schema, model } from "mongoose"

const shopCarSchema = new Schema({
    user:{
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    products:[{
        product:{
            type: Schema.ObjectId,
            ref: 'product',
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        subtotal:{
            type: Number,
            required: true
        }
    }],
    total:{
        type: Number,
        required: true
    }
    
},
    {versionKey:false}
)

export default model('shoppingCar', shopCarSchema)