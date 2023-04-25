// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const User = require('../../models/user')

// 定義路由
// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 送出註冊資訊
router.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body
  User.findOne({ email: email }).then(user => {
    if (user) {
      console.log('already exists.')
      res.render('register', { username, email, password, confirmPassword })
    } else {
      return User.create({ username, email, password })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    }
  })
})

module.exports = router