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
  petrolSales: number;
  petrolRate: number;
  dieselSales: number;
  dieselRate: number;
  cash: number;
  onlinePay: number;
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
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchedValues = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "udhaar",
  });

  // Calculate profit/loss in real-time
  const calculateProfit = () => {
    const petrolSales = parseFloat(watchedValues.petrolSales?.toString()) || 0;
    const petrolRate = parseFloat(watchedValues.petrolRate?.toString()) || 0;
    const dieselSales = parseFloat(watchedValues.dieselSales?.toString()) || 0;
    const dieselRate = parseFloat(watchedValues.dieselRate?.toString()) || 0;
    const cash = parseFloat(watchedValues.cash?.toString()) || 0;
    const onlinePay = parseFloat(watchedValues.onlinePay?.toString()) || 0;

    const totalSaleAmount = petrolSales * petrolRate + dieselSales * dieselRate;
    const totalReceived = cash + onlinePay;
    const profit = totalReceived - totalSaleAmount;

    return { totalSaleAmount, totalReceived, profit };
  };

  const { totalSaleAmount, totalReceived, profit } = calculateProfit();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log(data);

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
        {/* Petrol Section */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="font-semibold text-orange-800 mb-3">Petrol Sales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales (Liters)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("petrolSales", {
                  required: "Petrol sales is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.petrolSales && (
                <span className="text-red-500 text-sm">
                  {errors.petrolSales.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (₹/Liter)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("petrolRate", {
                  required: "Petrol rate is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.petrolRate && (
                <span className="text-red-500 text-sm">
                  {errors.petrolRate.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Diesel Section */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">Diesel Sales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales (Liters)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("dieselSales", {
                  required: "Diesel sales is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.dieselSales && (
                <span className="text-red-500 text-sm">
                  {errors.dieselSales.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (₹/Liter)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("dieselRate", {
                  required: "Diesel rate is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.dieselRate && (
                <span className="text-red-500 text-sm">
                  {errors.dieselRate.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-3">
            Payments Received
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash Received (₹)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("cash", { required: "Cash amount is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.cash && (
                <span className="text-red-500 text-sm">
                  {errors.cash.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Online Payment (₹)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("onlinePay", {
                  required: "Online payment is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.onlinePay && (
                <span className="text-red-500 text-sm">
                  {errors.onlinePay.message}
                </span>
              )}
            </div>
          </div>
        </div>

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
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 rounded-lg border bg-white shadow-sm"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  {...register(`udhaar.${index}.name`, {
                    required: "Name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Customer Name"
                />
                {errors?.udhaar?.[index]?.name && (
                  <p className="text-red-500 text-sm">
                    {errors.udhaar[index].name?.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  {...register(`udhaar.${index}.date`, {
                    required: "Date is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors?.udhaar?.[index]?.date && (
                  <p className="text-red-500 text-sm">
                    {errors.udhaar[index].date?.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register(`udhaar.${index}.amount`, {
                    required: "Amount is required",
                    valueAsNumber: true,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0.00"
                />
                {errors?.udhaar?.[index]?.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.udhaar[index].amount?.message}
                  </p>
                )}
              </div>

              {/* Remove Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                  }}
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

        {/* Real-time Calculation Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Live Calculation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Sale Amount</div>
              <div className="text-xl font-bold text-blue-600">
                ₹{totalSaleAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Received</div>
              <div className="text-xl font-bold text-green-600">
                ₹{totalReceived.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Profit/Loss</div>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
