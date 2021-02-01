const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views/partials'));


//nuevo
/** form helpers */
hbs.registerHelper('isInvalid', (error) => {
    return error ? 'is-invalid' : ''
});
//

hbs.registerHelper('isInvalid', (error) => {
    return error ? new hbs.SafeDtring(`<div class="invalid-feedback">${error}</div>`) : ''
});

