import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";

// su dung get thi kh can check auth - vi bat ky nguoi dung nao cung co quyen truy cap
export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    // 1. ket noi database
    await connectToDB();

    // 2. tim collection dua tren id
    // id duoc lay tu param duoc truyen xuong
    // neu khong co se tra ve "null"
    const collection = await Collection.findById(params.collectionId).populate({
      path: "products",
      model: Product,
    });

    // 3. kiem tra xemm collection co ton tai khong
    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    // 4. tra ve du lieu khi get
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("CollectionID_GET", error);
    return new NextResponse("Internal server", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    // 1. check auth
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. connect db
    await connectToDB();

    // 3. su dung method findByid of mongoose - de xem collection co ton tai kh
    // neu kh tra ve null
    let collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    // 4. lay du lieu tu nguoi dung
    const { title, description, image } = await req.json();

    // 5. check xem title va image da dc nhap vao chua
    // vi khi cau hinh title, image - co required = true
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    // 6. update collection bang method findbyidandupdate
    // 3 tham so: id, value to update, option
    // option: new = true - if document modifier, will update the value
    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, description, image },
      { new: true }
    );

    // 7. return for user
    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    // 8. tra ve neu gap loi
    console.log("[collectionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    // 1. check auth
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // 2. coonnect db
    await connectToDB();

    // 3. delete value by method findbyidanddelete of mongoose
    await Collection.findByIdAndDelete(params.collectionId);

    await Product.updateMany(
      {
        collections: params.collectionId,
      },
      {
        $pull: { collections: params.collectionId },
      }
    );

    // 4. return new value for user
    return new NextResponse(
      JSON.stringify({ message: "Collection is deleted" }),
      { status: 200 }
    );
  } catch (error) {
    // return when met some error above
    console.log("collectionId_DELETE", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
};

export const dynamic = "force-dynamic";
