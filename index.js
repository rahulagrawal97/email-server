const express = require('express')
const nodeMailer = require('nodemailer')
const bodyParser = require('body-parser')
require('path')
require('dotenv').config()

const app = express()
const serverport = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(serverport, (req, res) => {
  console.log('Server is running at port:', serverport)
})

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/send', (req, res) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    },
    debug: true
  })

  transporter.on('log', console.debug)

  const { to, body, subject } = req.body.formData

  const mailOptions = {
    from: '"Rahul Agrawal" <rahulagrawal2412@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: body, // plain text body
    html: body // html body
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.sendStatus('403')
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
    res.sendStatus(200)
  })
})
