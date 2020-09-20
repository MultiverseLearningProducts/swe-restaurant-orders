const express = require('express')
const { Restaurant } = require('./models')
const app = express()
const expressHandlebars  = require('express-handlebars')

app.engine('handlebars', expressHandlebars())
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/',async (req, res) => {
    const restaurants = await Restaurant.all()
    res.render('restaurants', {restaurants})
})

app.listen(process.env.PORT || 3000, function () {
    console.log('restaurant orders running on port:', process.env.PORT || 3000)
})