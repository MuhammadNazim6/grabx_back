import express from "express";
import { addAddress, deleteAddress, editAddress, fetchUserAddresses, updateDefaultAddress } from "../controllers/address";
const addressRoute = express();


addressRoute.post("/add-address", addAddress)
addressRoute.post("/edit-address", editAddress)
addressRoute.post("/delete-address", deleteAddress)
addressRoute.post("/default-address/:addressId", updateDefaultAddress)
addressRoute.get("/addresses", fetchUserAddresses)


export default addressRoute; 