const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
      User.findOne({ email })
        .then(user => {
          if (!user) { return done(null, false, { message: 'That email is not registered.' }) }
          return bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: 'Incorrect password.' })
            }
            return done(null, user)
          })
        })
        .catch(err => done(err, false))
    }
  ))

  // 設定facebook登入策略 
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    function (accessToken, refreshToken, profile, done) {
      // 儲存資料
      const { email, name } = profile._json
      // 檢查資料庫是否有此email 有的話就登入 沒有的話就註冊
      User.findOne({ email })
        .then(user => {
          if (user) {
            return done(null, user)
          }

          const randomPassword = Math.random().toString(36).slice(-8)

          bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
              User.create({
                username: name,
                email,
                password: hash
              })
            })
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
    }
  ))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}