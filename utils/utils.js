// utils/utils.js
export function calculateHarvestDate(timeOfGrowth, plantedDate) {
  if (!timeOfGrowth || !plantedDate) return 'N/A';

  // plantedDate expected format: YYYY-MM-DD
  const planted = new Date(plantedDate);
  if (isNaN(planted)) return 'Invalid planted date';

  // Extract min and max days from "30-60 days"
  const match = timeOfGrowth.match(/(\d+)-(\d+)/);
  if (!match) return 'Invalid growth time';

  const minDays = parseInt(match[1], 10);
  const maxDays = parseInt(match[2], 10);

  // Calculate min and max harvest dates
  const minHarvest = new Date(planted);
  minHarvest.setDate(minHarvest.getDate() + minDays);

  const maxHarvest = new Date(planted);
  maxHarvest.setDate(maxHarvest.getDate() + maxDays);

  // Format as "Month Year"
  const options = { year: 'numeric', month: 'long' };
  const minStr = minHarvest.toLocaleDateString(undefined, options);
  const maxStr = maxHarvest.toLocaleDateString(undefined, options);

  return `${minStr} - ${maxStr}`;
}
