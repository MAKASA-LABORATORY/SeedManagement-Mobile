export const calculateHarvestDate = (minGrowthTime, maxGrowthTime, plantingDate) => {
  if (!minGrowthTime || !maxGrowthTime || !plantingDate) {
    return 'Invalid or missing data';
  }

  try {
    // Parse min and max growth times (e.g., "60 days" -> 60)
    const minDays = parseInt(minGrowthTime.replace(' days', ''), 10);
    const maxDays = parseInt(maxGrowthTime.replace(' days', ''), 10);

    if (isNaN(minDays) || isNaN(maxDays)) {
      return 'Invalid growth time data';
    }

    // Parse planting date
    const planted = new Date(plantingDate);
    if (isNaN(planted.getTime())) {
      return 'Invalid planting date';
    }

    // Calculate min and max harvest dates
    const minHarvestDate = new Date(planted);
    minHarvestDate.setDate(planted.getDate() + minDays);
    const maxHarvestDate = new Date(planted);
    maxHarvestDate.setDate(planted.getDate() + maxDays);

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return `${formatDate(minHarvestDate)} to ${formatDate(maxHarvestDate)}`;
  } catch (error) {
    console.error('Error calculating harvest date:', error);
    return 'Error calculating harvest date';
  }
};