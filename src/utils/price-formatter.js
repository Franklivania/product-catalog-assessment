export function formatNaira(amount, options = {}) {
  if (typeof amount !== "number" || isNaN(amount)) return "";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}
