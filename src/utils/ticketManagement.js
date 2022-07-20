import { debounce } from 'lodash';

const LOCATION = {
  Headquarter: 'Headquarter',
  VN: 'VN',
  INDIA: 'INDIA',
  USA: 'USA',
};

const cancelRequestTypes = {
  listOffAllTicket: 'listOffAllTicket',
};

const debouncedChangeLocation = debounce((callback) => callback(), 500);

export { cancelRequestTypes, debouncedChangeLocation };

export default { LOCATION };
