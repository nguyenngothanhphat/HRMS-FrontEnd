import { debounce } from 'lodash';

const debouncedChangeLocation = debounce((callback) => callback(), 500);

export { debouncedChangeLocation };

export default { debouncedChangeLocation };
