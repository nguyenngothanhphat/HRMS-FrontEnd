import { debounce } from 'lodash';

const LOCATION = {
  Headquarter: 'Headquarter',
  VN: 'VN',
  INDIA: 'INDIA',
  USA: 'USA',
};

export const debouncedChangeLocation = debounce((callback) => {
  callback();
}, 1000);

export default { LOCATION };
