/**
 * Calculate profit/loss for a fuel station entry
 * @param {Object} data - Entry data
 * @returns {Object} Calculated values
 */
export const calculateProfit = (data: any) => {
  const { petrolSales, petrolRate, dieselSales, dieselRate, cash, onlinePay } =
    data;

  // Calculate total sale amount
  const totalSaleAmount = petrolSales * petrolRate + dieselSales * dieselRate;

  // Calculate total received
  const totalReceived = cash + onlinePay;

  // Calculate profit/loss
  const profit = totalReceived - totalSaleAmount;

  return {
    totalSaleAmount: parseFloat(totalSaleAmount.toFixed(2)),
    totalReceived: parseFloat(totalReceived.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
  };
};
