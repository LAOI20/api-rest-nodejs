
var express = require('express');
var app = express();

const stripe = require('stripe')('sk_test_51IXow6BLs2QnbtAB2BCcinTcYmtTw1sJnIWH4ZSy87B1xmxiSkmwa0z3AtgXnICWcm6EgytDFDsnVAS8Z8cti0yz00Y2txJLBI');

const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token');
const appID = 'd04ce9553fe3416aac0e345a66dcf3b9';
const appCertificate = 'ed6ac9339eb34401bfd436a622be09eb';
const role = RtcRole.PUBLISHER;

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
            amount: req.body.amount,
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


app.post('/createTokenAgora', (req, res) => {

    var tokenAgora = RtcTokenBuilder.buildTokenWithUid(
        appID, appCertificate, req.body.channelName, 0, role, 0
    );

    res.send(tokenAgora);
});


app.listen(port, () => {
    console.log('SERVER RUNNING ON PORT ' + port);
});