import Product from "../models/products.js";
import Category from "../models/categories.js";
import AuditLog from "../models/auditLogs.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      initialPrice,
      price,
      productQuantity,
      productImage,
      category,
      onOffer,
      offerPrice,
    } = req.body;

    const categoryFound = await Category.findById(category);
    if (!categoryFound) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = new Product({
      productName,
      productDescription,
      initialPrice,
      price,
      productQuantity,
      productImage,
      category,
      onOffer,
      offerPrice,
      createdBy: req.user._id,
    });

    await product.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      isActive,
      search,
      sortBy,
      sortOrder = "asc",
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { productDescription: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("createdBy", "fullName email")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const totalCount = await Product.countDocuments(filter);

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(page),
        message: "No products found matching your criteria.",
      });
    }

    return res.status(200).json({
      success: true,
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "fullName email")
      .exec();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      price,
      productQuantity,
      productImage,
      category,
    } = req.body;

    const categoryFound = await Category.findById(category);
    if (!categoryFound) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const oldProduct = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "fullName email");

    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        productDescription,
        price,
        productQuantity,
        productImage,
        category,
      },
      { new: true }
    )
      .populate("category", "name")
      .populate("createdBy", "fullName email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await AuditLog.create({
      action: "UPDATE_PRODUCT",
      collectionName: "products",
      documentId: product._id,
      performedBy: req.user._id,
      payload: {
        oldData: {
          productName: oldProduct.productName,
          productDescription: oldProduct.productDescription,
          price: oldProduct.price,
          productQuantity: oldProduct.productQuantity,
          productImage: oldProduct.productImage,
          category: oldProduct.category,
        },
        newData: {
          productName: product.productName,
          productDescription: product.productDescription,
          price: product.price,
          productQuantity: product.productQuantity,
          productImage: product.productImage,
          category: product.category,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete
export const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Hard Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Deactivate product if stock reaches zero
export const checkStockAndDeactivate = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.productQuantity <= 0) {
      product.isActive = false;
      await product.save();
      return res
        .status(200)
        .json({ message: "Product deactivated due to no stock", product });
    }

    return res
      .status(200)
      .json({ success: true, message: "Product is in stock", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.productQuantity > 0) {
      product.isActive = true;
    }

    await product.save();

    return res
      .status(200)
      .json({ success: true, message: "Product stock updated", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: true, message: error.message });
  }
};

// Handle product offer pricing and discounts
export const applyOffer = async (req, res) => {
  try {
    const { offerPrice } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.onOffer = true;
    product.offerPrice = offerPrice;

    console.log("offerPrice>>>>>>>>",offerPrice);
    console.log("product>>>>>>>>",product);
    
    await product.save();
    return res
      .status(200)
      .json({ success: true, message: "Offer applied successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: true, message: error.message });
  }
};
