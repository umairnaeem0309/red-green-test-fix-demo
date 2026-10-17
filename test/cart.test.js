import test from "node:test";
import assert from "node:assert/strict";
import { subtotal, applyDiscount, formatCurrency } from "../cart.js";

test("adds line items", () => {
  assert.equal(subtotal([{ price: 2.5, quantity: 2 }]), 5);
});

test("keeps cents exact when prices are fractional", () => {
  assert.equal(
    subtotal([
      { price: 0.1, quantity: 1 },
      { price: 0.2, quantity: 1 },
    ]),
    0.3,
  );
});

test("returns a discount rounded to cents", () => {
  assert.equal(applyDiscount(19.99, 15), 16.99);
});

test("formats currency with two decimals", () => {
  assert.equal(formatCurrency(0.3), "$0.30");
});
