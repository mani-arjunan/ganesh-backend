require('dotenv').config()

const mailjet = require('node-mailjet')
    .connect(process.env.API_KEY, process.env.API_SECRET_KEY)


const sendCustEmail = (formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentDateAndTime, currentDate) => {
    return new Promise((res, rej) => {
        let orderSummaryInputValues = '';
        let forField = '';
        let emailID = formDetails.filter(formDetail => formDetail.type === 'email' && formDetail.value)[0]
        let name = formDetails.filter(formDetail => formDetail.formName === 'Name' && formDetail.value)[0]
        Object.keys(inputQuantityValue).map(orderProp => {
            orderSummaryInputValues += ` <tr>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderProp}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${inputQuantityValue[orderProp]}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${totalCartProducts[orderProp].price}</td></tr>`
        })

        formDetails.map(addressFields => {
            addressFields.value.length > 0 ?
                forField += `<div><p>${addressFields.value}</p></div > ` : null
        })

        const customerHTMLtemplate = `
    <h2>Hi ${name.value}, <h2>
    <h3>Please find your order details below</h3>
    <h4>Order summary</h4>
    <hr />
    <div> 
        <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Size</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Quantity</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Price</th>
            </tr>
            ${orderSummaryInputValues}
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Total Price</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"> ${totalPrice}</td>
            </tr>
            <div className="container">
                <h4 style="text-decoration: underline;text-align: center">Address Details:</h4><hr />
                ${forField}
            </div>
        </table>
    </div>
    <h2>Thank you for purchasing with Eco store, 
    Please contact us for any query regarding your orders.</h2>
    <div>
     Thanks and Regards <br/>
     xxx<br/>yyyy<br/>zzzz<br/>99999999999
    </div>
     `
        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "itsmh0305@gmail.com",
                            "Name": "Ganesha Eco Store"
                        },
                        "To": [
                            {
                                "Email": emailID.value,
                                "Name": name.value
                            }
                        ],
                        "Subject": `Hi ${name.value} Greetings from Ganesha Eco friendly Store for your order on ${currentDate} at ${currentDateAndTime.split('T')[1]}`,
                        "HTMLPart": `${customerHTMLtemplate} `,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            })
        request
            .then((result) => {
                res(result)
            })
            .catch((err) => {
                rej(err)
            })
    })
}


module.exports = sendCustEmail