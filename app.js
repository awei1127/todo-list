const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')
const session = require('express-session')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

//Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數。
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
app.use(routes)


// 執行並監聽
app.listen(port, () => {
  console.log(`Express server is listening on http://localhost:${port}`)
})