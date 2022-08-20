var api = 'http://localhost:3000/api/paypal-order';
var apiProduts = 'http://localhost:3000/api/products';
var apiKart = 'http://localhost:3000/api/kart';
var totalPagar;

$('#boton').click(function () {
    filterRows();
});

$(document).ready(function () {
    generarActualizarTablaPaypal();
    generarCatalogoProducts();
    initPayPalButton();
    obtenerKart();
    //pa que jale el modal
    $('.modal').modal();
});

jSuites.calendar(document.getElementById('calendar'), {
    type: 'year-month-picker',
    format: 'MMM-YYYY',
    validRange: ['2020-02-01', '2022-12-31']
});

function initPayPalButton() {
    paypal.Buttons({
        style: {
            shape: 'pill',
            color: 'gold',
            layout: 'horizontal',
            label: 'buynow',

        },
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    "amount": {
                        "currency_code": "USD",
                        "value": totalPagar
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {

                // Full available details
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                //insertamos la compra
                addCompraEnTabla(orderData);
                //vacia el carrito
                eliminarKart();
                // Show a success message within this page, e.g.
                const element = document.getElementById('paypal-button-container');
                element.innerHTML = '';
                element.innerHTML = '<h3>Gracias por su compra!</h3>';
                $(document).ready(function () {
                    generarActualizarTablaPaypal();
                });
                // Or go to another URL:  actions.redirect('thank_you.html');
            });
        },
        onError: function (err) {
            console.log(err);
        }
    }).render('#paypal-button-container');
}

//Añade la compra a la tabla paypal
function addCompraEnTabla(orderData) {
    fetch(api, {
        method: 'POST',
        body: JSON.stringify({
            "paypal_order_id": orderData.id,
            "paypal_payer_id": orderData.payer.payer_id,
            "paypal_payer_email": orderData.payer.email_address,
            "paypal_country_code": orderData.payer.address.country_code,
            "paypal_amount": orderData.purchase_units[0].amount.value,
            "paypal_currency": orderData.purchase_units[0].amount.currency_code,
            "status": orderData.purchase_units[0].payments.captures[0].status
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).catch(error => console.log(error)).then(response => console.log(response));
}

//Trae las ordenes de paypal XD
function generarActualizarTablaPaypal() {
    fetch(api, {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        if (data.length > 0) {
            //llenamos la tabla mandando a llamar un metodo
            $("#idBody").empty();
            data.forEach((doc) => {
                metodoAppend(doc);
            });
        }
    })
}

//Renderiza la tabla en base a las ordenes de paypal
function metodoAppend(doc) {
    $("#idBody").append('<tr>' +
        '<td>' + doc.order_id + '</td>' +
        '<td>' + doc.paypal_order_id + '</td>' +
        '<td>' + doc.paypal_payer_id + '</td>' +
        '<td>' + doc.paypal_payer_email + '</td>' +
        '<td>' + doc.paypal_country_code + '</td>' +
        '<td>' + doc.paypal_amount + '</td>' +
        '<td>' + doc.paypal_currency + '</td>' +
        '<td>' + doc.status + '</td>' +
        '<td>' + moment(new Date(doc.created_date)).format('DD/MM/YYYY') + '</td>' +
        '</tr>'
    )
}

//leale viejo, solo filtra ._.'
function filterRows() {
    var from = $('#datefilterfrom').val();
    var to = $('#datefilterto').val();
    if (!from && !to) { // no value for from and to
        return;
    }
    from = from || '1970-01-01'; // default from to a old date if it is not set
    to = to || '2999-12-31';
    var dateFrom = moment(from);
    var dateTo = moment(to);
    $('#testTable tr').each(function (i, tr) {
        var val = $(tr).find("td:nth-child(9)").text();
        var dateVal = moment(val, "DD/MM/YYYY");
        var visible = (dateVal.isBetween(dateFrom, dateTo, null, [])) ? "" : "none"; // [] for inclusive
        $(tr).css('display', visible);
    });
}

$('#datefilterfrom').on("change", filterRows);
$('#datefilterto').on("change", filterRows);

//Trae los juegos
function generarCatalogoProducts() {
    fetch(apiProduts, {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        if (data.length > 0) {
            data.forEach((doc) => {
                metodoAppendProducts(doc);
            });
        }
    })
}
//añade al carrito
function addKart(id_product){
    fetch(apiKart,{
        method: 'POST',
        body: JSON.stringify({
            product_id: id_product,
            user_id:1,
            quantity:1
        }),
        headers:{
            "Content-type" : "application/json"
        }
    }).then(response => {
        //console.log(response);
        if(response.status == 200){
            M.toast({html: "Agregado al carrito"});
            obtenerKart();
        }else{
            M.toast({response});
        }
    }).catch(err => console.log(err));
}

//Trae los productos del carrito
function obtenerKart() {
    //mandamos el 1 para indicar el usuario
    fetch(apiKart + '/1', {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        console.log(apiKart+'/1');
        console.log(data);
        totalPagar = 0;
        if (data.length > 0) {
            $('#smart-button-container').css('display', 'block');
            //llenamos la tabla mandando a llamar un metodo
            $("#tablaKart").empty();
            data.forEach((doc) => {
                metodoAppendKart(doc);
            });
        }else{
            $('#totalPagar').text("Total: $" + totalPagar);
            $("#tablaKart").empty();
        }
    })
}

//Eliminar todo el carrito
function eliminarKart(){
    fetch(apiKart + '/1',{
        method: 'DELETE',
        headers:{
            "Content-type":"application/json"
        }
    }).then(response=>{
        if (response.status == 200) {
            //actualizamos el carrito
            obtenerKart();
        }else{
            M.toast({html: "Ocurrio un error"});
        }
    })
}

//Eliminar un producto del carrito
function eliminarProductoKart(id){
    fetch(apiKart,{
        method: 'PUT',
        body: JSON.stringify({
            //cambia status a 0 para que ya no aparezca en el carrito
            id: id,
            status: 0
        }),
        headers:{
            "Content-type":"application/json"
        }
    }).then(response=>{
        if (response.status == 200) {
            M.toast({html: "Se elimino del carrito"});
            obtenerKart();
        }else{
            M.toast({html: "Ocurrio un error"});
        }
    })
}

//Renderiza la tabla en base a los productos en el carrito
function metodoAppendKart(doc) {
    $("#tablaKart").append('<tr>' +
        '<td>' + doc.name + '</td>' +
        '<td> <img src="'+ doc.image +'" height="100" widtg="100"></td>' +
        '<td>' + doc.quantity + '</td>' +
        '<td>'+'$' + doc.price + '</td>' +
        '<td><i class="material-icons red-text" onclick="eliminarProductoKart('+doc.id+')">delete</i></td>' +
        '</tr>'
    );
    totalPagar = totalPagar + doc.price;
    parseFloat(totalPagar).toFixed(2);
    $('#totalPagar').text("Total: $" + totalPagar);
    console.log(totalPagar);

}

//Hace las cards de products todo mal estructurado XD
function metodoAppendProducts(doc){
    $('#catalogoProducts').append(
            '<div class="col s2 m2 l2">'+
                '<div class="card" style="height: 470px; width: 200px;">' +
                    '<div id="'+doc.id_product+'"  class="card-image center">'+
                    '<img style="height: 300px; width: 200px;" src="'+ doc.image +'">'+
                    '<h6><strong>'+ doc.name+'</strong></h6>'+
                    '<p><strong>$'+ doc.price +' USD</strong></p>'+
                    '<button id = "comprarBoton" class="waves-effect waves-light btn-small green" style="margin-bottom: 8px"><i class="material-icons left">payment</i>Comprar</button>'+
                    '<button id="añadirCarroBoton" onClick="addKart('+doc.id_product+')" class="waves-effect waves-light btn-small red"><i class="material-icons left">shopping_cart</i>Al Carrito</button>'+
                    '</div>'+
                    '<div class="card-content">'+
                    
                    '</div>'+
                '</div>'+
            '</div>'
    )
}


