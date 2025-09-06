import { Customer } from "@/lib/models";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const customers = await Customer.find().sort({ createdAt: "desc" });

    if (!customers) {
      return new NextResponse(
        JSON.stringify({ message: "customer not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.log("customer_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
