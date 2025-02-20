import { Request, Response } from "express";
import { Address } from "../models/address";

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    let isDefault = false;
    const existingAddresses = await Address.find({ userId });
    if (existingAddresses.length === 0) {
      isDefault = true;
    }
    const {
      fullName,
      mobile,
      addressLine1,
      addressLine2,
      houseName,
      landmark,
      country,
      pincode,
      city,
      state,
      addressType,
    } = req.body;

    const address = new Address({
      userId,
      fullName,
      mobile,
      addressLine1,
      addressLine2,
      houseName,
      landmark,
      country,
      pincode,
      city,
      state,
      isDefault,
      addressType,
    });

    const savedAddress = await address.save();

    res.status(200).json({
      success: true,
      message: "Address added successfully",
      data: savedAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while adding address",
    });
  }
};

export const fetchUserAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const addresses = await Address.find({ userId });

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching addresses",
    });
  }
};

export const editAddress = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      fullName,
      mobile,
      addressLine1,
      addressLine2,
      houseName,
      landmark,
      country,
      pincode,
      city,
      state,
      isDefault,
      addressType,
    } = req.body;

    const updatedAddress = await Address.findByIdAndUpdate(
      _id,
      {
        fullName,
        mobile,
        addressLine1,
        addressLine2,
        houseName,
        landmark,
        country,
        pincode,
        city,
        state,
        isDefault,
        addressType,
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating address",
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const userId = req.user?.id;
    const deletedAddress = await Address.findByIdAndDelete(_id);
    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    if (deletedAddress.isDefault) {
      await Address.findOneAndUpdate({ userId }, { isDefault: true });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting address",
    });
  }
};

export const updateDefaultAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id;

    await Address.updateMany({ userId }, { isDefault: false });
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating default address",
    });
  }
};
