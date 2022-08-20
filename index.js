try {
    const express = require('express');
    const app = express();
    const morgan = require('morgan');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const connection = require('./database/databasemykey');

    const port = process.env.PORT || 3000;
    
    //Settings
    app.set('port', port);
    
    //Middlewares
    app.use(morgan('dev')); 
    app.use(bodyParser.json());
    app.use(cors({ origin: '*'}));
    //app.use(cors());     
     
    
    //Routes
    app.use('/api/paypal-order', require('./routes/paypal.routes'));
    app.use('/api/products', require('./routes/products.routes'));
    app.use('/api/kart', require('./routes/kart.routes'));
    //Server
    app.listen(port, () => {
        console.log('server on port: ' + port); 
    }); 

} catch (error) {
    console.log(error);
}