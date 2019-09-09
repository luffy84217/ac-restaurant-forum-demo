const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const categoryService = require('../../services/categoryService.js')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  }
}
module.exports = categoryController