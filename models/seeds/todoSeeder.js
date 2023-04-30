const bcrypt = require('bcryptjs')
const Todo = require('../todo') // 載入 todo model
const User = require('../user')
const db = require('../../config/mongoose')

const SEED_USER = {
  username: 'root',
  email: 'root@example.com',
  password: '12345678'
}

db.once('open', () => {
  // 建立種子使用者
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      username: SEED_USER.username,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      // 建立種子todo
      const userId = user._id
      return Promise.all(Array.from({ length: 10 }, (v, i) =>
        Todo.create({ name: `name-${i}`, userId })
      ))
    })
    .then(() => {
      console.log('done')
      process.exit()
    })
})