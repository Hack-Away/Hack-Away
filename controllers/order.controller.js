const mongoose = require('mongoose');
const Product = require('../models/product.model');
require('../config/hbs.config');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const mailer = require('../config/mailer.config');


module.exports.list = (req, res, next) => {

    const  userId  = res.locals.sessionUser.id

    User.findById(userId)
        .then(user => {
            console.log(user, '--------- USER al darle al carrito - Desde vista de carrito')
            if (user.order === undefined || user.order === null || user.order.state === 'finished'){
                console.log('NO TIENE ORDER')
                const newOrder = {
                    createdBy: user,
                    productList: [],
                    message: 'Default message',
                    state: 'standby'
                }
                Order.create(newOrder)
                    .then(order => {
                        let newOrder = order                
                        User.findByIdAndUpdate(userId, {order:newOrder})
                            .then( user => {
                                res.render('order/list', {order})
                            })
                            .catch( error => console.log(error))
                    })
                    .catch(error => console.log(error))
            } else {
                console.log(user, '------- TIENE ORDER - Desde vista de carrito')
                Order.findById(user.order)
                    .populate('productList.product')
                    .populate('createdBy')
                    .then(order => {
                        
                        console.log('--- Estados de ORDER al darle a View Cart ---', order)

                        let timeLeft = 1

                            let estimatedTime = order.estimatedTime
                            let updatedAt = order.updatedAt
                            
                            let time = (estimatedTime - updatedAt)/60000                       
                            timeLeft = (estimatedTime - Date.now()) / 60000

                            console.log(time, timeLeft)
                        

                        if (timeLeft <= 0){

                            console.log('ha pasado del tiempo del envio')
                            Order.findByIdAndUpdate(order.id, {$set: {state:'finished'}})
                                .populate('createdBy')
                                .populate('productList.product')
                                .then(order => {
                                    
                                    if (order.state === 'finished') {
                                        let arrayToPush = []

                                        arrayToPush.push(order)
                                        console.log('USER antes de setear order a string vacio', user)
                                        User.findByIdAndUpdate(userId, { $set: { oldOrders: arrayToPush , order: undefined }})
                                            .populate('oldOrders.order')
                                            .then(user => {
                                                Product.find()
                                                    .then(products => {
                                                        console.log('USER despues de setear order a string vacio', user)
                                                        res.render('products/filter', {products: products})
                                                    })
                                                    .catch(error => console.log(error))
                                                                                          
                                            })
                                            .catch(error => console.log(error))
                                    } else {
                                        next
                                    }                               
                                })
                                .catch(error => console.log(error))
                        }                       
              
                        if (order.state === 'confirmed'){
                            res.render('order/orderSent', {
                                order,
                                productList: order.productList
                            })

                        } else {
                            if (order === null){
                                res.render('order/list')
                            } else {
                                res.render('order/list', {
                                    order,     
                                    productList: order.productList                                           
                                })
                            }
                        }
                    })
                    .catch(error => {
                        console.log('--- error al encontrar la order por id del user', error)
                        res.render('order/list')
                    })
            }
        })
        .catch(error => {
            console.log(error)
            next()
        })
}

module.exports.addToOrder = (req, res, next) => {
    
    const userId = res.locals.sessionUser.id
    User.findById(userId)
        .then(user => {
            if (user.order === undefined || user.order === null) {
                console.log(user, 'NO TIENE ORDER -  Desde Añadir Producto')
                const newOrder = {
                    createdBy: user,
                    productList: [],
                    message: 'Default message',
                    state: 'standby'
                }

                Order.create(newOrder)
                    .then(order => {

                        let newOrder = order
                        let orderId = order.id

                        User.findByIdAndUpdate(userId, { order: newOrder })
                            .then(user => {

                                Product.findById(req.params.id)
                                    .then(product => {

                                        let productToAdd = {
                                            product,
                                            qty: 1
                                        }

                                        order.productList.push(productToAdd)
                                        let newProducts = order.productList

                                        Order.findByIdAndUpdate(orderId, { $set: { productList: newProducts } })
                                            .populate('createdBy')
                                            .populate('productList.product')
                                            .then(order => {
                                                console.log('--- Estados de ORDER al darle a al crear una orden desde add product ---')
                                                console.log(order.updatedAt)
                                                console.log(order.estimatedTime)
                                                res.render('order/list', {
                                                    order,
                                                    productList: newProducts
                                                })
                                            })
                                            .catch(error => console.log(error))
                                    })
                                    .catch(error => console.log(error))
                            })
                            .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
            } else {
                console.log(user, 'NO TIENE ORDER - Desde Añadir Producto')
                let orderId = user.order
                console.log('user antes de encontrar la order por id',user)
                Order.findById(orderId)
                    .populate('productList.product')
                    .populate('createdBy')
                    .then(thisOrder => {
                        console.log('--- ORDER - adding product and has order ---', thisOrder)

                        console.log(thisOrder.updatedAt)
                        console.log(thisOrder.estimatedTime)

                        if (thisOrder.state === 'finished') {
                            let arrayToPush = []
                            arrayToPush.push(order)

                            User.findByIdAndUpdate(order.createdBy.id, { $set: { oldOrders: arrayToPush } })
                                .populate('order')
                                .then(user => {
                                    Order.findByIdAndDelete(user.order.id)
                                        .then(order => {
                                            console.log(user)
                                            res.render('order/list', {
                                                order,
                                                productList: order.productList
                                            })
                                        })
                                        .catch(error => console.log(error))
                                })
                                .catch(error => console.log(error))
                        }

                        if (thisOrder.state === 'confirmed') {
                            res.render('order/orderSent', {
                                order,
                                productList: order.productList
                            }) 

                        } else { 

                            if(thisOrder === null || thisOrder === undefined){

                            } else {
                                Product.findById(req.params.id)
                                    .then(product => {
                                        let addProduct = true;
                                        for (let element of thisOrder.productList){
                                            if (element.product.id === product.id){
                                                addProduct = false;
                                                } 
                                        }
                                        if(addProduct){

                                            let productToAdd = { 
                                                product: product, 
                                                qty: 1 
                                                }        
                                            thisOrder.productList.push(productToAdd)      
                                            let newProducts = thisOrder.productList  
                                            
                                            console.log('--- Estados de ORDER al añadir producto nuevo ---')
                                            console.log(thisOrder.updatedAt)
                                            console.log(thisOrder.estimatedTime)

                                            Order.findByIdAndUpdate(thisOrder.id, {$set: {productList: newProducts}})
                                                .populate('createdBy')
                                                .populate('productList.product')
                                                .then(order => {
                                                    res.render('order/list', {
                                                        order: order,
                                                        productList: newProducts
                                                    })
                                                })
                                                .catch(error => console.log(error))

                                        } else {

                                            Order.findById(user.order)
                                                .populate('productList.product')
                                                .populate('createdBy')
                                                .then(order => {
                                                    res.render('order/list', {
                                                        order: order,
                                                        productList: order.productList
                                                    })
                                                })
                                                .catch(error => console.log(error))                                    
                                        }
                                    })
                                    .catch(error => console.log(error))
                            }
                        }
                    })
                    .catch(error => console.log(error))
            }
        })
        .catch(error => console.log(error))
}

module.exports.addProduct = (req, res, next) => {

    Order.findById(res.locals.sessionUser.order)
        .populate('createdBy')
        .populate('productList.product')
        .then(order => {
            for (let product of order.productList){
                if (product.id === req.params.id){
                    product.qty++
                }
            }
            let newProducts = order.productList
            Order.findByIdAndUpdate(order.id , { $set: { productList: newProducts } })
                .populate('createdBy')
                .populate('productList.product')
                .then(order => {
                    res.render('order/list', {
                        order,
                        productList: newProducts
                })
                .catch(error => console.log(error))               
            })
        })
        .catch(error => console.log(error))
}

module.exports.restProduct = (req, res, next) => {

    Order.findById(res.locals.sessionUser.order)
        .populate('createdBy')
        .populate('productList.product')
        .then(order => {
            for (let product of order.productList) {
                if (product.id === req.params.id) {
                    product.qty--   
                }
                if (product.qty < 0) {
                    product.qty = 0
                }
            }
            let newProducts = order.productList
            Order.findByIdAndUpdate(order.id, { $set: { productList: newProducts } })
                .populate('createdBy')
                .populate('productList.product')
                .then(order => {
                    res.render('order/list', {
                        order,
                        productList: newProducts
                    })
                        .catch(error => console.log(error))
                })
        })
        .catch(error => console.log(error))
}

module.exports.deleteProduct = (req, res, next) => {

    Order.findById(res.locals.sessionUser.order)
        .populate('createdBy')
        .populate('productList.product')
        .then(order => {

            let oldProducts = order.productList
            let newProducts = []
      
            for (let product of oldProducts) {
                if (product.id === req.params.id) {
                    console.log('producto igual dentro del for', product)
                } else {
                    newProducts = oldProducts.filter(product => product.id !== req.params.id)
                }
            }

            Order.findByIdAndUpdate(order.id, { $set: { productList: newProducts} })
                .populate('createdBy')
                .populate('productList.product')
                .then(order => {
                    res.render('order/list', {
                        order,
                        productList: newProducts
                    })                      
                })
                .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
}

module.exports.deleteOrder = (req, res, next) => {

    const userId = res.locals.sessionUser.id

    Order.findByIdAndDelete(req.params.id)
        .then(order => {
            User.findByIdAndUpdate(userId, { $unset: { order: ''}})
                .then(user => {
                    console.log(user)
                    res.redirect('/products/filter')
                })
                .catch(error => console.log(error))
        })      
        .catch(error => console.log(error))
}

module.exports.confirmOrder = (req, res, next) => {
    
    Order.findById(req.params.id)
        .populate('createdBy')
        .populate('productList.product')
        .then(order => {
            if (order.productList.length === 0){
                res.render('order/list', {
                    order,
                    productList: order.productList
                })
            } else {
                res.render('order/confirm', {
                    order,
                    productList: order.productList
                })
            } 
        })
        .catch(error => console.log(error))
}

module.exports.sendOrder = (req, res, next) => {

    let userTarget = res.locals.sessionUser
    console.log(req.body.message)  
    
    Order.findById(req.params.id)
        .populate('productList.product')
        .then(order => {        
            
            let allTimes = []
            for(let product of order.productList){
                allTimes.push(product.product.productTime)
            }

            let theTime = allTimes.sort().reverse().splice(0, 1)

            console.log('--- Estados de ORDER al añadir producto nuevo ---')
            console.log(order.updatedAt)

            const addMinutes = function(timeToUpdate, time){
                return new Date (timeToUpdate.getTime()+ time*60000)
            }

            let estimatedTime = addMinutes(order.updatedAt, theTime)

            console.log(estimatedTime)  

            Order.findByIdAndUpdate(order.id, { $set: { message: req.body.message , state: 'confirmed', estimatedTime:estimatedTime}})
                .populate('createdBy')
                .populate('productList.product')
                .then(theOrder => {
                    mailer.sendConfirmationOrder(order.createdBy.email, order.createdBy.name, userTarget)
                    console.log(order)
                    res.render('order/orderSent', {
                        order: theOrder,
                        productList: theOrder.productList
                    })
                })
                .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
}

module.exports.rebuy = (req, res ,next) => {

    let orderId = req.params.id

    Order.findById(orderId)
        .populate('createdBy')
        .populate('productList.product')
        .then(order => {
            Order.create(order)
                .then(order => {
                    res.render('order/confirm', {
                        order,  
                        productList: order.productList
                    })
                })
                .catch(error => console.log(error))
        })
        .catch(error => console.log(error))  
}


