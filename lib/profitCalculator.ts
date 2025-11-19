/**
 * Calculate profit/loss for a fuel station entry
 * @param {Object} data - Entry data
 * @returns {Object} Calculated values
 */
export const calculateProfit = (data: any) => {
  let {
    petrolSales,
    petrolRate,
    dieselSales,
    dieselRate,
    cash,
    onlinePay,
    otherPayment,
    previousPetrolReading,
    currentPetrolReading,
    previousDieselReading,
    currentDieselReading,
  } = data;

  // Calculate sales from readings if not provided
  if (petrolSales === undefined && previousPetrolReading !== undefined && currentPetrolReading !== undefined) {
    petrolSales = currentPetrolReading - previousPetrolReading;
  }

  if (dieselSales === undefined && previousDieselReading !== undefined && currentDieselReading !== undefined) {
    dieselSales = currentDieselReading - previousDieselReading;
  }

  // Calculate total sale amount
  const totalSaleAmount = petrolSales * petrolRate + dieselSales * dieselRate;

  // Calculate total received
  const totalReceived = (cash || 0) + (onlinePay || 0) + (otherPayment || 0);

  // Calculate profit/loss
  const profit = totalReceived - totalSaleAmount;

  return {
    petrolSales: parseFloat(petrolSales.toFixed(2)),
    dieselSales: parseFloat(dieselSales.toFixed(2)),
    totalSaleAmount: parseFloat(totalSaleAmount.toFixed(2)),
    totalReceived: parseFloat(totalReceived.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
  };
};
