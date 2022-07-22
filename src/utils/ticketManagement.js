import { debounce } from 'lodash';

const LOCATION = {
  Headquarter: 'Headquarter',
  VN: 'VN',
  INDIA: 'INDIA',
  USA: 'USA',
};

const debouncedChangeLocation = debounce((callback) => callback(), 500);

export { debouncedChangeLocation };

export default { LOCATION };
