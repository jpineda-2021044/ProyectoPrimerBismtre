import Purchase from './purchase.model.js'
import ShopCar from '../ShopCart/shopCart.model.js'
import Product from '../product/product.model.js'
import PDFDocument from 'pdfkit';
import User from '../user/user.model.js'
import fs from 'fs';
import { clearCart } from '../ShopCart/shopCart.controller.js'

export const addPurchase = async (req, res) => {
    try {
        let { _id } = req.user // Obtener el ID del usuario
        let cart = await ShopCar.findOne({ user: _id }).populate('products.product')
        if (!cart) {
            return res.status(404).send({ message: 'Shopping cart not found' })
        }
        let purchaseItems = cart.products.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            subtotal: item.total
        }))
        let total = cart.subtotal
        let {paymentMethod} = req.body
        let date = new Date()
        // Crear la compra
        const purchase = new Purchase({
            user: _id,
            product: purchaseItems,
            total: total,
            paymentMethod: paymentMethod,
            date: date
        })

        await purchase.save()
        for (let item of cart.products) {
            let product = await Product.findById(item.product._id)
            if (!product) {
                console.log(`Product with ID ${item.product._id} not found.`)
                continue
            }
            product.stock -= item.quantity 
            product.sellCount += item.quantity 
            await product.save() 
        }
        // Limpiar el carrito
        await clearCart(_id)
        return res.send({ message: 'Purchase completed successfully', purchase })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error completing purchase' })
    }
}

export const purchaseRecord = async(req,res)=>{
    try {
        let {_id} = req.user
        let allPurchases = await Purchase.find({user: _id}).populate('product',['name'])
        return res.send({message:'Purchases Historial', allPurchases})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error displaying purchase historial' })
    }
}




export const createAndDowload = async (req, res) => {
    try {
        const { id } = req.params
        let {_id} = req.user
        const user = await User.findOne({_id:_id})
        const purchase = await Purchase.findOne({_id: id}).populate('product.productId')
        console.log(purchase)
        const total = purchase.total
        // Crear un nuevo documento PDF
        const doc = new PDFDocument()
        // Escribir contenido en el PDF
        doc.text('Factura de Compra\n\n')
        doc.text(`Fecha: ${new Date(purchase.date).toLocaleDateString()}\n\n`)
        doc.text(`Names: ${user.name}  ${user.surname}\n\n`)
        doc.text(`Address: ${user.address}\n\n`)
        doc.text('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n')
        doc.text('Detalles:\n\n')
        doc.text('|------------------------------------|\n\n')
        purchase.product.forEach(item => {
            doc.text(` Producto: ${item.productId.name}    |\n`)
            doc.text('|------------------------------------|\n\n')
            doc.text(` Cantidad: ${item.quantity}          \n`);
            doc.text('|------------------------------------|\n\n')
            doc.text(` Precio unitario: $${item.price}     \n`)
            doc.text('|------------------------------------|\n\n')
            doc.text(` Subtotal: $${item.subtotal}         \n\n`)
            doc.text('|------------------------------------|\n\n')
        });

        doc.text(`Total: $${total}`)
        doc.end();
        const filePath = `bills/bill_${id}.pdf`;
        doc.pipe(fs.createWriteStream(filePath))
        doc.pipe(res)
        res.setHeader('Content-Disposition', `attachment; filename="bill_${id}.pdf"`)
        res.setHeader('Content-Type', 'application/pdf')
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error generating invoice' })
    }
}
