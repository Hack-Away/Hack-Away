const Product = require('../models/product');
const mongoose = require('mongoose');



const products = [
    new products({
        avtarprod:{
            type: String,
            default: function() {
                return `https://i.pravatar.cc//150?u=${this.id}`
            }
        },
        restaurante:'casacroquet',
        name: 'Croquetas',
        description: 'Deliciosa orden de croquetas 5 ud las favoritas de la casa o mix al gusto del cliente!',
        price:10 
    }),
    new products({
        avtarprod:{
            type: String,
            default: function() {
                return `https://i.pravatar.cc//150?u=${this.id}`
            }
        },
        restaurante:'Lateral',
        name: 'Pinchos de queso de cabra',
        description: 'Delicioso pincho gastronómico , queso de cabra y pimiento dulce y ensalada que descansa sobre una rodaja de pan casera',
        price:3.50 
    }),
    new products({
        avtarprod:{
            type: String,
            default: function() {
                return `https://i.pravatar.cc//150?u=${this.id}`
            }
        },
        restaurante:'La luna de Napoli',
        name: 'Pizza nutela',
        description: 'Para despues de nuestros deliciosos platillos para compartir o no! Un postres que es una pizza con nuestra masa casera y tapizada con una deliciosa capa de nutela ',
        price:9 
    }),
    new products({
        avtarprod:{
            type: String,
            default: function() {
                return `https://i.pravatar.cc//150?u=${this.id}`
            }
        },
        restaurante:'Taquiza de Coyo',
        name: 'Tostadas de atun',
        description: 'Deliciosas tostadas de atún tortillas duras con un cama de nuestro guacamole casero sobre el que esta el Atun y confituras de cebollas y nuestras salsa casera por supuesto',
        price:12 
    })
    
];

const comment = [
    new Comment({
        user:'Elpaswas',
        restaurant: 'la nobia de lavapies',
        opinion: 'Excelente restaurante centrico , encontramos este restaurante por casualidad y nos encanto los recomendamos el personal super majo',
        rating:5 
    }),
    new Comment({
        user:'DonBartolo',
        restaurant: 'Taquiza de coyo',
        opinion: 'Muy buen servicio El responsable súper atento la calidad de la comida increíble y las salsa caseras wow para comprarla y llevármela a casa!',
        rating:5 
    }),
    new Comment({
        user:'Elpadredechicote',
        restaurant: 'Laterla',
        opinion: 'He visto varios reviews de este lugar y ayer por fin me decidí a probarlo la comida y la emplatados son muy buenas el servicio bien y las instalaciones bonitas el precio calidad producto no me termino de convencer',
        rating:4 
    }),
    new Comment({
        user:'YoSoySergioElvaledor',
        restaurant: 'casacroquet',
        opinion: 'Las croquetas están bien el lugar en una esquina increíble con muy buen ambiente sobretodo para after work los camareros buen plan con todos y tienen turia en lugar de la otra no podía pedir mas!',
        rating:4 
    })
  
];

const pedidos = [
    new Pedidos({
        ordenId:'4324jf549gjt59h6h65',
        orden: {
            
            ordencroquetas:1,
            cervezas:2,
            precio:15,
            timpo:12
        },
        precioTotal:15
    }),
    new Pedidos({
        ordenId:'rhy0k87k43kodjeiw94ht5g',
        orden: {
            tostadasdeatun:1,
            micheladas:2,
            precio:17,
            timpo:12
        },
        orden: {
            pasteldechocolate:4,
            precio:4,
            timpo:5
        },
        precioTotal:21
    }),
    new Pedidos({
        ordenId:'0976jih8yjh485h43743',
        producto: {
            entraña:2,
            agua:2,
            precio:24,
            timpo:15
        },
        producto: {           
            cupcake:4,
            precio:7.50,
            timpo:3
        },
        producto: {
            cervezasAle:2,
            precio:6,
            timpo:1
        },
        precioTotal:37.50
    }),
    new Pedidos({
        ordenId:'46576gtr9546g9frefre',
        producto: {
            pizzanapilotana:1,
            cervezas:2,
            precio:16,
            timpo:13
        },
        precioTotal:16
    })
    
];

