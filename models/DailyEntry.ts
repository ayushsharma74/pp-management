import mongoose from "mongoose";

interface UdhaarEntry {
  name: string;
  phoneNumber: string;
  date: Date;
  amount: number;
  paid: boolean;
  paidDate?: Date;
}

export interface DailyEntry extends mongoose.Document {
  name: string;

  /* --- Rates + Sales --- */
  petrolRate: number;
  dieselRate: number;
  petrolSales: number;
  dieselSales: number;

  /* --- Readings (OLD FEATURE) --- */
  previousPetrolReading: number;
  currentPetrolReading: number;
  previousDieselReading: number;
  currentDieselReading: number;

  /* --- New DIP/Stock Fields --- */
  dipPetrolMorning: string;
  dipPetrolEvening: string;
  petrolStockMorning: string;
  petrolStockEvening: string;

  dipDieselMorning: string;
  dipDieselEvening: string;
  dieselStockMorning: string;
  dieselStockEvening: string;

  /* --- Payments --- */
  cash: number;
  onlinePay: number;
  otherPayment: number;

  /* --- Totals --- */
  totalSaleAmount: number;
  totalReceived: number;
  profit: number;

  /* --- Date --- */
  date: Date;

  /* --- Udhaar (NEW FEATURE) --- */
  udhaar: UdhaarEntry[];
}

const udhaarSchema = new mongoose.Schema<UdhaarEntry>(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    paid: { type: Boolean, default: false },
    paidDate: { type: Date },
  },
  { _id: false }
);

const dailyEntrySchema = new mongoose.Schema<DailyEntry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /* --- Sales/Rates --- */
    petrolSales: { type: Number, required: true, min: 0 },
    petrolRate: { type: Number, required: true, min: 0 },

    dieselSales: { type: Number, required: true, min: 0 },
    dieselRate: { type: Number, required: true, min: 0 },

    /* --- Readings --- */
    previousPetrolReading: { type: Number, required: true, min: 0 },
    currentPetrolReading: { type: Number, required: true, min: 0 },

    previousDieselReading: { type: Number, required: true, min: 0 },
    currentDieselReading: { type: Number, required: true, min: 0 },

    /* --- New DIP/Stock Fields --- */
    dipPetrolMorning: { type: String, default: "" },
    dipPetrolEvening: { type: String, default: "" },
    petrolStockMorning: { type: String, default: "" },
    petrolStockEvening: { type: String, default: "" },

    dipDieselMorning: { type: String, default: "" },
    dipDieselEvening: { type: String, default: "" },
    dieselStockMorning: { type: String, default: "" },
    dieselStockEvening: { type: String, default: "" },

    /* --- Payments --- */
    cash: { type: Number, required: true, min: 0 },
    onlinePay: { type: Number, required: true, min: 0 },
    otherPayment: { type: Number, required: true, min: 0 },

    /* --- Totals --- */
    totalSaleAmount: { type: Number, required: true },
    totalReceived: { type: Number, required: true },
    profit: { type: Number, required: true },

    /* --- Date --- */
    date: { type: Date, default: Date.now },

    /* --- Udhaar (NEW FEATURE) --- */
    udhaar: {
      type: [udhaarSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* Index for sorting efficiency */
dailyEntrySchema.index({ date: -1 });

export default (mongoose.models.DailyEntry as mongoose.Model<DailyEntry>) ||
  mongoose.model("DailyEntry", dailyEntrySchema);
