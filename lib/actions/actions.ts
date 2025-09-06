import { Customer, Order } from "../models";
import { connectToDB } from "../mongoDB";

export const getTotalSales = async () => {
  try {
    await connectToDB();

    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );

    return { totalOrders, totalRevenue };
  } catch (error) {
    console.log("totalsales_GET", error);
  }
};

export const getTotalCustomers = async () => {
  try {
    await connectToDB();

    const customers = await Customer.find();

    const totalCustomers = customers.length;

    return totalCustomers;
  } catch (error) {
    console.log("totalcustomer_GET", error);
  }
};

export const getSalesPerMonth = async () => {
  await connectToDB();
  const orders = await Order.find();

  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // 0 for Janruary --> 11 for December
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    // For June
    // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
    return acc;
  }, {});

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      new Date(0, i)
    );
    // if i === 5 => month = "Jun"
    return { name: month, sales: salesPerMonth[i] || 0 };
  });

  return graphData;
};
