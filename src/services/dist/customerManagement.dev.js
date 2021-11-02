"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getCompaniesList;
exports.getCustomerList = getCustomerList;

var _request = require("@/utils/request");

var BASE_URL = 'https://stghrms.paxanimi.ai';

function getCompaniesList(payload) {
  return regeneratorRuntime.async(function getCompaniesList$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _request.request)('/api/companytenant/list-of-user', {
            method: 'POST',
            data: payload
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

;

function getCustomerList(payload) {
  return regeneratorRuntime.async(function getCustomerList$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", (0, _request.request)("".concat(BASE_URL, "/api-customer/customertenant/list"), {
            method: 'POST',
            data: payload
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}