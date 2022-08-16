try {
    let productsController = {};

    productsController.getAllProducts = async (req, res) => {
        if(connection){
            await connection.query(
                "SELECT * FROM products WHERE status=1;",
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

    productsController.addProduct = async (req, res) => {
        if(connection){
            await connection.query(
                "INSERT INTO products (name, price, image, stock) VALUES " + 
                "('"+req.body.name+"', "+req.body.price+", '"+req.body.image+"', "+req.body.stock+");",
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
    
    
    module.exports = productsController;
} catch (error) {
    console.log(error);
}