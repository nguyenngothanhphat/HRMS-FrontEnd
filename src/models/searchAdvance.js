import { dialog } from '@/utils/utils';
import {
  searchGlobal,
  searchEmployee,
  searchTicket,
  searchDocument,
} from '../services/searchAdvance';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';

export default {
  namespace: 'searchAdvance',
  state: {
    keySearch: '',
    isSearch: false,
    isSearchAdvance: false,
    globalSearch: {
      employees: [],
      employeeDoc: [],
      tickets: [],
      totalDocs: 0,
      totalEmployees: 0,
      totalTickets: 0,
    },
    employeeAdvance: {
      status: [],
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
      skill: '',
      certification: '',
      location: [],
      reportingManager: '',
      classification: [],
    },
    ticketAdvance: {
      ticketID: '',
      employeeName: '',
      createdBy: '',
      createdOn: '',
      assignedTo: '',
      ticketType: '',
      status: '',
      resolvedBy: '',
    },
    documentAdvance: {
      documentName: '',
      // documentType,
      documentOwner: '',
      // documentSize,
      createdOn: '',
      modifiedOn: '',
      modifiedBy: '',
    },
    globalSearchAdvance: {
      employees: [],
      employeeDoc: [],
      tickets: [],
      totalDocs: 0,
      totalEmployees: 0,
      totalTickets: 0,
    },
    defaultList: {
      listEmployeeType: [],
      listLocation: [],
      listDepartment: [],
      listTitle: [],
    },
  },
  effects: {
    *searchGlobal({ payload = {} }, { call, put }) {
      try {
        const response = yield call(searchGlobal, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const {
          employees = [],
          employeeDoc = [],
          compoffTickets = [],
          leaveReqTickets = [],
          offBoardingTickets = [],
          onBoardingTickets = [],
          totalDocs = 0,
          totalEmployees = 0,
          totalTickets = 0,
        } = data;
        const tickets = [];
        compoffTickets.forEach((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Compoff Request' }),
        );
        leaveReqTickets.forEach((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Leave Request' }),
        );
        offBoardingTickets.forEach((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Offboarding Request' }),
        );
        onBoardingTickets.forEach((item) =>
          tickets.push({ id: item._id, ticketID: item.ticketID, title: 'Onboarding Ticket' }),
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
            globalSearch: {
              employees,
              employeeDoc,
              tickets,
              totalDocs: totalDocs || employeeDoc.length,
              totalEmployees,
              totalTickets,
            },
            isSearch: false,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *searchGlobalByType({ payload = {} }, { call, put }) {
      try {
        const response = yield call(searchGlobal, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const {
          employees = [],
          employeeDoc = [],
          compoffTickets = [],
          leaveReqTickets = [],
          offBoardingTickets = [],
          onBoardingTickets = [],
          totalDocs = 0,
          totalEmployees = 0,
          totalTickets = 0,
        } = data;
        const tickets = [];
        compoffTickets.forEach((item) =>
          tickets.push({ ...item, id: item._id, title: 'Compoff Request' }),
        );
        leaveReqTickets.forEach((item) =>
          tickets.push({ ...item, id: item._id, title: 'Leave Request' }),
        );
        offBoardingTickets.forEach((item) =>
          tickets.push({ ...item, id: item._id, title: 'Offboarding Request' }),
        );
        onBoardingTickets.forEach((item) =>
          tickets.push({ ...item, id: item._id, title: 'Onboarding Ticket' }),
        );
        yield put({
          type: 'save',
          payload: {
            globalSearchAdvance: {
              employees,
              employeeDoc,
              tickets,
              totalDocs,
              totalEmployees,
              totalTickets,
            },
            isSearch: false,
          },
        });
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
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveSearchAdvance',
          payload: {
            employees: data,
            totalEmployees: total,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *searchTicket({ payload = {} }, { call, put }) {
      try {
        const response = yield call(searchTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveSearchAdvance',
          payload: {
            tickets: data,
            totalTickets: total,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *searchDocument({ payload = {} }, { call, put }) {
      try {
        const response = yield call(searchDocument, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveSearchAdvance',
          payload: {
            employeeDoc: data,
            totalDocs: total,
          },
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
    saveSearchAdvance(state, action) {
      const { globalSearchAdvance } = state;
      return {
        ...state,
        globalSearchAdvance: {
          ...globalSearchAdvance,
          ...action.payload,
        },
      };
    },
    saveDefaultList(state, action) {
      const { defaultList } = state;
      return {
        ...state,
        defaultList: {
          ...defaultList,
          ...action.payload,
        },
      };
    },
  },
};
