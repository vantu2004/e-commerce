import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = User.countDocuments();
    const totalProducts = Product.countDocuments();

    // aggregate() nhận vào một mảng các stage (bước xử lý)
    const salesData = await Order.aggregate([
      {
        $group: {
          // gom tất cả các order vào 1 nhóm duy nhất
          _id: null,

          // tính tổng đơn hàng kiểu như loop qua từng document và tăng biến đếm lên 1
          totalSales: { $sum: 1 },
          // tính tổng doanh thu theo field totalAmount
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalSales,
      totalRevenue,
    });
  } catch (error) {
    throw error;
  }
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createAt" } },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      // phía trên đang nhóm theo ngày, sort 1 là tăng, -1 là giảm
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);
    // dateArray là mảng các ngày cần lấy => loop qua để từ dailySalesData (trc đó đã gom nhóm theo ngày) lọc ra các ngày cần lấy
    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData ? foundData.totalSales : 0,
        revenue: foundData ? foundData.totalRevenue : 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

// lấy các ngày dạng "YYYY-MM-DD"
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  // loop từ startDate đến endDate
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
