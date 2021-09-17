import { dialog } from '@/utils/utils';
import { searchGlobal, searchEmployee, searchTicket } from '../services/searchAdvance';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';

export default {
  namespace: 'searchAdvance',
  state: {
    keySearch: '',
    isSearch: false,
    result: {
      employees: [],
      employeeDoc: [],
      tickets: [],
    },
    employeeAdvance: {
      status: ['ACTIVE'],
      firstName: '',
      lastName: '',
      middleName: '',
      userId: '',
      phoneNumber: '',
      city: '',
      state: '',
      country: '',
      employeeId: '',
      jobTitle: [],
      department: '',
      skill: [],
      certification: '',
      location: [],
      reportingManager: '',
      classification: [],
    },
  },
  effects: {
    *search({ payload = {} }, { call, put }) {
      try {
        const response = yield call(searchGlobal, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const { employees, employeeDoc, compoffTickets, leaveReqTickets, offBoardingTickets } =
          data;
        const tickets = [];
        compoffTickets.map((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Compoff Request' }),
        );
        leaveReqTickets.map((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Leave Request' }),
        );
        offBoardingTickets.map((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Offboarding Request' }),
        );

        for (let i = tickets.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = tickets[i];
          tickets[i] = tickets[j];
          tickets[j] = temp;
        }
        yield put({
          type: 'save',
          payload: {
            result: {
              employees,
              employeeDoc,
              tickets,
            },
          },
        });
        // handle history search:
      } catch (errors) {
        dialog(errors);
      }
    },
    *searchEmployee({ payload = {} }, { call, put }) {
      try {
        const response = yield call(searchEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const { employees, employeeDoc, compoffTickets, leaveReqTickets, offBoardingTickets } =
          data;
        const tickets = [];
        compoffTickets.map((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Compoff Request' }),
        );
        leaveReqTickets.map((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Leave Request' }),
        );
        offBoardingTickets.map((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Offboarding Request' }),
        );

        for (let i = tickets.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = tickets[i];
          tickets[i] = tickets[j];
          tickets[j] = temp;
        }
        yield put({
          type: 'save',
          payload: {
            result: {
              employees,
              employeeDoc,
              tickets,
            },
          },
        });
        // handle history search:
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
