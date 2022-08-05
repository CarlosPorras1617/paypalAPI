try {
    let paypalController = {};

    paypalController.getAllPayPalOrders = async (req, res) => {
        if(connection){
            await connection.query(
                'SELECT * FROM paypal_order ORDER BY created_date;',
                (err, rows) => {
                    if(err){
                        res.status(500).json(err);
                    } else {
                        res.status(200).json(rows);
                        console.log(rows);
                    }
                }
            );
        }
    };

    paypalController.getPayPalOrderByID = async (req, res) => {
        if(connection){
            await connection.query(
                "SELECT * FROM paypal_order WHERE order_id='" + req.params.id + "';",
                (err, rows) => {
                    if(err){
                        res.status(500).json(err);
                    } else {
                        res.status(200).json(rows);
                    }
                }
            );
        }
    };

    paypalController.addPayPalOrder = async (req, res) => {
        if(connection){
            await connection.query(
                "INSERT INTO paypal_order (paypal_order_id, paypal_payer_id, paypal_payer_email, paypal_country_code, paypal_amount, paypal_currency, status) VALUES " + 
                "('"+req.body.paypal_order_id+"', '"+req.body.paypal_payer_id+"', '"+req.body.paypal_payer_email+"', '"+req.body.paypal_country_code+"', "+req.body.paypal_amount+", '"+req.body.paypal_currency+"', '"+req.body.status+"');",
                (err, rows) => { 
                    if(err){
                        res.status(500).json(err);
                    } else { 
                        res.status(200).json(rows);
                    }
                }
            );
        }
    };
    
    paypalController.updatePayPalOrderStatus = async (req, res) => {
        if(connection){
            await connection.query(
                "UPDATE paypal_order SET status="+req.body.status+" WHERE order_id="+req.body.order_id+";",
                (err, rows) => { 
                    if(err){
                        res.status(500).json(err);
                    } else { 
                        res.status(200).json(rows);
                    }
                }
            );
        }
    };

    module.exports = paypalController;
} catch (error) {
    
}