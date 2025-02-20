import express from "express";
import {
  addAddress,
  deleteAddress,
  editAddress,
  fetchUserAddresses,
  updateDefaultAddress,
} from "../controllers/address";
import verifyToken from "../middlewares/auth";
const addressRoute = express();

addressRoute.post("/add-address", verifyToken, addAddress);
addressRoute.post("/edit-address", verifyToken, editAddress);
addressRoute.post("/delete-address", verifyToken, deleteAddress);
addressRoute.post(
  "/default-address/:addressId",
  verifyToken,
  updateDefaultAddress
);
addressRoute.get("/addresses", verifyToken, fetchUserAddresses);

export default addressRoute;
