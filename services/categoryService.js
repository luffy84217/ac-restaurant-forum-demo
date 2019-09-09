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
    }
}

module.exports = categoryService 



