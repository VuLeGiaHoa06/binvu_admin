// 0. get param productId
// 1. check auth - return 401
// 2. connect db
// 3. use method findByIdAdndDelete
// 4. return new data
// 5. check if some error when run will return a new message

import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { string } from "zod";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // 1. check auth
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // 2. connect db
    await connectToDB();

    // 3. use method to delete
    await Product.findByIdAndDelete(params.productId);

    return new NextResponse("Product is deleted", { status: 200 });
  } catch (error) {
    console.log("Product_DELTE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// 0. dont need to check auth
// 1. connect db
// 2. get data with method findbyid of moongoose
// 3. return data for user
// 4. return error when met error above

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // 1. connect db
    await connectToDB();

    // 2. get data with method findbyid of moongoose
    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });

    if (!product)
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );

    // 3. return data for user
    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.log("productId_GET", error);
    return new NextResponse("Interval server error", { status: 500 });
  }
};

// 0. check auth
// 1. connect db
// 1.1 check product have yet, if not return nextREponed Product cannot find and status 404
// 2. get input from user
// 3. check enough data yet
// 4. update data by method findByid and update
// 5. return data for user
// 6. check if something error above

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    console.log(userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

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
      return new NextResponse("Not enough data to create a new product", {
        status: 400,
      });
    }

    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );
    // included in new data, but not included in the previous data

    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId.toString())
    );
    // included in previous data, but not included in the new data

    // Update collections
    await Promise.all([
      // Update added collections with this product
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(
          collectionId,
          {
            $push: { products: product._id },
          },
          { new: true }
        )
      ),

      // Update removed collections without this product
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(
          collectionId,
          {
            $pull: { products: product._id },
          },
          { new: true }
        )
      ),
    ]);

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.productId,
      {
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
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELELTE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product)
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );

    await Product.findByIdAndDelete(params.productId);

    // update collection
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    return new NextResponse("Product is deleted", { status: 200 });
  } catch (error) {
    console.log("productId_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
