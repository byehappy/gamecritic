export function getTextColor(hex: string): string {
  const numericValue = parseInt(hex.slice(1), 16);
  const r = (numericValue >> 16) & 0xff;
  const g = (numericValue >> 8) & 0xff;
  const b = numericValue & 0xff;
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  
  return `hsl(0, 0%, calc((${brightness} - 0.5) * -10000000%))`;
}
