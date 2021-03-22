
var express = require('express');
var app = express();

const stripe = require('stripe')('sk_test_51IXow6BLs2QnbtAB2BCcinTcYmtTw1sJnIWH4ZSy87B1xmxiSkmwa0z3AtgXnICWcm6EgytDFDsnVAS8Z8cti0yz00Y2txJLBI');


var port = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get('/', (req, res) => {
    res.send('hola, este servidor solo tiene un metodo POST');
});

app.post('/paymentIntent', async (req, res) => {

    try {

        var tokenCard = await stripe.tokens.create({
            card: {
                number: req.body.cardNumber,
                exp_month: req.body.expMonth,
                exp_year: req.body.expYear,
                cvc: req.body.cvc,
            }
        });
    
        var resultt = await stripe.charges.create({
            amount: 15000,
            currency: 'mxn',
            source: tokenCard.id
        }); 
        
        res.send(resultt);
        
    } catch (ee) {        
        console.log("ERRRRORRR " + ee.type);
        console.log("ERRRRORRR " + ee);

        res.send('error');
    }
});


app.listen(port, () => {
    console.log('SERVER RUNNING ON PORT ' + port);
});