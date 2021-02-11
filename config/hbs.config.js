const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views/partials'));

hbs.registerHelper('isInvalid', (error) => {
    return error ? 'is-invalid' : ''
});

hbs.registerHelper('formError', (error) => {
    return error ? new hbs.SafeString(`<div class="invalid-feedback">${error}</div>`) : ''
});

hbs.registerHelper('maxText', (text) => {
    return text.slice(0,50) + '...'
})

// creo que este de abajo ya no se utiliza
hbs.registerHelper('userRole', (role) => {

 if (role === 'admin') { 
     return ''
 } 

 if (role === 'costumer') {

     return 'd-none'
 }
})

hbs.registerHelper('userAdmin', (id, sessionUser) => {
    if (id === sessionUser.id){
        return ''
    } else {
        return 'd-none'
    }
})
