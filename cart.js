export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function applyDiscount(amount, percent) {
  return amount - (amount * percent) / 100;
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
