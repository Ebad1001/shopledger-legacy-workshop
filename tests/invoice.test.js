'use strict';

var assert = require('node:assert/strict');
var test = require('node:test');

var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

test('invoice GST matches the order HSN slab', function () {
  var items = [{ id: 1, name: 'Rice', hsn: '1006', price: 100, qty: 1 }];
  var order = { items: items, coupon: '' };

  var billed = pricing.computeTotals(items, '');
  var printed = invoice.computeInvoiceFigures(order);

  assert.equal(billed.tax, 5);
  assert.equal(billed.total, 105);
  assert.equal(printed.rows[0].gstPercent, 5);
  assert.equal(printed.tax, billed.tax);
  assert.equal(printed.total, billed.total);
});

test('invoice coupon discount and GST match the order calculation', function () {
  var items = [{ id: 1, name: 'Rice', hsn: '1006', price: 2000, qty: 1 }];
  var order = { items: items, coupon: 'SAVE10' };

  var billed = pricing.computeTotals(items, 'SAVE10');
  var printed = invoice.computeInvoiceFigures(order);

  assert.equal(billed.discount, 150);
  assert.equal(billed.tax, 92.5);
  assert.equal(billed.total, 1942.5);
  assert.equal(printed.tax, billed.tax);
  assert.equal(printed.discount, billed.discount);
  assert.equal(printed.total, billed.total);
});
