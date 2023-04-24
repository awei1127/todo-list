// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 定義路由
// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router