const express = require('express')
const router = express.Router()
const productController=require('../controllers/productController')

router.get('/',productController.getProduct)
router.get('/:id',productController.findOne)
router.post('/',productController.createProduct)
router.put('/:id',productController.updateProduct)
router.delete('/:id',productController.deleteProduct)


module.exports = router