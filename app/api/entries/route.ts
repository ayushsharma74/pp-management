import { NextRequest, NextResponse } from "next/server";
import { calculateProfit } from "../../../lib/profitCalculator";
import DailyEntry from "../../../models/DailyEntry";
import { connectDB } from "../../../lib/db";

/* ===========================
        GET ENTRIES
=========================== */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { message: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    console.log("GET REQUEST RECEIVED");
    await connectDB();

    const allowedSortFields = ["date", "createdAt", "updatedAt", "title"];
    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        { message: "Invalid sort field" },
        { status: 400 }
      );
    }

    const entries = await DailyEntry.find({})
      .select(
        "petrolSales petrolRate dieselSales dieselRate cash onlinePay otherPayment totalSaleAmount totalReceived profit date name udhaar createdAt updatedAt"
      )
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean<any[]>();

    const total = await DailyEntry.countDocuments();

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

/* ===========================
        CREATE ENTRY
=========================== */
export async function POST(request: NextRequest) {
  console.log("POST REQUEST RECEIVED");
  await connectDB();

  try {
    const {
      previousPetrolReading,
      currentPetrolReading,
      previousDieselReading,
      currentDieselReading,
      petrolRate,
      dieselRate,
      cash,
      onlinePay,
      otherPayment,
      name,
      date,
      udhaar,
    } = await request.json();

    // Required fields
    if (
      petrolRate === undefined ||
      dieselRate === undefined ||
      cash === undefined ||
      onlinePay === undefined
    ) {
      return NextResponse.json(
        {
          message: "All required fields missing",
        },
        { status: 400 }
      );
    }

    // Format udhaar
    const formattedUdhaar = Array.isArray(udhaar)
      ? udhaar.map((u: any) => ({
          name: String(u.name).toLowerCase(),
          amount: parseFloat(u.amount),
          date: new Date(u.date),
          paid: Boolean(u.paid) || false,
        }))
      : [];

    // Reading-based profit calculation
    const calculations = calculateProfit({
      previousPetrolReading: parseFloat(previousPetrolReading),
      currentPetrolReading: parseFloat(currentPetrolReading),
      petrolRate: parseFloat(petrolRate),
      previousDieselReading: parseFloat(previousDieselReading),
      currentDieselReading: parseFloat(currentDieselReading),
      dieselRate: parseFloat(dieselRate),
      cash: parseFloat(cash),
      onlinePay: parseFloat(onlinePay),
      otherPayment: parseFloat(otherPayment),
    });

    const entry = new DailyEntry({
      petrolRate: parseFloat(petrolRate),
      dieselRate: parseFloat(dieselRate),
      cash: parseFloat(cash),
      onlinePay: parseFloat(onlinePay),
      otherPayment: parseFloat(otherPayment),
      previousPetrolReading: parseFloat(previousPetrolReading),
      currentPetrolReading: parseFloat(currentPetrolReading),
      previousDieselReading: parseFloat(previousDieselReading),
      currentDieselReading: parseFloat(currentDieselReading),
      name,
      date,
      ...calculations,
      udhaar: formattedUdhaar,
    });

    const savedEntry = await entry.save();

    return NextResponse.json(
      { message: "Entry added successfully", entry: savedEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding entry:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

/* ===========================
        UPDATE UDHAAR
=========================== */
export async function PATCH(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const entryID = searchParams.get("entryID");
  const udhaarName = searchParams.get("udhaarName");

  if (!entryID || !udhaarName) {
    return NextResponse.json(
      { message: "entryID and udhaarName are required" },
      { status: 400 }
    );
  }

  const updatedEntry = await DailyEntry.findOneAndUpdate(
    { _id: entryID, "udhaar.name": udhaarName.toLowerCase() },
    { $set: { "udhaar.$.paid": true } },
    { new: true }
  );

  if (!updatedEntry) {
    return NextResponse.json(
      { message: "Entry or Udhaar not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Udhaar marked as paid", entry: updatedEntry },
    { status: 200 }
  );
}

/* ===========================
        DELETE ENTRY
=========================== */
export async function DELETE(request: NextRequest) {
  console.log("DELETE REQUEST RECEIVED", request.url);
  await connectDB();

  try {
    const params = new URL(request.url).searchParams;
    const id = params.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Entry ID is required" },
        { status: 400 }
      );
    }

    await DailyEntry.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
