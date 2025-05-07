// utils.js
export const calculateHarvestDate = (timeOfGrowth) => {
  const currentDate = new Date();
  const growthPeriod = timeOfGrowth.split('-');
  const startGrowth = parseInt(growthPeriod[0]);
  const endGrowth = parseInt(growthPeriod[1]);

  const startHarvestDate = new Date(currentDate);
  startHarvestDate.setDate(currentDate.getDate() + startGrowth);

  const endHarvestDate = new Date(currentDate);
  endHarvestDate.setDate(currentDate.getDate() + endGrowth);

  const start = startHarvestDate.toLocaleDateString();
  const end = endHarvestDate.toLocaleDateString();

  return `${start} - ${end}`;
};
