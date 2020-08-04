const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
const https = require('https');
const sendPhoneMessage = require('./helper/SendConfirmation');
const sendAdminEmail = require('./helper/SendConfirmationSeller');
require('dotenv').config()

const port = process.env.PORT || 3000
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to home route')
})
app.post('/send-email', (req, res) => {
    const { formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate } = req.body
    sendPhoneMessage(formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate).then(data => {
        if (data.body.Messages[0].Status === 'success') {
            return
        }
        res.send({
            status: 400,
            error: 'server Error'
        })
    })
        .then(() => sendAdminEmail(formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate))
        .then(data => {
            res.send({
                status: 201,
                data: data.body
            })
        }).catch(err => {
            console.log(err,'=====')
            res.send({
                status: 404,
                data: err
            })
        })
})


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})