var api = 'http://localhost:3000/api/paypal-order';

$('#boton').click(function () {
    filterRows();
    console.log("test")
 });

$(document).ready(function(){
    generarActualizarTablaPaypal();
    initPayPalButton();
});

    jSuites.calendar(document.getElementById('calendar'), {
        type: 'year-month-picker',
        format: 'MMM-YYYY',
        validRange: [ '2020-02-01', '2022-12-31' ]
    });

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
                console.log(orderData.purchase_units[0].payments.captures[0].status);*/
                // Show a success message within this page, e.g.
                const element = document.getElementById('paypal-button-container');
                element.innerHTML = '';
                element.innerHTML = '<h3>Gracias por su compra!</h3>';
                $(document).ready(function(){
                    generarActualizarTablaPaypal();
                });
                // Or go to another URL:  actions.redirect('thank_you.html');
            });
        },
        onError: function(err) {
            console.log(err);
        }
    }).render('#paypal-button-container');
}


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
            "status": orderData.purchase_units[0].payments.captures[0].status
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
      '<td>' + moment(new Date(doc.created_date)).format('DD/MM/YYYY') + '</td>' +
      '</tr>'
    )
  }

  
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
    $('#testTable tr').each(function(i, tr) {
      var val = $(tr).find("td:nth-child(9)").text();
      var dateVal = moment(val, "DD/MM/YYYY");
      var visible = (dateVal.isBetween(dateFrom, dateTo, null, [])) ? "" : "none"; // [] for inclusive
      $(tr).css('display', visible);
    });
  }
  
  $('#datefilterfrom').on("change", filterRows);
  $('#datefilterto').on("change", filterRows);

