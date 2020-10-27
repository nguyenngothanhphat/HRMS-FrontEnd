import {
  getDocumentList,
  getDepartmentList,
  getTitleList,
  getLocation,
  getEmployeeTypeList,
  getManagerList,
  getTableDataByTitle,
  getTitleListByCompany,
  addCandidate,
  closeCandidate,
  updateByHR,
  getById,
  submitPhase1,
} from '@/services/addNewMember';
import { history } from 'umi';
import { dialog } from '@/utils/utils';

import { getRookieInfo, sentForApproval, approveFinalOffer } from '@/services/formCandidate';

const candidateInfo = {
  namespace: 'candidateInfo',
  state: {
    rookieId: '',
    checkMandatory: {
      filledBasicInformation: false,
      filledJobDetail: false,
      filledCustomField: false,
      filledOfferDetail: false,
      filledSalaryStructure: true,
      salaryStatus: 2,
    },
    currentStep: 0,
    statusCodeToValidate: null,
    tempData: {
      checkStatus: {},
      position: 'EMPLOYEE',
      employeeType: '5f50c2541513a742582206f9',
      previousExperience: null,
      candidatesNoticePeriod: '',
      prefferedDateOfJoining: '',
      employeeTypeList: [],
      locationList: [],
      departmentList: [],
      titleList: [],
      managerList: [],
      joineeEmail: '',
      employer: '',
      // Offer details
      template: 'Template.docx',
      includeOffer: false,
      compensationType: '',
      amountIn: '',
      timeOffPolicy: '',
      hiringAgreements: true,
      companyHandbook: true,
      documentList: [],
      isSentEmail: false,
      isMarkAsDone: true,
      generateLink: '',
      newArrToAdjust: [],
      email: '',
      identityProof: {
        aadharCard: true,
        PAN: true,
        passport: false,
        drivingLicense: false,
        voterCard: false,
        listSelected: [],
        isChecked: false,
      },
      addressProof: {
        rentalAgreement: false,
        electricityBill: false,
        telephoneBill: false,
        listSelected: [],
        isChecked: false,
      },
      educational: {
        sslc: true,
        diploma: true,
        graduation: true,
        postGraduate: false,
        phd: false,
        listSelected: [],
        isChecked: false,
      },
      technicalCertification: {
        poe: {
          offerLetter: false,
          appraisalLetter: false,
          paystubs: false,
          form16: false,
          relievingLetter: false,
          listSelected: [],
          isChecked: false,
        },
      },

      candidateSignature: null,
      hrSignature: {},
      hrManagerSignature: {},
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
      joineeEmail: '',
      previousExperience: null,
      processStatus: 'DRAFT',
      noticePeriod: null,
      dateOfJoining: null,
      reportingManager: null,
      compensationType: null,
      amountIn: null,
      timeOffPolicy: null,
      id: '',
      candidate: '',
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
      listTitle: [],
      tableData: [],
      candidateSignature: null,
      hrManagerSignature: {},
      hrSignature: {},
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
          type: 'saveTemp',
          payload: { documentList: data },
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
          type: 'saveTemp',
          payload: { departmentList: data },
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
        yield put({
          type: 'saveTemp',
          payload: { titleList: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocationList(_, { call, put }) {
      try {
        const response = yield call(getLocation);
        const { statusCode, data: locationList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveTemp',
          payload: { locationList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchEmployeeTypeList(_, { call, put }) {
      try {
        const response = yield call(getEmployeeTypeList);
        const { statusCode, data: employeeTypeList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveTemp',
          payload: { employeeTypeList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchManagerList({ payload = {} }, { call, put }) {
      // console.log(payload);
      try {
        const response = yield call(getManagerList, payload);
        const { statusCode, data } = response;
        // console.log('data resp', data);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveTemp',
          payload: { managerList: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *addCandidateByHR({ payload }, { call, put }) {
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
      try {
        const response = yield call(updateByHR, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { ...data } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchCandidateInfo(_, { call, put }) {
      let response = {};
      try {
        response = yield call(getRookieInfo);
        const { data, statusCode } = response;
        const { ticketID = '', _id } = data;
        if (statusCode !== 200) throw response;
        const rookieId = ticketID;
        yield put({ type: 'save', payload: { currentStep: 0, rookieId, data: { ...data, _id } } });
        history.push(`/employee-onboarding/review/${rookieId}`);
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchEmployeeById({ payload }, { call, put }) {
      try {
        const response = yield call(getById, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { ...data, candidate: data._id, _id: data._id },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchTitleListByCompany({ payload }, { call, put }) {
      try {
        const response = yield call(getTitleListByCompany, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTitle: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchTableData({ payload }, { call, put }) {
      try {
        const response = yield call(getTableDataByTitle, payload);
        const { statusCode, data } = response;
        const { setting } = data;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { tableData: setting },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *closeCandidate({ payload }, { call, put }) {
      try {
        const response = yield call(closeCandidate, payload);
        const { statusCode } = response;
        const candidate = payload._id;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { candidate },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *editSalaryStructure({ payload }, { call, put }) {
      try {
        const response = yield call(closeCandidate, payload);
        const { statusCode } = response;
        const candidate = payload._id;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { candidate },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *submitPhase1Effect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(submitPhase1, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { test: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *sentForApprovalEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(sentForApproval, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({ type: 'save', payload: { test: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *approveFinalOfferEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(approveFinalOffer, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({ type: 'save', payload: { test: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveTemp(state, action) {
      const { tempData } = state;
      return {
        ...state,
        tempData: {
          ...tempData,
          ...action.payload,
        },
      };
    },
    saveOrigin(state, action) {
      const { data } = state;
      return {
        ...state,
        data: {
          ...data,
          ...action.payload,
        },
      };
    },
  },
};

export default candidateInfo;
