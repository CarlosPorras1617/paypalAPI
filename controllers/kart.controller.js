try {
    let kartController = {};

    kartController.getAllKart = async (req, res) => {
        if(connection){
            await connection.query(
                "SELECT kart.id, kart.quantity, kart.product_id, kart.user_id, products.name, products.price, products.image, products.stock " +  
                "FROM kart AS kart INNER JOIN products AS products " +
                "ON kart.product_id=products.id_product WHERE kart.status=1 AND products.status=1 AND kart.user_id="+req.params.user_id+";",
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

    kartController.addToKart = async (req, res) => {
        if(connection){
            await connection.query(
                "INSERT INTO kart (product_id, user_id, quantity) VALUES " + 
                "("+req.body.product_id+", "+req.body.user_id+", "+req.body.quantity+");",
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

    kartController.deleteProductInKart = async (req, res) => {
        if(connection){
            await connection.query(
                "UPDATE kart SET status="+req.body.status+" WHERE id="+req.body.id+";",
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

    kartController.deleteAllProductsInKart = async (req, res) => {
        if(connection){
            await connection.query(
                "DELETE FROM kart WHERE user_id="+req.params.id+";",
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
    
    module.exports = kartController;
} catch (error) {
    console.log(error);
}
    