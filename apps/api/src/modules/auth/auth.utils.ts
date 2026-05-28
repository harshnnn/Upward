export const parseDurationToMs = (value: string): number => {
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000
  };

  const match = value.trim().match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) {
    throw new Error(`Invalid duration value: ${value}`);
  }

  const amountText = match[1];
  const unitText = match[2];
  if (!amountText || !unitText) {
    throw new Error(`Invalid duration value: ${value}`);
  }

  const amount = Number(amountText);
  const unit = unitText.toLowerCase() as keyof typeof multipliers;

  return amount * multipliers[unit];
};
