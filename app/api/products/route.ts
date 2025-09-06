import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();


    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    });

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);

          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    console.log("Product_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// 1. dont need to check auth
// 2. connect db
// 3. find() - sort({createdAt: 'des'}) from mongoose
// 4. return for user
// 5. response when server met error

export const GET = async (req: NextRequest) => {
  try {
    // 1. connect db
    await connectToDB();

    // 2. find() - sort({createdAt: 'des'}) from mongoose
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    // 3. return for user
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("products_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
