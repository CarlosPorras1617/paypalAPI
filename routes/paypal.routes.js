try {
    const express = require('express');
    const router = express.Router();
    const paypalController = require('../controllers/paypal.controller');
    
    router.get('/', paypalController.getAllPayPalOrders);
    router.get('/:id/', paypalController.getPayPalOrderByID);
    router.post('/', paypalController.addPayPalOrder);
    router.put('/', paypalController.updatePayPalOrderStatus); 
    
    module.exports = router;   
} catch (error) {
    
}