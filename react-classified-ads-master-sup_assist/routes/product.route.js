const router = require("express").Router();
const productCtrl = require("../controllers/product.controller");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/adminAuth");

router
  .route("/products")
  .get(productCtrl.getProduct)
  .post(auth, productCtrl.createProduct);

router
  .route("/products/:id")
  .get(auth, productCtrl.getMyProduct)
  .delete(auth, productCtrl.deleteProduct)
  .put(auth, productCtrl.updateProduct);

// Add this new route for category retrieval
router.get("/categories", productCtrl.getCategories);

module.exports = router;
