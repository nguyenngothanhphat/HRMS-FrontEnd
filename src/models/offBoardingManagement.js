import { getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import getListOffBoarding from '../services/offBoardingManagement';

const statusType = {
  inProgress: 'IN-PROGRESS',
  draft: 'DRAFT',
  completed: 'COMPLETED',
  deleted: 'DELETED',
  done: 'DONE',
  onHold: 'ON-HOLD',
  accepted: 'ACCEPTED',
  rejected: 'REJECTED',
};

const options = [
  { value: statusType.accepted, label: 'Approved' },
  { value: statusType.inProgress, label: 'In Progress' },
  { value: statusType.rejected, label: 'Rejected' },
  { value: statusType.draft, label: 'Draft' },
  { value: statusType.onHold, label: 'On-hold' },
  { value: statusType.deleted, label: 'Deleted' },
  { value: statusType.done, label: 'Deleted' },
  { value: statusType.completed, label: 'Deleted' },
];

const offBoardingManagement = {
  namespace: 'offBoardingManagement',
  state: {
    listOffBoarding: [],
  },
  effects: {
    *fetchListOffBoarding({ payload }, { call, put }) {
      try {
        const response = yield call(getListOffBoarding, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        let { data: listOffBoarding = [] } = response;
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        listOffBoarding = listOffBoarding.map((item = {}) => {
          let newStatus = '';

          options.forEach((op) => {
            if (op.value === item.status) {
              newStatus = op.label;
            }
          });
          return { ...item, status: newStatus };
        });

        yield put({
          type: 'save',
          payload: { listOffBoarding },
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
export default offBoardingManagement;
