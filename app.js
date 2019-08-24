const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const app = express()
const port = 3000
app.engine('handlebars', handlebars()) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})