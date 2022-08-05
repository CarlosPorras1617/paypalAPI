var api = 'http://localhost:3000/api/paypal-order';
function initPayPalButton() {
    paypal.Buttons({
        style: {
            shape: 'pill',
            color: 'gold',
            layout: 'horizontal',
            label: 'buynow',

        },

        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    "amount": {
                        "currency_code": "MXN",
                        "value": 200
                    }
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderData) {

                // Full available details
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                addCompraEnTabla(orderData);
                /*console.log(orderData.id);
                console.log(orderData.payer.payer_id);
                console.log(orderData.payer.email_address);
                console.log(orderData.payer.address.country_code);
                console.log(orderData.purchase_units[0].amount.value);
                console.log(orderData.purchase_units[0].amount.currency_code);
                STATUS COMPLETED, PERO SE REGISTRA COMO NULL
                console.log(orderData.purchase_units[0].payments.captures[0].status);*/
                // Show a success message within this page, e.g.
                const element = document.getElementById('paypal-button-container');
                element.innerHTML = '';
                element.innerHTML = '<h3>Thank you for your payment!</h3>';
                // Or go to another URL:  actions.redirect('thank_you.html');
            });
        },
        onError: function(err) {
            console.log(err);
        }
    }).render('#paypal-button-container');
}
initPayPalButton();

function addCompraEnTabla(orderData){
    fetch(api, {
        method: 'POST',
        body: JSON.stringify({
            "paypal_order_id" : orderData.id,
            "paypal_payer_id": orderData.payer.payer_id,
            "paypal_payer_email": orderData.payer.email_address,
            "paypal_country_code": orderData.payer.address.country_code,
            "paypal_amount": orderData.purchase_units[0].amount.value,
            "paypal_currency": orderData.purchase_units[0].amount.currency_code,
            "status":orderData.purchase_units[0].payments.captures[0].status
        }
        ),
        headers:{'Content-Type':'application/json'}
    }).then(res => res.json()).catch(error => console.log(error)).then(response => console.log(response));
}

function generarActualizarTablaPaypal(){
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
      }
      )
}

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
      '<td>' + doc.created_date + '</td>' +
      '</tr>'
    )
  }