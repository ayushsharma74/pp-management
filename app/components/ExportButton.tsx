'use client'

import React, { useState } from 'react'
import { CSVLink } from 'react-csv'
import { Download, Share2, FileText } from 'lucide-react'

interface Entry {
  _id: string
  petrolSales: number
  petrolRate: number
  dieselSales: number
  dieselRate: number
  cash: number
  onlinePay: number
  totalSaleAmount: number
  totalReceived: number
  profit: number
  date: string
}

interface ExportButtonProps {
  entries: Entry[]
}

const ExportButton: React.FC<ExportButtonProps> = ({ entries }) => {
  const [isExporting, setIsExporting] = useState(false)

  const csvHeaders = [
    { label: 'Date', key: 'date' },
    { label: 'Petrol Sales (L)', key: 'petrolSales' },
    { label: 'Petrol Rate (₹)', key: 'petrolRate' },
    { label: 'Diesel Sales (L)', key: 'dieselSales' },
    { label: 'Diesel Rate (₹)', key: 'dieselRate' },
    { label: 'Cash Received (₹)', key: 'cash' },
    { label: 'Online Payment (₹)', key: 'onlinePay' },
    { label: 'Total Sale Amount (₹)', key: 'totalSaleAmount' },
    { label: 'Total Received (₹)', key: 'totalReceived' },
    { label: 'Profit/Loss (₹)', key: 'profit' },
  ]

  const csvData = entries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-IN'),
    petrolSales: entry.petrolSales,
    petrolRate: entry.petrolRate,
    dieselSales: entry.dieselSales,
    dieselRate: entry.dieselRate,
    cash: entry.cash,
    onlinePay: entry.onlinePay,
    totalSaleAmount: entry.totalSaleAmount.toFixed(2),
    totalReceived: entry.totalReceived.toFixed(2),
    profit: entry.profit.toFixed(2),
  }))

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => setIsExporting(false), 1000)
  }

  const handleWhatsAppShare = () => {
    const message = `Fuel Station Report - ${new Date().toLocaleDateString('en-IN')}
    
Total Entries: ${entries.length}
Total Profit: ₹${entries.reduce((sum, entry) => sum + entry.profit, 0).toFixed(2)}

Download detailed report: [CSV file will be shared]`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  if (entries.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <FileText className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-600">No entries to export</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <FileText className="text-green-600" size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Export & Share</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={`fuel-report-${new Date().toISOString().split('T')[0]}.csv`}
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
              Export to CSV
            </>
          )}
        </CSVLink>

        <button
          onClick={handleWhatsAppShare}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          <Share2 size={20} />
          Share on WhatsApp
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Total Entries:</strong> {entries.length} | 
          <strong className="ml-2">Total Profit:</strong> 
          <span className={`ml-1 font-semibold ${
            entries.reduce((sum, entry) => sum + entry.profit, 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ₹{entries.reduce((sum, entry) => sum + entry.profit, 0).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  )
}

export default ExportButton