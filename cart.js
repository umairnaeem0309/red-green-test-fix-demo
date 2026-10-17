const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

export function subtotal(items) {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

export function applyDiscount(amount, percent) {
  return roundMoney(amount - (amount * percent) / 100);
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
