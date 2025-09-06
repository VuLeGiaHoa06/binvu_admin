import { Order, Product } from "@/lib/models";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    await connectToDB();

    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "products.product", model: Product });

    if (!orders) {
      return new NextResponse(JSON.stringify({ message: "Orders not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log("customerId_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
