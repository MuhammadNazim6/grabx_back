import { Request, Response } from "express";
import Product from "../models/product";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: "drycdsvxy",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload base64 image
const uploadBase64Image = async (base64String: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to cloudinary:", error);
    throw error;
  }
};

// Function to get filename for base64 image
export const getFileNameFromBase64 = async (
  base64String: string
): Promise<string> => {
  try {
    const uploadedUrl = await uploadBase64Image(base64String);
    return uploadedUrl;
  } catch (error) {
    console.error("Error getting filename:", error);
    throw error;
  }
};

export const fetchProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      brand,
      priceRange,
      size,
      condition,
      search,
      limit,
      page = 1,
    } = req.query;
    const query: any = {};

    // Add filters to query based on parameters
    if (category && category != "all") query.category = category;
    if (brand) query.brand = brand;
    if (size) {
      query.$or = [
        { waist: { $regex: size, $options: "i" } },
        { length: { $regex: size, $options: "i" } },
      ];
    }
    if (condition) query.condition = Number(condition);
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Handle price range
    if (priceRange) {
      query.sellingPrice = {};
      if (priceRange) query.sellingPrice.$lte = Number(priceRange);
    }

    // Get total count first
    const totalCount = await Product.countDocuments(query);

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Then get the paginated results
    let products;
    if (Number(limit) >= 0) {
      products = await Product.find(query).skip(skip).limit(Number(limit));
    } else {
      products = await Product.find(query);
    }

    if (products && products.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
        count: totalCount,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit)),
      });
    }

    return res.status(200).json({
      success: true,
      message: "No products found.",
      data: [],
      count: 0,
      currentPage: Number(page),
      totalPages: 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching products",
      error: error,
    });
  }
};

export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully.",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching product details.",
      error: error,
    });
  }
};


export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      productName,
      description,
      brand,
      actualPrice,
      size,
      waist,
      length,
      images,
      category,
      sellingPrice,
      stock,
      condition,
      is_listed,
    } = req.body;

    if (
      !productName ||
      !actualPrice ||
      !sellingPrice ||
      !images ||
      !category ||
      !condition
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (images.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Images should be more than one",
      });
    }

    const imageUrlsAfterUploading = await Promise.all(
      images.map(async (image: string) => {
        return await getFileNameFromBase64(image);
      })
    );

    const product = await Product.create({
      productName,
      description,
      brand,
      actualPrice,
      size,
      waist,
      length,
      images: imageUrlsAfterUploading,
      category,
      sellingPrice,
      stock,
      condition,
      is_listed,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while creating product",
      error: error,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      _id,
      productName,
      description,
      brand,
      actualPrice,
      size,
      waist,
      length,
      images,
      category,
      sellingPrice,
      stock,
      condition,
      is_listed,
    } = req.body;

    let updateData: any = {
      productName,
      description,
      brand,
      actualPrice,
      size,
      waist,
      length,
      category,
      sellingPrice,
      stock,
      condition,
      is_listed,
    };

    if (images && images.length > 0) {
      const imageUrlsAfterUploading = await Promise.all(
        images.map(async (image: string) => {
          return await getFileNameFromBase64(image);
        })
      );
      updateData.images = imageUrlsAfterUploading;
    }

    const product = await Product.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating product",
      error: error,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting product",
      error: error,
    });
  }
};
