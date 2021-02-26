import { dialog } from '@/utils/utils';
import {getListTimeOff, getListEmployees} from '../services/timeOffManagement';

const timeOffManagement = {
  namespace: 'timeOffManagement',
  state: {
    listTimeOff: [],
    listEmployee: [],
  },
  effects: {
    *fetchEmployeeList( {payload = {}}, {call, put}) {
      try {
        const response = yield call(getListEmployees, payload);
        const {statusCode, data = []} = response;
        const listEmployee = data.map((item = {}) => {
          const {_id, generalInfo: { firstName = '', lastName = ''} = {} } = item;
          return {
            _id,
            name: firstName + lastName,
          };
        });
        if(statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listEmployee } })
      } catch (error) {
        dialog(error)
      }
    },
    *fetchListTimeOff({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTimeOff, payload);
        const { statusCode, data: listTimeOff = [] } = response;
        // const listTimeOff = data.map((item = {}) => {
        //   const {_id, employee: { employeeId = '', firstName = '', lastName = '', country: { nativeName = '' } ={}, cc = [], fromDate = '', toDate = '', type = '', updated = '', description = '', duration = '', employee = {} } = {}, } = item;
        //   return {
        //     _id,
        //     employeeId,
        //     name: firstName + lastName,
        //     nativeName,
        //     cc,
        //     fromDate,
        //     toDate,
        //     type,
        //     updated,
        //     description,
        //     duration,
        //     employee
        //   }
        // })
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTimeOff },
        });
        // console.log('data', listTimeOff)
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default timeOffManagement;
