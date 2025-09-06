import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
  try {
    // 1. check user
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. connect mongo
    await connectToDB();

    // 3. get input from user
    const { title, description, image } = await req.json();

    // 4. check xem title da ton tai chua - dua vao mongo
    const existingCollection = await Collection.findOne({ title });

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 });
    }

    // 5. check xem title va image da duoc dien chua - vi cau hinh du lieu title va image co required = true
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    // 6. tao moi mot collection - day len mongo
    const newCollection = await Collection.create({
      title,
      description,
      image,
    });

    // 7. tra ve collection moi cho nguoi dung
    return NextResponse.json(newCollection, { status: 200 });
  } catch (err) {
    // 8. tra ve neu gap loi server
    console.log("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// http method get - thi kh can check auth - vi bat ky nguoi dung nao cung co du lieu de truy cap
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const collections = await Collection.find().sort({ createdAt: "desc" });

    return NextResponse.json(collections, { status: 200 });
  } catch (err) {
    console.log("[collections_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
