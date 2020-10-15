import {
  getDocumentList,
  getDepartmentList,
  getTitleList,
  getLocation,
  getEmployeeTypeList,
  getManagerList,
  addCandidate,
  updateByHR,
  getById,
} from '@/services/addNewMember';
import { history } from 'umi';
import { dialog } from '@/utils/utils';

import { getRookieInfo } from '@/services/formCandidate';

const candidateInfo = {
  namespace: 'candidateInfo',
  state: {
    rookieId: '',
    checkMandatory: {
      filledBasicInformation: false,
      filledJobDetail: false,
      filledCustomField: false,
      salaryStatus: 2,
    },
    currentStep: 1,
    tempData: {
      checkStatus: {},
    },
    data: {
      fullName: null,
      privateEmail: null,
      workEmail: null,
      workLocation: null,
      position: 'EMPLOYEE',
      employeeType: null,
      department: null,
      title: null,
      company: null,
      processStatus: 'DRAFT',
      noticePeriod: null,
      dateOfJoining: null,
      reportingManager: null,
      compensationType: null,
      amountIn: null,
      timeOffPolicy: null,
      documentChecklistSetting: [
        {
          type: 'A',
          name: 'Identity Proof',
          data: [
            {
              key: 'aadharCard',
              alias: 'Aadhar Card',
              value: true,
            },
            {
              key: 'panCard',
              alias: 'PAN Card',
              value: true,
            },
            {
              key: 'passport',
              alias: 'Passport',
              value: false,
            },
            {
              key: 'drivingLicence',
              alias: 'Driving Licence',
              value: false,
            },
            {
              key: 'voterCard',
              alias: 'Voter Card',
              value: false,
            },
          ],
        },
        {
          type: 'B',
          name: 'Address Proof',
          data: [
            {
              key: 'rentalAgreement',
              alias: 'Rental Agreement',
              value: false,
            },
            {
              key: 'electricityUtilityBills',
              alias: 'Electricity & Utility Bills',
              value: false,
            },
            {
              key: 'telephoneBills',
              alias: 'Telephone Bills',
              value: false,
            },
          ],
        },
        {
          type: 'C',
          name: 'Educational',
          data: [
            {
              key: 'sslc',
              alias: 'SSLC',
              value: true,
            },
            {
              key: 'intermediateDiploma',
              alias: 'Intermedidate/Diploma',
              value: true,
            },
            {
              key: 'graduation',
              alias: 'Graduation',
              value: true,
            },
            {
              key: 'postGraduate',
              alias: 'Post Graduate',
              value: false,
            },
            {
              key: 'phdDoctorate',
              alias: 'PHD/Doctorate',
              value: false,
            },
          ],
        },
        {
          type: 'D',
          name: 'Technical Certifications',
          data: [
            {
              key: 'offerLetter',
              alias: 'Offer letter',
              value: false,
            },
            {
              key: 'appraisalLetter',
              alias: 'Appraisal letter',
              value: false,
            },
            {
              key: 'paysTubs',
              alias: 'Paystubs',
              value: false,
            },
            {
              key: 'form16',
              alias: 'Form 16',
              value: false,
            },
            {
              key: 'relievingLetter',
              alias: 'Relieving Letter',
              value: false,
            },
          ],
        },
      ],
      candidateSignature: null,
      hrManagerSignature: null,
      hrSignature: null,
      hiringAgreements: null,
      companyHandbook: null,
      benefits: [],
      comments: null,
      status: '',
      _id: '',
      ticketID: '',
      generatedBy: '',
      createdAt: '',
      updatedAt: '',
    },
  },
  effects: {
    *fetchDocumentList(_, { call, put }) {
      try {
        const response = yield call(getDocumentList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveEligibilityRequirement',
          payload: { testEligibility: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchDepartmentList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getDepartmentList, { company });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            departmentList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchTitleList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getTitleList, { company });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { titleList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchLocationList(_, { call, put }) {
      try {
        const response = yield call(getLocation);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchEmployeeTypeList(_, { call, put }) {
      try {
        const response = yield call(getEmployeeTypeList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeTypeList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchManagerList({ payload = {} }, { call, put }) {
      console.log(payload);
      try {
        const response = yield call(getManagerList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { managerList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *addCandidateByHR({ payload }, { call, put }) {
      console.log('payload model', payload);
      try {
        const response = yield call(addCandidate, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { Obj: data } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *updateByHR({ payload }, { call, put }) {
      console.log('payload model', payload);
      try {
        const response = yield call(updateByHR, payload);
        const { statusCode, data } = response;
        console.log('update', data);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchCandidateInfo({ payload }, { call, put }) {
      try {
        console.log('abc');
        const response = yield call(getRookieInfo);
        const { data, statusCode } = response;
        const { ticketID = '', _id } = data;
        if (statusCode !== 200) throw response;
        const rookieId = ticketID;
        yield put({ type: 'save', payload: { rookieId, data: { ...data, _id } } });
        history.push(`/employee-onboarding/review/${rookieId}`);
      } catch (error) {
        dialog(error);
      }
    },

    *fetchEmployeeById({ payload }, { call, put }) {
      console.log('payload model', payload);
      try {
        const response = yield call(getById, payload);
        const { data, statusCode } = response;
        console.log('abc', data);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { data: { ...data, id: payload._id } } });
      } catch (error) {
        dialog(error);
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

export default candidateInfo;
