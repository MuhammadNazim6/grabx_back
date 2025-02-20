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
      quality,
      search,
      limit,
      page = 1,
    } = req.query;
    const query: any = {};

    // Add filters to query based on parameters
    if (category && category != "all") query.category = category;
    if (brand) query.brand = brand;
    if (size) query.size = size;
    if (quality) query.quality = Number(quality);
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Handle price range
    if (priceRange) {
      query.actualPrice = {};
      if (priceRange) query.actualPrice.$lte = Number(priceRange);
    }

    // Get total count first
    const totalCount = await Product.countDocuments(query);

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Then get the paginated results
    let products;
    if (Number(limit) >= 3) {
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

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, size, quality, brand, productName } =
      req.query;
    const query: any = {};

    if (category) query.category = category;
    if (size) query.size = size;
    if (quality) query.quality = quality;
    if (brand) query.brand = brand;
    if (productName) query.productName = { $regex: name, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.actualPrice.$gte = Number(minPrice);
      if (maxPrice) query.actualPrice.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while searching products",
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
      images,
      category,
      offerPrice,
      stock,
      quality,
      is_listed,
    } = req.body;

    if (
      !productName ||
      !actualPrice ||
      !size ||
      !images ||
      !category ||
      !quality
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
      images: imageUrlsAfterUploading,
      category,
      offerPrice,
      stock,
      quality,
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
      images,
      category,
      offerPrice,
      stock,
      quality,
      is_listed,
    } = req.body;

    let updateData: any = {
      productName,
      description,
      brand,
      actualPrice,
      size,
      category,
      offerPrice,
      stock,
      quality,
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
