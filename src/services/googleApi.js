import { request } from '@/utils/request';

const getListHoliday = async () => {
  return request(`/server/apigoogle/en.indian%23holiday%40group.v.calendar.google.com/events`, {
    params: {
      key: 'AIzaSyAF20l8ukEe3i6LF0jRm70c0M47G-5U_hM',
    },
  });
};

export default getListHoliday;
