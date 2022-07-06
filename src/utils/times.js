import { isEmpty, isObject } from 'lodash';

const moment = require('moment-timezone');
const cityTimezones = require('city-timezones');

export const getTimezoneViaCity = (cityProp = '') => {
  let city = cityProp;
  if (isObject(city)) {
    city = city.name || '';
  }
  // check if city is empty return the current timezone
  if (!city || isEmpty(city)) {
    return '';
  }
  const cityWords = city.split(' ');
  let cityLookup = [];
  cityWords.forEach((c) => {
    const result = cityTimezones.findFromCityStateProvince(c);
    if (result) cityLookup = result;
  });
  if (cityLookup.length === 0) return '';
  if (cityLookup.length > 1) {
    const found = cityLookup.find((c) => c.city === city);
    if (!isEmpty(found)) return found.timezone;
  }
  return cityLookup[0].timezone;
};

export const getCurrentTimeOfTimezone = (currentTime, timezone) => {
  return moment(currentTime).tz(timezone).locale('en').format('LLLL');
};

export const getCurrentTimeOfTimezoneOption = (currentTime, timezone) => {
  return moment(currentTime).tz(timezone).locale('en').format('DD/MM/YYYY | HH:mm A');
};
