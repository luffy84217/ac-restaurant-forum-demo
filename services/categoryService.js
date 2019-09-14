const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const categoryService = {
    getCategories: (req, res, callback) => {
        return Category.findAll().then(categories => {
          if (req.params.id) {
            Category.findByPk(req.params.id)
              .then((category) => {
                return res.render('admin/categories', { categories: categories, category: category })
              })
          } else {
            callback({ categories: categories })
          }
        })
    },

    postCategory: (req, res, callback) => {
      if (!req.body.name) {
        return callback({ status: 'error', message: "name didn't exist" })
      } else {
        return Category.create({
          name: req.body.name
        })
          .then((category) => {
            callback({ status: 'success', message: 'category was successfully created' })
          })
      }
    },
  
    putCategory: (req, res) => {
      if (!req.body.name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      } else {
        return Category.findByPk(req.params.id)
          .then((category) => {
            category.update(req.body)
              .then((category) => {
                callback({ status: 'success', message: 'category was successfully updated' })
              })
          })
      }
    },
  
    deleteCategory: (req, res) => {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.destroy()
            .then((category) => {
              callback({ status: 'success', message: '' })
            })
        })
    }
}

module.exports = categoryService 



