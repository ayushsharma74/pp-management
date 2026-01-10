"use client";

import React, { useState, useEffect } from "react";
import { Fuel, AlertCircle, Loader2 } from "lucide-react";
import DailyForm from "./components/DailyForm";
import EntryCard from "./components/EntryCard";
import ExportButton from "./components/ExportButton";
import { apiService } from "./services/api";
import { redirect } from "next/navigation";

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

  dipPetrolMorning?: string;
  dipPetrolEvening?: string;
  petrolStockMorning?: string;
  petrolStockEvening?: string;

  dipDieselMorning?: string;
  dipDieselEvening?: string;
  dieselStockMorning?: string;
  dieselStockEvening?: string;
  cash: number;
  onlinePay: number;
  otherPayment: number;
  totalSaleAmount: number;
  totalReceived: number;
  profit: number;
  date: string;
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [udhaars, setUdhaars] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function checkAuth() {
    const isAuthenticated = localStorage.getItem("authstat");
    console.log("AUTH", isAuthenticated);

    if (isAuthenticated !== "true") {
      console.log("not auth");
      return redirect("/login");
    }
    fetchEntries();
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEntries();
      const udhaars = await apiService.getUdhaars();
      setUdhaars(udhaars);
      console.log(udhaars);
      console.log("ENTRIES", data);

      setEntries(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (entryData: any) => {
    try {
      setLoading(true);
      await apiService.addEntry(entryData);
      await fetchEntries(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (u: any) => {
    try {
      setLoading(true);
      await apiService.updateUdhaar(u);
      await fetchEntries();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Fuel className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Fuel Station Tracker
              </h1>
              <p className="text-gray-600">
                Track daily sales and calculate profit/loss
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Daily Form */}
        <DailyForm onAddEntry={handleAddEntry} />

        <div className="space-y-2 mb-5">
          <h1 className="font-semibold tracking-tight text-red-700">
            PENDING UDHAAR
          </h1>

          {udhaars.map((u: any, i: number) => {
            if (u.paid === true) {
              return null;
            }

            return (
              <div
                key={i}
                className="flex justify-between items-center bg-white border border-zinc-200 rounded-lg p-2 shadow-sm"
              >
                {/* Name + Date */}
                <div>
                  <div className="text-sm font-semibold">{u.name}</div>
                  {u.phoneNumber && (
                    <span className="text-xs text-gray-500">
                      {u.phoneNumber}
                    </span>
                  )}
                  <div className="text-xs text-zinc-600">
                    {new Date(u.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Amount + Pay Button */}
                <div className="flex items-center gap-3">
                  <div className="font-bold text-yellow-700">₹{u.amount}</div>

                  {/* Pay Button */}
                  <button
                    onClick={() => handlePay(u)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition"
                  >
                    Paid
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Export Section */}
        <div className="mb-8">
          <ExportButton entries={entries} />
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Recent Entries</h2>
            <span className="text-sm text-gray-600">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <span className="ml-2 text-gray-600">Loading entries...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <Fuel className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No entries yet
              </h3>
              <p className="text-gray-600">
                Add your first daily entry to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {entries.map((entry) => (
                <EntryCard
                  key={entry._id}
                  entry={entry}
                  onDelete={fetchEntries}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
