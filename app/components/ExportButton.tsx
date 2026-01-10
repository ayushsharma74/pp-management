"use client";

import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Download, Share2, FileText } from "lucide-react";

interface Entry {
  _id: string;
  petrolSales: number;
  petrolRate: number;
  dieselSales: number;
  dieselRate: number;
  cash: number;
  onlinePay: number;
  otherPayment: number;
  totalSaleAmount: number;
  totalReceived: number;
  profit: number;

  dipPetrolMorning?: string;
  dipPetrolEvening?: string;
  petrolStockMorning?: string;
  petrolStockEvening?: string;

  dipDieselMorning?: string;
  dipDieselEvening?: string;
  dieselStockMorning?: string;
  dieselStockEvening?: string;
  date: string;
}

interface ExportButtonProps {
  entries: Entry[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ entries }) => {
  const [isExporting, setIsExporting] = useState(false);

  const csvHeaders = [
    { label: "Date", key: "date" },
    { label: "Petrol Sales (L)", key: "petrolSales" },
    { label: "Petrol Rate (₹)", key: "petrolRate" },
    { label: "Diesel Sales (L)", key: "dieselSales" },
    { label: "Diesel Rate (₹)", key: "dieselRate" },
    { label: "Cash Received (₹)", key: "cash" },
    { label: "Online Payment (₹)", key: "onlinePay" },
    { label: "Total Sale Amount (₹)", key: "totalSaleAmount" },
    { label: "Total Received (₹)", key: "totalReceived" },
    { label: "Profit/Loss (₹)", key: "profit" },
  ];

  const csvData = entries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-IN"),
    petrolSales: entry.petrolSales,
    petrolRate: entry.petrolRate,
    dieselSales: entry.dieselSales,
    dieselRate: entry.dieselRate,
    cash: entry.cash,
    onlinePay: entry.onlinePay,
    totalSaleAmount: entry.totalSaleAmount.toFixed(2),
    totalReceived: entry.totalReceived.toFixed(2),
    profit: entry.profit.toFixed(2),
  }));

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1000);
  };

  const handlePdfExport = async () => {
    // Dynamically import libraries to avoid SSR issues
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    const tableColumn = [
      "Date",
      "P. Sales",
      "P. Rate",
      "D. Sales",
      "D. Rate",
      "Cash",
      "Online",
      "Others",
      "Total Sale",
      "Received",
      "Profit",
    ];

    const tableRows: any[] = [];

    entries.forEach((entry) => {
      const entryData = [
        new Date(entry.date).toLocaleDateString("en-IN"),
        entry.petrolSales,
        entry.petrolRate,
        entry.dieselSales,
        entry.dieselRate,
        entry.cash,
        entry.onlinePay,
        entry.otherPayment,
        entry.totalSaleAmount.toFixed(2),
        entry.totalReceived.toFixed(2),
        entry.profit.toFixed(2),
      ];
      tableRows.push(entryData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 20 }, // Date
        // Adjust other columns if necessary
      },
    });

    doc.setFontSize(18);
    doc.text("Fuel Station Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 20);

    doc.save(`fuel-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleWhatsAppShare = () => {
    const message = `Fuel Station Report - ${new Date().toLocaleDateString(
      "en-IN"
    )}
    
Total Entries: ${entries.length}
Total Profit: ₹${entries
      .reduce((sum, entry) => sum + entry.profit, 0)
      .toFixed(2)}

Download detailed report: [CSV/PDF file will be shared]`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  if (entries.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <FileText className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-600">No entries to export</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <FileText className="text-green-600" size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Export & Share</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={`fuel-report-${new Date().toISOString().split("T")[0]}.csv`}
          onClick={handleExport}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download size={20} />
              CSV
            </>
          )}
        </CSVLink>

        <button
          onClick={handlePdfExport}
          className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          <FileText size={20} />
          PDF
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          <Share2 size={20} />
          WhatsApp
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Total Entries:</strong> {entries.length} |
          <strong className="ml-2">Total Profit:</strong>
          <span
            className={`ml-1 font-semibold ${
              entries.reduce((sum, entry) => sum + entry.profit, 0) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ₹{entries.reduce((sum, entry) => sum + entry.profit, 0).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ExportButton;
