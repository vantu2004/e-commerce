import redis from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(200).json({
        message: "Featured products fetched successfully",
        // redis trả về chuỗi -> parse về array lại
        products: JSON.parse(featuredProducts),
      });
    }

    // lean() giúp trả về POJO (class chỉ chứa dữ liệu, ko chứa các tinh năng thêm như method, middleware,...)
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    res.status(200).json({
      message: "Featured products fetched successfully",
      products: featuredProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body;
    if (!name || !price || !description || !image || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cloudinaryResult = await cloudinary.uploader.upload(image, {
      folder: "products",
    });

    const newProduct = new Product({
      name,
      price,
      description,
      image: cloudinaryResult?.secure_url ? cloudinaryResult.secure_url : "",
      category,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    // Dùng aggregate với $sample để random trực tiếp trong MongoDB
    // size: 3 nghĩa là lấy ngẫu nhiên 3 document từ collection Product
    const recommendedProducts = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          // 1 nghĩa là chỉ định trường nào sẽ được trả về
          name: 1,
          price: 1,
          description: 1,
          image: 1,
        },
      },
    ]);

    // Thành công -> trả về list 3 sản phẩm random
    res.status(200).json({
      message: "Recommended products fetched successfully",
      products: recommendedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommended products" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category" });
  }
};

export const markAsFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    updateFeaturedProductsCache();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
};
