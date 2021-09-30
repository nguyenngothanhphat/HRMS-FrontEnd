import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getListTicket,
  aprovalCompoffRequest,
  aprovalLeaveRequest,
  rejectLeaveRequest,
  rejectCompoffRequest,
} from '../services/dashboard';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';

const dashboard = {
  namespace: 'dashboard',
  state: {
    listTicket: [],
    isLoadData: false,
    totalTicket: 0,
  },
  effects: {
    *fetchListTicket({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const {
          statusCode,
          data: { compoffRequest = [], leaveRequest = [] },
          total = 0,
        } = response;
        if (statusCode !== 200) throw response;
        const listTicket = [];
        compoffRequest.forEach((item) =>
          listTicket.push({ typeTicket: 'compoffRequest', ...item }),
        );
        leaveRequest.forEach((item) => listTicket.push({ typeTicket: 'leaveRequest', ...item }));

        yield put({ type: 'save', payload: { listTicket, isLoadData: false, totalTicket: total } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *approvalTicket({ payload: { typeTicket = '', _id, comment } = {} }, { call, put }) {
      try {
        let response;
        switch (typeTicket) {
          case 'compoffRequest':
            response = yield call(aprovalCompoffRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          case 'leaveRequest':
            response = yield call(aprovalLeaveRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          default:
            break;
        }
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Approval ticket successfully',
        });
        yield put({ type: 'save', payload: { isLoadData: true } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *rejectTicket({ payload: { typeTicket = '', _id, comment } = {} }, { call, put }) {
      try {
        let response;
        switch (typeTicket) {
          case 'compoffRequest':
            response = yield call(rejectCompoffRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          case 'leaveRequest':
            response = yield call(rejectLeaveRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          default:
            break;
        }
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Reject ticket successfully',
        });
        yield put({ type: 'save', payload: { isLoadData: true } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
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
export default dashboard;
