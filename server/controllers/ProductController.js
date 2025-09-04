import Product from "../models/Product.js";

export async function createProduct(req, res) {
  try {
    const { name, price, images, category, description } = req.body;
    if (!name || !price || !category)
      return res.status(400).json({ message: "Missing required fields" });

    const product = await Product.create({
      name,
      price,
      images,
      category,
      description,
    });

    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}


export async function getHomeBlocks(req, res) {
  try {
    const newest = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("category", "name slug");
    const bestSellers = await Product.find()
      .sort({ soldCount: -1 })
      .limit(6)
      .populate("category", "name slug");
    const mostViewed = await Product.find()
      .sort({ viewCount: -1 })
      .limit(8)
      .populate("category", "name slug");
    const highestDiscount = await Product.aggregate([
      {
        $addFields: {
          discount: {
            $cond: [
              { $gt: ["$salePrice", 0] },
              { $subtract: ["$price", "$salePrice"] },
              0,
            ],
          },
        },
      },
      { $sort: { discount: -1 } },
      { $limit: 4 },
    ]);
    res.json({ newest, bestSellers, mostViewed, highestDiscount });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function paginate(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "12");
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug"),
      Product.countDocuments(),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function getBySlug(req, res) {
  try {
    const { slug } = req.params;
    const product = await Product.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
