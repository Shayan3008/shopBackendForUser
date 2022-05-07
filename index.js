const cors = require('cors')
const express = require('express')
const oracle = require('./DATABASE/oraclequery')
const connection = require('./DATABASE/oracleConnection')
const stripe = require('stripe')('sk_test_51K6d2vSJbqR4cKbk1ZjCZwHaVIMJVsRrrrV6zf4noeuBeEmoCai6XI70aFAz7TqQkAlY6K18te83Zvh52kNuIfKY000ftN9bGF')
const itemRoute = require('./Routers/itemRoute')
const categoryRoute = require('./Routers/categoryRoute')
const orderRoute = require('./Routers/order')
const app = express()
const port = 3000
const nodemailer = require('nodemailer');
const loginRoute = require('./Routers/login')
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', itemRoute)
app.use('/category', categoryRoute)
app.use('/order', orderRoute)
app.use('/login', loginRoute)
const pay = async () => {
  const cust = await stripe.customers.create({
    email: 'shayanjawed4@gmail.com'
  })
  stripe.invoiceItems
    .create({
      customer: cust.id, // set the customer id
      amount: 2500, // 25
      currency: 'usd',
      description: 'One-time setup fee',
    })
}
// pay()
app.post('/mail', async (req, res) => {

  try {
    const { email, oId, shipId, Address } = req.body
    console.log(oId)
    const query = await connection()
    const success = await query.execute('select * from ship where SHIPID=:id', { id: shipId })
    let row = success.rows[0][2]
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shahzaibjawed2004@gmail.com',
        pass: '03002193987',
      },
    });

    await transporter.sendMail({
      from: 'shahzaibjawed2004@gmail.com', // sender address
      to: email, // list of receivers
      subject: "CHECKING MAIL", // Subject line
      text: `Order Confirmed orderNo:${oId} and shipping no:${shipId} expected delivery: ${row} at Address ${Address}`, // plain text body
      html: `<b>Order Confirmed orderNo:${oId} and shipping no:${shipId} expected delivery: ${row} at Address ${Address}</b`, // html body
    });
    res.status(200).send({ 'success': true })
  } catch (error) {
    res.status(404).send({ 'success': false })
  }

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
