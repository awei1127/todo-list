// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const User = require('../../models/user')
// 引用 passport
const passport = require('passport')

// 定義路由
// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 送出登入資訊。加入 middleware，驗證 request 登入狀態
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 送出註冊資訊
router.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body

  // 建立用來儲存錯誤訊息的陣列
  const errors = []
  // 只要有任一空欄就推入錯誤訊息
  if (!username || !email || !password || !confirmPassword) {
    errors.push({
      message: '所有欄位都是必填。'
    })
  }
  // 密碼與確認密碼不一致時推入錯誤訊息
  if (password !== confirmPassword) {
    errors.push({
      message: '密碼與確認密碼不一致。'
    })
  }
  // 有空欄或確認密碼不同時把使用者擋在register畫面，不去mongoDB找資料。
  if (errors.length) {
    return res.render('register', { errors, username, email, password, confirmPassword })
  }

  User.findOne({ email: email }).then(user => {
    if (user) {
      // 帳號已存在時推入錯誤訊息
      errors.push({
        message: '這個 Email 已經註冊過了。'
      })
      res.render('register', { errors, username, email, password, confirmPassword })
    } else {
      return User.create({ username, email, password })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    }
  })
})

// 登出請求
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router