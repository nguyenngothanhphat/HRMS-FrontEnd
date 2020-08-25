import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import { notification } from 'antd';
import {
  fetch,
  review,
  getById,
  removeItem,
  saveRequest,
  reviewMultiple,
  fetchSummaryApi,
  fetchRecentReport,
  fetchTeamReport,
  fetchTeamReportByUser,
  fetchTeamReportByOther,
  fetchTeamReportComplete,
  fetchSummaryApproval,
  addReport,
  update,
  comment,
  approvalData,
  fetchTeamReportAllReport,
  fetchPaymentHistoryList,
} from '@/services/reimbursement';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'reimbursement',

  state: {
    list: {
      request: [],
      approval: [],
      pending: [],
    },
    selectedList: {
      approval: [],
      request: [],
      pending: [],
    },
    item: false,
    approvalData: false,
    paymentHistory: [],
    selectedReportPaid: {},
  },

  effects: {
    *fetchAll(_, { put }) {
      yield put({ type: 'fetch', payload: { method: 'request' } });
      yield put({ type: 'fetch', payload: { method: 'approval' } });
    },
    *fetch({ payload }, { put, call }) {
      try {
        // const { date } = payload;
        // if (date && date.type === 'range') {
        //   date.to = date.to.add(1, 'day');
        // }
        const response = yield call(fetch, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveList',
          payload: {
            [payload.method]: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchItem({ payload }, { call, put }) {
      // const item = {
      //   amount: 0,
      // };
      try {
        if (payload.reId) {
          const response = yield call(getById, payload);
          const { statusCode, data } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { item: data },
          });
        }
      } catch (errors) {
        dialog(errors);
        yield call(router.push, '/teamreport');
      }
    },
    *saveRequest({ payload }, { call }) {
      try {
        const res = yield call(saveRequest, payload);
        const { statusCode } = res;
        if (statusCode !== 200) throw res;
        notification.success({
          message: formatMessage({ id: 'reimbursement.submit.success' }),
        });
        yield call(router.push, '/report');
      } catch (errors) {
        dialog(errors);
      }
    },
    *review({ payload }, { call }) {
      const { action } = payload;
      try {
        const reivewResponse = yield call(review, payload);
        const { statusCode } = reivewResponse;
        if (statusCode !== 200) throw reivewResponse;
        const messages = {
          need_more_info: formatMessage({ id: 'reimbursement.comment.success' }),
          default: formatMessage({ id: 'reimbursement.review.success' }),
        };
        const message = messages[action] || messages.default;
        notification.success({ message });
        yield call(router.push, '/teamreport');
        return true;
      } catch (errors) {
        dialog(errors);
        return false;
      }
    },
    *reviewMultiple({ payload }, { call }) {
      const { action } = payload;
      try {
        const reivewResponse = yield call(reviewMultiple, payload);
        const { statusCode } = reivewResponse;
        if (statusCode !== 200) throw reivewResponse;
        const messages = {
          need_more_info: formatMessage({ id: 'reimbursement.comment.success' }),
          default: formatMessage({ id: 'reimbursement.review.success' }),
        };
        const message = messages[action] || messages.default;
        notification.success({ message });
        yield call(router.push, '/report/approval');
        return true;
      } catch (errors) {
        dialog(errors);
        return false;
      }
    },
    *removeItem(
      {
        payload: { reId },
      },
      { call }
    ) {
      try {
        const removeItemResponse = yield call(removeItem, { reId });
        const { statusCode } = removeItemResponse;
        if (statusCode !== 200) throw removeItemResponse;
        notification.success({
          message: formatMessage({ id: 'reimbursement.remove.success' }),
        });
        yield call(router.push, '/report/request');
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchSummary({ payload }, { call, put }) {
      try {
        const response = yield call(fetchSummaryApi, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { summaryReport: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchRecentReport({ payload }, { call, put }) {
      try {
        const response = yield call(fetchRecentReport, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { recentReport: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchPaymentHistory({ payload }, { call, put }) {
      try {
        const response = yield call(fetchPaymentHistoryList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { paymentHistory: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *filterRecentReport({ payload }, { call, put }) {
      try {
        const response = yield call(fetchRecentReport, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { recentReport: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchTeamReport({ payload }, { call, put }) {
      try {
        const response = yield call(fetchTeamReport, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamReport: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchTeamReportByUser({ payload }, { call, put }) {
      try {
        const response = yield call(fetchTeamReportByUser, payload);
        const { statusCode, data, sum, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamReport: data, teamReportSum: sum, teamReportTotal: total },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchTeamReportByOther({ payload }, { call, put }) {
      try {
        const response = yield call(fetchTeamReportByOther, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamReport: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTeamReportComplete({ payload }, { call, put }) {
      try {
        const response = yield call(fetchTeamReportComplete, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamReport: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTeamReportAllReport({ payload }, { call, put }) {
      try {
        const response = yield call(fetchTeamReportAllReport, payload);
        const { statusCode, data, sum, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamReport: data, teamReportSum: sum, teamReportTotal: total },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *addReport({ payload }, { call }) {
      try {
        const response = yield call(addReport, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
        yield call(router.push, '/report');
      } catch (errors) {
        dialog(errors);
      }
    },
    *teamReportApprove({ payload }, { call }) {
      const { action } = payload;
      try {
        const reivewResponse = yield call(reviewMultiple, payload);
        const { statusCode, data } = reivewResponse;
        if (statusCode !== 200) throw reivewResponse;
        const messages = {
          need_more_info: formatMessage({ id: 'reimbursement.comment.success' }),
          default: formatMessage({ id: 'reimbursement.review.success' }),
        };
        const message = messages[action] || messages.default;
        data.forEach(item => {
          const { status = '' } = item;
          if (status === 'FAIL') {
            const {
              error: {
                errors: { review: { message: err_message = '', reportCode = '' } = {} } = {},
              } = {},
            } = item;
            notification.error({
              message: err_message,
              description: `Report Number: ${reportCode}`,
            });
          } else {
            const { reportCode } = item;
            notification.success({ message, description: `Report Number: ${reportCode}` });
          }
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchSummaryApproval({ payload }, { call, put }) {
      try {
        const response = yield call(fetchSummaryApproval, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { summaryTeamReport: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removeReport({ payload }, { call }) {
      try {
        const response = yield call(removeItem, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'reimbursement.remove.success' }),
        });
        yield call(router.push, '/report');
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateReport({ payload }, { call }) {
      try {
        const response = yield call(update, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
        yield call(router.push, '/report');
        return true;
      } catch (errors) {
        dialog(errors);
        return false;
      }
    },
    *comment({ payload }, { call }) {
      try {
        const response = yield call(comment, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
    },
    *approvalData(_, { call, put }) {
      try {
        const response = yield call(approvalData);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { approvalData: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *paymentData({ payload }, { put }) {
      try {
        if (Object.keys(payload).length > 0) {
          yield put({
            type: 'save',
            payload: { selectedReportPaid: payload },
          });
        }
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
    saveList(state, action) {
      return {
        ...state,
        list: {
          ...state.list,
          ...action.payload,
        },
      };
    },
    saveSelectedList(state, action) {
      return {
        ...state,
        selectedList: {
          ...state.selectedList,
          ...action.payload,
        },
      };
    },
    selectReimbursement(state, { payload }) {
      return {
        ...state,
        selectedList: {
          ...state.selectedList,
          ...payload,
        },
      };
    },
    removeReimInSelectedList(
      state,
      {
        payload: { reId },
      }
    ) {
      const { selectedList } = state;
      return {
        ...state,
        selectedList: selectedList.filter(b => b.id !== reId),
      };
    },
  },
};
