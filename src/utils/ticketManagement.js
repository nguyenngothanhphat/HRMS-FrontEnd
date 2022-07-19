import { debounce } from 'lodash';

export const debouncedChangeLocation = debounce((callback) => {
  callback();
}, 1000);

export default { debouncedChangeLocation };
