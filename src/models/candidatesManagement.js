import { dialog } from '@/utils/utils';
import getCandidatesList from '../services/candidatesManagement';

const candidatesManagement = {
  namespace: 'candidatesManagement',
  state: {
    candidatesList: [],
  },
  effects: {
    *fetchCandidatesList(_, { call, put }) {
      try {
        const response = yield call(getCandidatesList, {});
        const { statusCode, data: candidatesList } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { candidatesList },
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
  },
};
export default candidatesManagement;
