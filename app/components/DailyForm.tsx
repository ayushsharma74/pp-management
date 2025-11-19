"use client";

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Calculator, TrendingUp, TrendingDown } from "lucide-react";

interface UdhaarEntry {
  name: string;
  date: string;
  amount: number;
}

interface FormData {
  name: string;
  date: string;

  previousPetrolReading: number;
  currentPetrolReading: number;
  petrolRate: number;

  previousDieselReading: number;
  currentDieselReading: number;
  dieselRate: number;

  cash: number;
  onlinePay: number;
  otherPayment: number;

  udhaar: UdhaarEntry[];
}

interface DailyFormProps {
  onAddEntry: (data: FormData) => Promise<void>;
}

const DailyForm: React.FC<DailyFormProps> = ({ onAddEntry }) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { udhaar: [] },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchedValues = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "udhaar",
  });

  /* -------------------------------------------
     Calculate real-time sale, received, profit
  --------------------------------------------*/
  const calculateProfit = () => {
    const pPrev = parseFloat(String(watchedValues.previousPetrolReading ?? 0));
    const pCurr = parseFloat(String(watchedValues.currentPetrolReading ?? 0));
    const pRate = parseFloat(String(watchedValues.petrolRate ?? 0));

    const dPrev = parseFloat(String(watchedValues.previousDieselReading ?? 0));
    const dCurr = parseFloat(String(watchedValues.currentDieselReading ?? 0));
    const dRate = parseFloat(String(watchedValues.dieselRate ?? 0));

    const cash = parseFloat(String(watchedValues.cash ?? 0));
    const online = parseFloat(String(watchedValues.onlinePay ?? 0));
    const other = parseFloat(String(watchedValues.otherPayment ?? 0));

    const petrolSales = pCurr - pPrev;
    const dieselSales = dCurr - dPrev;

    const totalSaleAmount = petrolSales * pRate + dieselSales * dRate;
    const totalReceived = cash + online + other;
    const profit = totalReceived - totalSaleAmount;

    return { petrolSales, dieselSales, totalSaleAmount, totalReceived, profit };
  };

  const { petrolSales, dieselSales, totalSaleAmount, totalReceived, profit } =
    calculateProfit();

  /* -------------------------------------------
      Submit
  --------------------------------------------*/
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("FORM SUBMIT =>", data);

      await onAddEntry(data);
      reset();
    } catch (error) {
      console.error("Error adding entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Calculator className="text-blue-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Daily Entry</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* NAME + DATE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="Umesh Sharma"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        {/* PETROL SECTION */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="font-semibold text-orange-800 mb-3">Petrol Sales</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Previous */}
            <div>
              <label className="block text-sm font-medium">
                Previous Reading
              </label>
              <input
                type="number"
                step="any"
                {...register("previousPetrolReading", {
                  required: "Previous reading required",
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Current */}
            <div>
              <label className="block text-sm font-medium">
                Current Reading
              </label>
              <input
                type="number"
                step="any"
                {...register("currentPetrolReading", {
                  required: "Current reading required",
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium">Rate (₹)</label>
              <input
                type="number"
                step="any"
                {...register("petrolRate", { required: "Rate required" })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* DIESEL SECTION */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">Diesel Sales</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Previous */}
            <div>
              <label className="block text-sm font-medium">
                Previous Reading
              </label>
              <input
                type="number"
                step="any"
                {...register("previousDieselReading", {
                  required: "Previous reading required",
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Current */}
            <div>
              <label className="block text-sm font-medium">
                Current Reading
              </label>
              <input
                type="number"
                step="any"
                {...register("currentDieselReading", {
                  required: "Current reading required",
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium">Rate (₹)</label>
              <input
                type="number"
                step="any"
                {...register("dieselRate", {
                  required: "Rate required",
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* PAYMENT SECTION */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-3">
            Payments Received
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cash */}
            <div>
              <label className="block text-sm font-medium">Cash (₹)</label>
              <input
                type="number"
                step="any"
                {...register("cash", { required: "Cash required" })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Online Pay */}
            <div>
              <label className="block text-sm font-medium">
                Online Pay (₹)
              </label>
              <input
                type="number"
                step="any"
                {...register("onlinePay", { required: "Online pay required" })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Other */}
            <div>
              <label className="block text-sm font-medium">
                Other Payment (₹)
              </label>
              <input
                type="number"
                step="any"
                {...register("otherPayment", {
                  required: "Other payment required",
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* UDH AAR SECTION */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">
            Udhaar (Credit)
          </h3>

          {fields.length === 0 && (
            <p className="text-sm text-gray-600 mb-3">
              No udhaar entries added yet.
            </p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-md shadow-sm border"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register(`udhaar.${index}.name`, {
                    required: "Name is required",
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  {...register(`udhaar.${index}.date`, {
                    required: "Date required",
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* AMOUNT */}
              <div>
                <label className="block text-sm font-medium">Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  {...register(`udhaar.${index}.amount`, {
                    required: "Amount required",
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* REMOVE BUTTON */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ name: "", date: "", amount: 0 })}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Udhaar Entry
          </button>
        </div>

        {/* REAL TIME CALCULATION */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Live Calculation</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 text-center">
            <div>
              <div className="text-sm text-gray-600">Total Sale Amount</div>
              <div className="text-xl font-bold text-blue-600">
                ₹{totalSaleAmount.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Total Received</div>
              <div className="text-xl font-bold text-green-600">
                ₹{totalReceived.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Profit / Loss</div>
              <div
                className={`text-xl font-bold flex items-center justify-center gap-1 ${
                  profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {profit >= 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                ₹{Math.abs(profit).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
              Adding Entry...
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Entry
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DailyForm;
