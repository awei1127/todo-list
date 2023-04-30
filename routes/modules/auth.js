// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const passport = require('passport')

// facebook login 按鈕
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// facebook 回呼路由
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 匯出路由模組
module.exports = router