try {
    const express = require('express');
    const router = express.Router();
    const productsController = require('../controllers/products.controller');
    
    router.get('/', productsController.getAllProducts);
    router.post('/', productsController.addProduct);
    
    module.exports = router;   
} catch (error) {
    console.log(error);
}