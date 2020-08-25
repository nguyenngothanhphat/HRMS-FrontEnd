import router from 'umi/router';
import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  query,
  queryBillById,
  submitBill,
  queryDeleteBill,
  fetchSummaryApi,
  fetchSummaryByTag,
  fetchSummaryByProject,
  queryDeleteExpense,
  queryUpdateExpense,
} from '@/services/bill';
import { dialog } from '@/utils/utils';
// import moment from 'moment';

function processFilter(filterValues) {
  let filter = {};
  const keys = Object.keys(filterValues);

  keys.forEach(key => {
    const val = filterValues[key];
    if (!val) return;
    if (['group', 'type'].includes(key)) {
      filter = { ...filter, [key]: val };
    } else {
      filter = { ...filter, [key]: val };
    }
  });
  return filter;
}

export default {
  namespace: 'bill',

  state: {
    list: [],
    selectedList: [],
    tempBillList: [],
    item: {},
    filter: {
      limit: 10,
      page: 1,
    },
    summary: {},
    filterTab: 'unreported',
    listAll: [],
    // filterYear: moment().year(),
  },

  effects: {
    *fetch(_, { put, call }) {
      try {
        const response = yield call(query);
        const { statusCode, data: list, total } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list, total } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchActiveBills({ payload: { extraBills = [], options = {} } = {} }, { put, call, select }) {
      let { selectedList } = yield select(state => state.bill);
      let list = [];
      let total;
      if (Array.isArray(extraBills) && extraBills.length > 0) {
        selectedList = extraBills;
      }
      const filter = processFilter(options);
      try {
        const response = yield call(query, {
          status: ['ACTIVE'],
          extraBills: selectedList,
          ...filter,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        list = data;
        list = list.sort(bill => (selectedList.indexOf(bill._id) > -1 ? -1 : 1));
        total = response.total || list.length;
      } catch (errors) {
        dialog(errors);
      }
      yield put({
        type: 'save',
        payload: {
          list,
          // filter: options,
          total,
        },
      });
      yield put({ type: 'saveSelectedList', payload: { selectedList } });
      return list;
    },
    *fetchSummary({ payload }, { call, put }) {
      try {
        const response = yield call(fetchSummaryApi, {
          status: ['ACTIVE'],
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { summary: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchItem({ payload = 'add' }, { call, put }) {
      let item = {};
      try {
        if (payload !== 'add') {
          const response = yield call(queryBillById, { expenseID: payload });
          const { statusCode, data } = response;
          if (statusCode !== 200) throw response;
          item = data;
        }
      } catch (errors) {
        dialog(errors);
        yield call(router.push, '/expense');
      } finally {
        yield put({
          type: 'save',
          payload: { item },
        });
      }
    },
    *fetchMileageRate(_, { call, put, select }) {
      const {
        currentUser: { mileageRate },
      } = yield select(state => state.user);
      if (!mileageRate) {
        notification.error({
          message: formatMessage({ id: 'user.not.found.mileage.rate' }),
        });
        yield call(router.push, '/profile');
      } else
        yield put({
          type: 'save',
          payload: { mileageRate },
        });
    },
    *submit(
      {
        payload: { formData, saveAndNew, checkData },
      },
      { call }
    ) {
      try {
        const response = yield call(submitBill, formData);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'bill.submit.success' }),
        });
        const expense = saveAndNew ? `/expense/newexpense` : `/expense`;
        const mileage = saveAndNew ? `/expense/newmileage` : `/expense`;

        yield call(router.push, checkData ? expense : mileage);
      } catch (errors) {
        dialog(errors);
      }
    },
    *deleteBill({ payload }, { put, call }) {
      try {
        const response = yield call(queryDeleteBill, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'bill.remove.success' }),
        });
        yield put({ type: 'fetchActiveBills' });
        yield put({ type: 'fetchSummary' });
        yield put({ type: 'save', payload: { selectedList: [], tempBillList: [] } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchSummaryByTag({ payload }, { call, put }) {
      try {
        const response = yield call(fetchSummaryByTag, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { summaryByTag: response },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchSummaryByProject({ payload }, { call, put }) {
      try {
        const response = yield call(fetchSummaryByProject, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { summaryByProject: response },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *deleteExpense({ payload }, { call }) {
      try {
        const response = yield call(queryDeleteExpense, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'bill.remove.success' }),
        });
        yield call(router.push, `/expense`);
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateExpense(
      {
        payload: { newData: formData },
      },
      { call }
    ) {
      try {
        const response = yield call(queryUpdateExpense, formData);
        const { statusCode, data: { report = {} } = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'bill.submit.success' }),
        });
        if (report && report._id) {
          yield call(router.push, `/report/view/${report._id}`);
        } else {
          yield call(router.push, `/expense`);
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchActiveReim({ payload }, { put, call }) {
      try {
        const response = yield call(query, payload);
        const { statusCode, data: list, total } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list, total } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListAllActive(_, { put, call }) {
      try {
        const response = yield call(query, {
          status: ['ACTIVE'],
        });
        const { statusCode, data: list } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listAll: list } });
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
    saveSelectedList(state, action) {
      const {
        payload: { selectedList },
      } = action;
      const { list = [] } = state;
      let totalAmount = 0;
      list
        .filter(b => selectedList.includes(b._id))
        .forEach(b => {
          totalAmount += b.amount;
        });
      return {
        ...state,
        selectedList,
        tempBillList: selectedList,
        totalAmount,
      };
    },
  },
};
