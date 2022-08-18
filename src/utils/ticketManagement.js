import { debounce } from 'lodash';

const debouncedChangeLocation = debounce((callback) => callback(), 400);

export { debouncedChangeLocation };

export default { debouncedChangeLocation };
