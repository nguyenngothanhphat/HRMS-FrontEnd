import { dialog } from '@/utils/utils';
import getCandidatesList from '../services/candidatesManagement';

const candidatesManagement = {
  namespace: 'candidatesManagement',
  state: {
    candidatesList: [],
    clearFilter: false,
    filter: [],
    total: '',
    statusList: [
      'DRAFT',
      'SENT-PROVISIONAL-OFFER',
      'PENDING-BACKGROUND-CHECK',
      // 'ELIGIBLE-CANDIDATES-FOR-OFFER',
      'ELIGIBLE-CANDIDATE',
      'INELIGIBLE-CANDIDATE',
      'ACCEPT-PROVISIONAL-OFFER',
      'RENEGOTIATE-PROVISONAL-OFFER',
      'DISCARDED-PROVISONAL-OFFER',
      'RECEIVED-SUBMITTED-DOCUMENTS',
      'PENDING-APPROVAL-FINAL-OFFER',
      'APPROVED-FINAL-OFFER',
      'REJECT-FINAL-OFFER-HR',
      'REJECT-FINAL-OFFER-CANDIDATE',
      'SENT-FINAL-OFFER',
      'ACCEPT-FINAL-OFFER',
      'CLOSE',
    ],
  },
  effects: {
    *fetchCandidatesList(
      { payload: { tenantId = '', processStatus = [], page = '', limit = '' } },
      { call, put },
    ) {
      try {
        const response = yield call(getCandidatesList, { processStatus, tenantId, page, limit });
        const { statusCode, data: candidatesList } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { candidatesList, total: response.total },
        });
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
    saveFilter(state, action) {
      const data = [...state.filter];
      const actionFilter = action.payload;
      const findIndex = data.findIndex((item) => item.actionFilter.name === actionFilter.name);
      if (findIndex < 0) {
        const item = { actionFilter };
        data.push(item);
      } else {
        data[findIndex] = {
          ...data[findIndex],
          checkedList: actionFilter.checkedList,
        };
      }
      return {
        ...state,
        clearFilter: false,
        filter: [...data],
      };
    },
    ClearFilter(state) {
      return {
        ...state,
        clearFilter: true,
        clearName: true,
        filter: [],
      };
    },
  },
};
export default candidatesManagement;
