// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 Todo model
const Todo = require('../../models/todo')

// 定義路由
// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// edit頁面
router.get('/:id/edit', (req, res) => {
  Todo.findById(req.params.id)
    .lean()
    .then(todo => { res.render('edit', { todo }) })
    .catch(error => console.log(error))
})

// detail頁面
router.get('/:id', (req, res) => {
  Todo.findById(req.params.id)
    .lean()
    .then(todo => { res.render('detail', { todo }) })
    .catch(error => console.log(error))
})

// delete請求
router.delete('/:id', (req, res) => {
  const id = req.params.id
  Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// post請求
router.post('/', (req, res) => {
  const name = req.body.name             // 從 req.body 拿出表單裡的 name 資料
  const todo = new Todo({
    name: name
  })
  return todo.save()                 // 存入資料庫
    .then(() => { res.redirect('/') }) // 新增完成後導回首頁
    .catch(error => { console.log(error) })
})

// put請求
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body         // 從 req.body 拿出表單裡的資料
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => {
      res.redirect(`/todos/${id}`)
    })
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router