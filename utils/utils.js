// utils/utils.js
import { supabase } from '../config/supabaseClient';

/**
 * Calculate expected harvest date range based on min and max growth times and start date.
 * @param {string|number} minGrowthTime - Minimum growth time, e.g. "30 days"
 * @param {string|number} maxGrowthTime - Maximum growth time, e.g. "40 days"
 * @param {string|Date} startDate - Planting date in a date string or Date object
 * @returns {string} - Date range string like "Mon May 01 2023 - Wed May 11 2023"
 */
export function calculateHarvestDate(minGrowthTime, maxGrowthTime, startDate) {
  const parseDays = (str) => {
    if (!str) return 0;
    return parseInt(String(str).replace(/\D/g, ''), 10);
  };

  const minDays = parseDays(minGrowthTime);
  const maxDays = parseDays(maxGrowthTime);
  const plantDate = new Date(startDate);

  const minDate = new Date(plantDate);
  minDate.setDate(plantDate.getDate() + minDays);

  const maxDate = new Date(plantDate);
  maxDate.setDate(plantDate.getDate() + maxDays);

  return `${minDate.toDateString()} - ${maxDate.toDateString()}`;
}

/**
 * Deletes all log entries from the 'logs' table in Supabase.
 * Requires 'id' column to be UUID type.
 * @returns {Promise<boolean>} - True if successful, false if error
 */
export async function clearLogs() {
  const { error } = await supabase
    .from('logs')
    .delete()
    .neq('id', '');  // Delete all rows where id is NOT empty string (all UUIDs)

  if (error) {
    console.error('Error clearing logs:', error);
    return false;
  }

  console.log('Logs cleared successfully');
  return true;
}
