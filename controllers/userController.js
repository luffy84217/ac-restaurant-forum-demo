const bcrypt = require('bcrypt-nodejs') 
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '03281f5f7c443f8'

const userController = {
  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: [{ model: Comment, include: Restaurant }]
    }).then(user => {
      return res.render('users/profile', {
        profile: {
          ...user.dataValues,
          CommentsRestaurants: user.dataValues.Comments.reduce((acc, curr) => {
            acc.push(curr.dataValues.Restaurant.dataValues)
            return acc
          }, [])
      }})
    })
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      return res.render('users/edit', {user: user})
    })
  },

  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return req.flash('error_messages','permission denied')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            image: img.data.link
          }).then(user => {
            req.flash('success_messages', 'updated successfully')
            res.redirect(`/users/${req.user.id}`)
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name
        }).then((user) => {
          req.flash('success_messages', 'updated successfully')
          res.redirect(`/users/${req.user.id}`)
        })
      })
    }
  },

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if(req.body.passwordCheck !== req.body.password){
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({where: {email: req.body.email}}).then(user => {
        if(user){
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })  
        }
      })    
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },
 
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
 
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController