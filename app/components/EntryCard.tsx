"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trash,
} from "lucide-react";
import { apiService } from "../services/api";

interface UdhaarEntry {
  name: string;
  date: string;
  amount: number;
  paid: boolean;
}

interface Entry {
  _id: string;
  name: string;

  petrolSales: number;
  petrolRate: number;
  dieselSales: number;
  dieselRate: number;

  previousPetrolReading: number;
  currentPetrolReading: number;
  previousDieselReading: number;
  currentDieselReading: number;

  cash: number;
  onlinePay: number;
  otherPayment: number;

  totalSaleAmount: number;
  totalReceived: number;
  profit: number;

  udhaar?: UdhaarEntry[];

  date: string;
}

interface EntryCardProps {
  entry: Entry;
  onDelete: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async (_id: string) => {
    try {
      await apiService.deleteEntry(_id);
      onDelete();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const isProfit = entry.profit >= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {formatDate(entry.date)}
              </h3>
              <p className="text-sm text-gray-600">{entry.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                isProfit
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-semibold">
                ₹{Math.abs(entry.profit).toFixed(2)}
              </span>
            </div>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Fuel Sales + Readings */}
            <div className="space-y-3">
              <div
                onClick={() => handleDelete(entry._id)}
                className="font-semibold text-gray-800 bg-red-200 hover:bg-red-300 rounded-lg flex items-center justify-center gap-2 p-2 cursor-pointer"
              >
                <h2>Delete</h2>
                <Trash color="red" />
              </div>

              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign size={18} />
                Fuel Sales
              </h4>

              {/* PETROL */}
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Petrol Sales</div>
                <div className="font-semibold text-orange-700">
                  <h1>Previous Reading : {entry.previousPetrolReading}</h1>
                  <h1>Current Reading : {entry.currentPetrolReading}</h1>
                  {entry.petrolSales}L @ ₹{entry.petrolRate} = ₹
                  {(entry.petrolSales * entry.petrolRate).toFixed(2)}
                </div>
              </div>

              {/* DIESEL */}
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Diesel Sales</div>
                <div className="font-semibold text-green-700">
                  <h1>Previous Reading : {entry.previousDieselReading}</h1>
                  <h1>Current Reading : {entry.currentDieselReading}</h1>
                  {entry.dieselSales}L @ ₹{entry.dieselRate} = ₹
                  {(entry.dieselSales * entry.dieselRate).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Payments, Udhaar, Summary */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">
                Payments & Summary
              </h4>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Cash Received</div>
                <div className="font-semibold text-purple-700">
                  ₹{entry.cash}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Online Payment</div>
                <div className="font-semibold text-blue-700">
                  ₹{entry.onlinePay}
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Other Payment</div>
                <div className="font-semibold text-orange-700">
                  ₹{entry.otherPayment}
                </div>
              </div>

              {/* UDHAAR SECTION */}
              {Array.isArray(entry.udhaar) && entry.udhaar.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                    Udhaar (Credit)
                  </h4>

                  <div className="space-y-2">
                    {entry.udhaar.map((u, i) => (
                      <div
                        key={i}
                        className={`${
                          u.paid ? "bg-green-200" : "bg-red-200"
                        } p-2 rounded-md shadow-sm`}
                      >
                        <span className="font-semibold tracking-tight">
                          {u.paid ? "PAID" : "PENDING"}
                        </span>

                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-800">
                            {u.name}
                          </span>
                          <span className="text-gray-600">
                            {new Date(u.date).toLocaleDateString("en-IN")}
                          </span>
                        </div>

                        <div className="text-yellow-700 font-bold">
                          ₹{Number(u.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUMMARY */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sale:</span>
                  <span className="font-semibold">
                    ₹{entry.totalSaleAmount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Received:</span>
                  <span className="font-semibold">₹{entry.totalReceived}</span>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {isProfit ? "Profit:" : "Loss:"}
                    </span>
                    <span
                      className={`font-bold ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{Math.abs(entry.profit).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryCard;
