import express from "express";
import multer from "multer";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  getProductDetail,
  updateProduct,
} from "../controllers/product";

const productRoute = express();
const upload = multer({ storage: multer.memoryStorage() });

productRoute.get("/fetch-products", fetchProducts);
productRoute.get("/fetch-product-details/:productId", getProductDetail);

productRoute.post("/add-product", upload.array("files"), addProduct);
productRoute.post("/edit-product", upload.array("files"), updateProduct);
productRoute.post("/delete-product/:productId", deleteProduct);

export default productRoute;
