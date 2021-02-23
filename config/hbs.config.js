const hbs = require('hbs');
const path = require('path');
const Order = require('../models/order.model')

hbs.registerPartials(path.join(__dirname, '../views/partials'));

hbs.registerHelper('isInvalid', (error) => {
    return error ? 'is-invalid' : ''
});

hbs.registerHelper('formError', (error) => {
    return error ? new hbs.SafeString(`<div class="invalid-feedback">${error}</div>`) : ''
});

hbs.registerHelper('maxText', (text) => {
    return text.slice(0,100) + '...'
})

hbs.registerHelper('userRole', (role) => {

 if (role === 'admin') { 
     return ''
 } 

 if (role === 'costumer') {

     return 'd-none'
 }
})

hbs.registerHelper('userAdmin', (id, sessionUser) => {
    if (id === sessionUser.id || id === sessionUser.name){
        return ''
    } else {
        return 'd-none'
    }
})

hbs.registerHelper('separateWords', (array) => {
   
    const arraySep = array

    let wordsSep = ''
    
    for (let word of arraySep){
        wordsSep += word + ', '
    }
    
    return wordsSep
})

hbs.registerHelper('indexPlus', (index) => {
    indexPlus = index + 1
    return indexPlus
})

hbs.registerHelper('totalPriceProduct', (productListElem) => {
  
    return productListElem.product.price * productListElem.qty
})

hbs.registerHelper('totalItemsOrder', (products) => {

    let totalProducts = 0

    if (products){
        for (let product of products){
            totalProducts += product.qty
        }
    }
    
    return totalProducts
})

hbs.registerHelper('totalItemsPrice', (products) => {

    let totalPriceProducts = 0

    if(products){
        for (let product of products){
               totalPriceProducts += product.qty * product.product.price
        }}
  
    return totalPriceProducts
})

hbs.registerHelper('buttonBuy', (order) => {

    let toReturn = ''
    if (order){
        if (order.productList.length === 0){
        
        } else {

            toReturn = new hbs.SafeString(`<a href="/order/confirm/${order.id}"><button class="btn btn-dark mx-1">Buy Now</button></a>`)
        }
    }
    return toReturn
})

hbs.registerHelper('estimatedTime', (order) => {

    let thisTime = Date.now()
    let elapsedTime = (thisTime - order.updatedAt) / 60000
    let estimatedTime = (order.estimatedTime - order.updatedAt) / 60000
    let time = estimatedTime - elapsedTime 

    if (time < 0){ time = 0}

    return time.toFixed(0) 
})
hbs.registerHelper('dateFixed', (date) => {

    let fixDate = date.toString().split(' ').splice(1,3).toString()

    console.log(typeof fixDate)

    return fixDate;
})