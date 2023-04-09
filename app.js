const express = require('express')
const app = express()
const port = 3000
const Todo = require('./models/todo')

const exphbs = require('express-handlebars')

const mongoose = require('mongoose')
const todo = require('./models/todo')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 根目錄
app.get('/', (req, res) => {
  Todo.find()
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(error => console.log(error))
})

// 新增頁面
app.get('/todos/new', (req, res) => {
  res.render('new')
})

// edit頁面
app.get('/todos/:id/edit', (req, res) => {
  Todo.findById(req.params.id)
    .lean()
    .then(todo => { res.render('edit', { todo }) })
    .catch(error => console.log(error))
})

// detail頁面
app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id)
    .lean()
    .then(todo => { res.render('detail', { todo }) })
    .catch(error => console.log(error))
})

// 新增todo
app.post('/todos', (req, res) => {
  const name = req.body.name             // 從 req.body 拿出表單裡的 name 資料
  const todo = new Todo({
    name: name
  })
  return todo.save()                 // 存入資料庫
    .then(() => { res.redirect('/') }) // 新增完成後導回首頁
    .catch(error => { console.log(error) })
})

// 修改特定todo
app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name             // 從 req.body 拿出表單裡的 name 資料
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => {
      res.redirect(`/todos/${id}`)
    })
    .catch(error => console.log(error))
})

// 執行並監聽
app.listen(port, () => {
  console.log(`Express server is listening on http://localhost:${port}`)
})