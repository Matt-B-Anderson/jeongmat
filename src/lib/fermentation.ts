export interface FermentationResult {
  daysToTaste: number;
  moveFridgeDate: Date;
  readyDate: Date;
  stage: string;
  description: string;
}

/**
 * Calculate fermentation timeline based on temperature.
 *
 * Base fermentation at 18°C is ~5 days to room-temp finish.
 * For every 2°C above 18°C, reduce by ~0.5 days.
 * For every 2°C below 18°C, add ~0.75 days.
 * Temperature range: 10°C to 30°C.
 *
 * After reaching sour point at room temp, move to fridge.
 * Kimchi is "ready" (well-fermented) ~7 days after going in fridge.
 */
export function calculateFermentation(
  startDate: Date,
  ambientTempC: number,
  fridgeDate?: Date
): FermentationResult {
  // Clamp temperature to valid range
  const temp = Math.max(10, Math.min(30, ambientTempC));

  // Calculate days to first taste (room temp fermentation)
  const BASE_DAYS = 5;
  const BASE_TEMP = 18;
  const TEMP_DIFF = temp - BASE_TEMP;

  let daysToTaste: number;
  if (TEMP_DIFF >= 0) {
    // Warmer: faster fermentation
    daysToTaste = BASE_DAYS - (TEMP_DIFF / 2) * 0.5;
  } else {
    // Cooler: slower fermentation
    daysToTaste = BASE_DAYS + (Math.abs(TEMP_DIFF) / 2) * 0.75;
  }

  // Minimum 1 day, round to half days
  daysToTaste = Math.max(1, Math.round(daysToTaste * 2) / 2);

  // Move to fridge after room temp fermentation is done
  const calculatedFridgeDate = fridgeDate ?? addDays(startDate, daysToTaste);

  // Ready to eat well-fermented: ~7 days after fridge (fridge slows but continues)
  const readyDate = addDays(calculatedFridgeDate, 7);

  // Determine current stage description
  const stage = getStageDescription(temp, daysToTaste);

  return {
    daysToTaste,
    moveFridgeDate: calculatedFridgeDate,
    readyDate,
    stage,
    description: getDetailedDescription(temp, daysToTaste),
  };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + Math.ceil(days));
  return result;
}

function getStageDescription(tempC: number, days: number): string {
  if (tempC >= 25) return "Fast Fermentation";
  if (tempC >= 20) return "Active Fermentation";
  if (tempC >= 16) return "Standard Fermentation";
  if (tempC >= 12) return "Slow Fermentation";
  return "Very Slow Fermentation";
}

function getDetailedDescription(tempC: number, days: number): string {
  if (tempC >= 25) {
    return `At ${tempC}°C, fermentation is fast. Check after ${days} days — the kimchi may turn sour quickly. Watch closely to avoid over-fermentation.`;
  }
  if (tempC >= 20) {
    return `At ${tempC}°C, fermentation is active. Expect tangy, well-developed flavour in ${days} days. A classic room-temperature ferment.`;
  }
  if (tempC >= 16) {
    return `At ${tempC}°C, this is a standard ferment. Allow ${days} days for the flavours to develop slowly and evenly.`;
  }
  if (tempC >= 12) {
    return `At ${tempC}°C, fermentation is slow and complex. The longer time (${days} days) develops deeper, more nuanced flavours.`;
  }
  return `At ${tempC}°C, fermentation is very slow. Allow up to ${days} days. The cold environment creates a very mild, gradually sour kimchi.`;
}

export interface TimelineStage {
  label: string;
  date: Date;
  description: string;
  icon: string;
}

export function getTimelineStages(
  startDate: Date,
  result: FermentationResult
): TimelineStage[] {
  return [
    {
      label: "Batch Started",
      date: startDate,
      description: "Salting, rinsing, and mixing complete. Kimchi is packed.",
      icon: "🥬",
    },
    {
      label: "First Taste",
      date: addDays(startDate, result.daysToTaste),
      description:
        "Taste for sourness. Look for gentle fizz and tangy flavour.",
      icon: "👅",
    },
    {
      label: "Move to Fridge",
      date: result.moveFridgeDate,
      description:
        "Kimchi reaches desired sourness. Transfer to fridge to slow fermentation.",
      icon: "❄️",
    },
    {
      label: "Well Fermented",
      date: result.readyDate,
      description:
        "Deep, complex flavour develops in the cold. Ideal for cooking.",
      icon: "✨",
    },
  ];
}
