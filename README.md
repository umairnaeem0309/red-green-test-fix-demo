# Red → Green: a money-precision bug, reproduced and fixed

A small, complete example of the work I do: take a failing test, find the real cause,
fix the cause (not the assertion), and prove it with output you can read.

## The symptom

```
✖ keeps cents exact when prices are fractional
✖ returns a discount rounded to cents
# pass 2
# fail 2
```

A cart containing $0.10 and $0.20 totals `0.30000000000000004`, and a 15% discount on
$19.99 returns `16.9915` instead of `16.99`.

## The cause

IEEE-754 binary floating point cannot represent `0.1`, `0.2`, or `0.15` exactly.
Every `+` and `*` on those values accumulates a tiny error, and the error reaches the
caller because nothing rounds to the currency's minor unit.

This is not a broken test. Weakening the assertion (`toBeCloseTo`) would hide a real
one-cent bug that eventually hits an invoice or a payment API.

## The fix

```js
const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

export function subtotal(items) {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

export function applyDiscount(amount, percent) {
  return roundMoney(amount - (amount * percent) / 100);
}
```

`Number.EPSILON` is added before rounding so values that sit a hair *below* a half-cent
boundary (for example `1.005`) still round the way a customer expects.

## The result

```
ok 1 - adds line items
ok 2 - keeps cents exact when prices are fractional
ok 3 - returns a discount rounded to cents
ok 4 - formats currency with two decimals
# pass 4
# fail 0
```

## Commit map

| Commit | What it shows |
|---|---|
| `add cart tests (two failing on float precision)` | the red state, with the real failure output |
| `round money to cents so float drift cannot leak into totals` | the minimal fix, tests green |

## Run it

Requires Node 18+ (no dependencies).

```bash
npm test
```

To see the failure yourself:

```bash
git checkout $(git rev-list --max-parents=0 HEAD) && npm test   # 2 failing
git checkout main && npm test                                  # 4 passing
```

`HEAD~1` is the *fix* commit, so it already passes; the red state is the root commit.
