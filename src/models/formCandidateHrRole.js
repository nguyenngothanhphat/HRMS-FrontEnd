import {
  getDocumentList,
  getDepartmentList,
  getTitleList,
  getLocation,
  getEmployeeTypeList,
  getManagerList,
  submitBasicInfo,
  getTableDataByTitle,
  getTitleListByCompany,
  addCandidate,
  editSalaryStructure,
  addSchedule,
  getCandidateManagerList,
  closeCandidate,
  updateByHR,
  getById,
  submitPhase1,
  getLocationListByCompany,
  addManagerSignature,
  getDocumentByCandidate,
} from '@/services/addNewMember';
import { history } from 'umi';
import { dialog, formatAdditionalQuestion } from '@/utils/utils';

import {
  addTeamMember,
  sentForApproval,
  approveFinalOffer,
  getTemplates,
  removeTemplate,
  createFinalOffer,
  checkDocument,
  sendDocumentStatus,
  getAdditionalQuestion,
} from '@/services/formCandidate';

const candidateInfo = {
  namespace: 'candidateInfo',
  state: {
    rookieId: '',
    checkMandatory: {
      filledBasicInformation: false,
      filledJobDetail: false,
      filledCustomField: false,
      filledBackgroundCheck: false,
      filledOfferDetail: false,
      filledSalaryStructure: false,
      filledAdditionalQuestion: false,
      salaryStatus: 2,
    },
    currentStep: 0,
    settingStep: 0,
    statusCodeToValidate: null,
    isAddNewMember: false,
    tempData: {
      checkStatus: {
        filledBasicInformation: false,
        filledJobDetail: false,
        filledBackgroundCheck: false,
      },
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
      department: null,
      workLocation: null,
      title: null,
      reportingManager: null,
      valueToFinalOffer: 0,
      skip: 0,
      // Background Recheck
      backgroundRecheck: {
        documentList: [],
        allDocumentVerified: false,
      },
      // Offer details
      template: '',
      includeOffer: 1,
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
      company: '',
      email: '',
      identityProof: {
        aadharCard: true,
        PAN: true,
        passport: false,
        drivingLicense: false,
        voterCard: false,
        checkedList: [],
        isChecked: false,
      },
      addressProof: {
        rentalAgreement: false,
        electricityBill: false,
        telephoneBill: false,
        checkedList: [],
        isChecked: false,
      },
      educational: {
        sslc: true,
        diploma: true,
        graduation: true,
        postGraduate: false,
        phd: false,
        checkedList: [],
        isChecked: false,
      },
      technicalCertification: {
        poe: {
          offerLetter: false,
          appraisalLetter: false,
          paystubs: false,
          form16: false,
          relievingLetter: false,
          checkedList: [],
          isChecked: false,
        },
        addSchedule,
      },

      candidateSignature: {
        url: '',
        fileName: '',
        name: '',
        user: '',
        id: '',
        _id: '',
      },
      hrManagerSignature: {
        url: '',
        fileName: '',
        name: '',
        user: '',
        id: '',
        _id: '',
      },
      hrSignature: {
        url: '',
        fileName: '',
        name: '',
        user: '',
        id: '',
        _id: '',
      },

      defaultTemplates: [],
      customTemplates: [],
      offerLetter: {
        name: '',
        url: '',
      },
      staticOfferLetter: {
        id: '',
        name: '',
        url: '',
      },
      hidePreviewOffer: false,
      additionalQuestion: {
        opportunity: '',
        payment: '',
        shirt: '',
        dietary: '',
      },
      additionalQuestions: [
        {
          type: 'text',
          name: 'opportunity',
          question: 'Equal employee opportunity',
          answer: '',
        },
        {
          type: 'text',
          name: 'payment',
          question: 'Preferred payment method',
          answer: '',
        },
        {
          type: 'text',
          name: 'shirt',
          question: 'T-shirt size',
          answer: '',
        },
        {
          type: 'text',
          name: 'dietary',
          question: 'Dietary restriction',
          answer: '',
        },
      ],

      cancelCandidate: false,
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
      processStatus: 'RENEGOTIATE-PROVISONAL-OFFER',
      noticePeriod: null,
      dateOfJoining: null,
      reportingManager: null,
      compensationType: null,
      amountIn: null,
      timeOffPolicy: null,
      salaryStructure: {
        salaryPosition: '',
      },
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
          employer: 'Kyle Pham',
          data: [
            {
              key: 'offerLetter',
              alias: 'Offer letter',
              value: true,
            },
            {
              key: 'appraisalLetter',
              alias: 'Appraisal letter',
              value: false,
            },
            {
              key: 'paysTubs',
              alias: 'Paystubs',
              value: true,
            },
            {
              key: 'form16',
              alias: 'Form 16',
              value: true,
            },
            {
              key: 'relievingLetter',
              alias: 'Relieving Letter',
              value: true,
            },
          ],
        },
        {
          type: 'D',
          name: 'Technical Certifications',
          employer: 'Kyle Hung',
          data: [
            {
              key: 'offerLetter',
              alias: 'Offer letter',
              value: true,
            },
            {
              key: 'appraisalLetter',
              alias: 'Appraisal letter',
              value: true,
            },
            {
              key: 'paysTubs',
              alias: 'Paystubs',
              value: true,
            },
            {
              key: 'form16',
              alias: 'Form 16',
              value: true,
            },
            {
              key: 'relievingLetter',
              alias: 'Relieving Letter',
              value: true,
            },
          ],
        },
      ],
      documentsByCandidate: [],
      documentsByCandidateRD: [],
      managerList: [],
      listTitle: [],
      tableData: [],
      hrManagerSignature: {
        url: '',
        fileName: '',
        name: '',
        user: '',
        id: '',
        _id: '',
      },
      hrSignature: {
        url: '',
        fileName: '',
        name: '',
        user: '',
        id: '',
        _id: '',
      },
      candidateSignature: {
        url: '',
        fileName: '',
        name: '',
        user: '',
        id: '',
        _id: '',
      },
      // offerTemplate: {},
      offerLetter: {},
      hiringAgreements: true,
      companyHandbook: true,
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

    *fetchTitleList({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getTitleList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveTemp',
          payload: { titleList: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
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

    *fetchLocationListByCompany({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getLocationListByCompany, payload);
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
      try {
        const response = yield call(getManagerList, payload);
        const { statusCode, data } = response;
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
      let response = {};
      try {
        response = yield call(updateByHR, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { ...data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *submitBasicInfo({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(submitBasicInfo, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { ...data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addSchedule({ payload }, { call }) {
      let response;
      try {
        response = yield call(addSchedule, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({ type: 'saveOrigin', payload: { ...data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *addManagerSignatureEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addManagerSignature, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { ...data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchCandidateInfo(_, { call, put }) {
      let response = {};
      try {
        response = yield call(addTeamMember);
        const { data, statusCode } = response;
        const { ticketID = '', _id } = data;
        if (statusCode !== 200) throw response;
        const rookieId = ticketID;
        yield put({ type: 'save', payload: { rookieId, data: { ...data, _id } } });
        yield put({
          type: 'updateSignature',
          payload: data,
        });
        yield put({
          type: 'saveTemp',
          payload: { ...data },
        });
        history.push({
          pathname: `/employee-onboarding/add/${rookieId}`,
          state: { isAddNew: true },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *getCandidateManagerList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getCandidateManagerList, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: {
            ...data,
            managerList: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchEmployeeById({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getById, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'saveOrigin',
          payload: { ...data, candidate: data._id, _id: data._id },
        });
        yield put({
          type: 'saveTemp',
          payload: {
            ...data,
            valueToFinalOffer: 0,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchTitleListByCompany({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTitleListByCompany, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTitle: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchTableData({ payload }, { call, put }) {
      try {
        const response = yield call(getTableDataByTitle, payload);
        const { statusCode, data } = response;
        const { setting } = data;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveSalaryStructure',
          payload: { settings: setting },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *closeCandidate({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(closeCandidate, payload);
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
      return response;
    },

    *editSalaryStructure({ payload }, { call, put }) {
      try {
        const response = yield call(editSalaryStructure, payload);
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

    *sentForApprovalEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(sentForApproval, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({ type: 'save', payload: { test: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *approveFinalOfferEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(approveFinalOffer, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({ type: 'save', payload: { test: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchCandidateByRookie({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getById, payload);
        const { data, statusCode } = response;
        // console.log('data', data);
        // console.log('currentStep', data.currentStep);
        if (statusCode !== 200) throw response;
        const { _id } = data;
        yield put({
          type: 'save',
          payload: {
            currentStep: data.currentStep,
          },
        });
        yield put({
          type: 'saveOrigin',
          payload: {
            ...data,
            candidate: _id,
            _id,
          },
        });
        const {
          offerLetter: { attachment: { url = '', name = '' } = {} } = {
            attachment: { url: '', name: '' },
          },
        } = data;
        yield put({
          type: 'save',
          payload: {
            data: {
              ...data,
              offerLetter: {
                url,
                name,
              },
              candidate: data._id,
            },
          },
        });

        yield put({
          type: 'saveTemp',
          payload: {
            ...data,
            valueToFinalOffer: 0,
            offerLetter: data.offerLetter,
            candidate: data._id,
            candidateSignature: data.candidateSignature || {},
            amountIn: data.amountIn || '',
            timeOffPolicy: data.timeOffPolicy || '',
            compensationType: data.compensationType || '',
            hidePreviewOffer: !!(data.staticOfferLetter && data.staticOfferLetter.url), // Hide preview offer screen if there's already static offer
            additionalQuestions: formatAdditionalQuestion(data.additionalQuestions) || [],
          },
        });

        // yield put({
        //   type: 'upadateAdditionalQuestion',
        //   payload: formatAdditionalQuestion(data.additionalQuestions),
        // });
        yield put({
          type: 'updateSignature',
          payload: data,
        });
        if (_id) {
          yield put({
            type: 'fetchDocumentByCandidateID',
            payload: {
              candidate: _id,
            },
          });
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchTemplate(_, { call, put }) {
      try {
        const response = yield call(getTemplates);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'updateTemplate',
          payload: data,
        });
      } catch (error) {
        dialog(error);
      }
    },

    *removeTemplateEffect({ payload }, { call, put }) {
      try {
        // const { id = '' } = payload;
        const response = yield call(removeTemplate, payload); // payload: id
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchTemplate',
        });
      } catch (error) {
        dialog(error);
      }
    },

    editTemplateEffect({ payload }) {
      try {
        const { id = '' } = payload;
        // http://localhost:8001/template-details/5f97cd35fc92a3a34bdb2185
        history.push(`/template-details/${id}`);
      } catch (error) {
        dialog(error);
      }
    },

    *createFinalOfferEffect({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(createFinalOffer, payload); // payload: offer data ...
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const { data: { attachment: { name = '', url = '' } = {} } = {} } = response;
        yield put({
          type: 'updateOfferLetter',
          payload: {
            name,
            url,
          },
        });

        // yield call({
        //   type: 'updateByHR',
        //   payload: {
        //     offerLetter: {
        //       name,
        //       url,
        //     },
        //   },
        // });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchDocumentByCandidateID({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDocumentByCandidate, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { documentsByCandidate: data },
        });

        // Group data
        const groupA = [];
        const groupB = [];
        const groupC = [];
        const groupD = [];
        data.map((item) => {
          const { candidateGroup } = item;
          switch (candidateGroup) {
            case 'A':
              groupA.push(item);
              break;
            case 'B':
              groupB.push(item);
              break;
            case 'C':
              groupC.push(item);
              break;
            case 'D':
              groupD.push(item);
              break;
            default:
              break;
          }
          return null;
        });

        const documentsCandidateList = [
          { type: 'A', name: 'Identity Proof', data: [...groupA] },
          { type: 'B', name: 'Address Proof', data: [...groupB] },
          { type: 'C', name: 'Educational', data: [...groupC] },
          { type: 'D', name: 'Technical Certifications', data: [...groupD] },
        ];

        yield put({
          type: 'saveTemp',
          payload: { documentsByCandidate: data, documentsByCandidateRD: documentsCandidateList },
        });
        yield put({
          type: 'updateBackgroundRecheck',
          payload: documentsCandidateList,
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *checkDocumentEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(checkDocument, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *sendDocumentStatusEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(sendDocumentStatus, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *redirectToCandidateList({ payload }) {
      try {
        const { rookieId = '' } = payload;
        history.push({
          pathname: `/employee-onboarding/review/${rookieId}`,
          state: { isAddNew: true },
        });
        yield null;
      } catch (error) {
        dialog(error);
      }
    },

    *fetchAdditionalQuestion({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(getAdditionalQuestion, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        console.log(response);
        // put({
        //   type: 'updateAdditionalQuestion',
        //   payload: data
        // })
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
    saveSalaryStructure(state, action) {
      const { data, salaryStructure } = state;
      return {
        ...state,
        data: {
          ...data,
          salaryStructure: {
            ...salaryStructure,
            ...action.payload,
          },
        },
      };
    },

    updateSignature(state, action) {
      const { tempData } = state;
      const data = action.payload;
      const { hrSignature = {}, hrManagerSignature = {} } = data;
      return {
        ...state,
        tempData: {
          ...tempData,
          hrSignature,
          hrManagerSignature,
        },
      };
    },

    updateTemplate(state, action) {
      const { tempData } = state;
      const data = action.payload;

      if (!data) {
        return state;
      }

      const defaultTemplates = data.filter((template) => template.default === true);
      const customTemplates = data.filter((template) => template.default === false);

      return {
        ...state,
        tempData: {
          ...tempData,
          defaultTemplates,
          customTemplates,
        },
      };
    },
    setDefaultTable(state) {
      return {
        ...state,
        tableData: [
          {
            key: 'basic',
            title: 'Basic',
            value: ' ',
            order: 'A',
          },
          {
            key: 'hra',
            title: 'HRA',
            value: ' ',
            order: 'B',
          },
          {
            title: 'Other allowances',
            key: 'otherAllowances',
            value: 'Balance amount',
            order: 'C',
          },
          {
            key: 'totalEarning',
            title: 'Total earning (Gross)',
            order: 'D',
            value: 'A + B + C',
          },
          {
            key: 'deduction',
            title: 'Deduction',
            order: 'E',
            value: ' ',
          },
          {
            key: 'employeesPF',
            title: "Employee's PF",
            value: ' ',
            order: 'G',
          },
          {
            key: 'employeesESI',
            title: "Employee's ESI",
            value: ' ',
            order: 'H',
          },
          {
            key: 'professionalTax',
            title: 'Professional Tax',
            value: 'Rs.200',
            order: 'I',
          },
          {
            key: 'tds',
            title: 'TDS',
            value: 'As per IT rules',
            order: 'J',
          },
          {
            key: 'netPayment',
            title: 'Net Payment',
            value: 'F - (G + H + I + J)',
            order: ' ',
          },
        ],
      };
    },

    updateBackgroundRecheck(state, action) {
      const { tempData } = state;
      const { payload = [] } = action;
      const { backgroundRecheck = {} } = tempData;
      return {
        ...state,
        tempData: {
          ...tempData,
          backgroundRecheck: {
            ...backgroundRecheck,
            documentList: payload,
          },
        },
      };
    },

    updateAllDocumentVerified(state, action) {
      const { tempData } = state;
      const { payload = false } = action;
      const { backgroundRecheck = {} } = tempData;
      return {
        ...state,
        tempData: {
          ...tempData,
          backgroundRecheck: {
            ...backgroundRecheck,
            allDocumentVerified: payload,
          },
        },
      };
    },

    // removeTemplate(state, action) {
    //   const { tempData } = state;
    //   const data = action.payload;

    //   if (!data) {
    //     return state;
    //   }

    //   const defaultTemplates = data.filter((template) => template.default === true);
    //   const customTemplates = data.filter((template) => template.default === false);

    //   return {
    //     ...state,
    //     tempData: {
    //       ...tempData,
    //       defaultTemplates,
    //       customTemplates,
    //     },
    //   };
    // },

    updateOfferLetter(state, action) {
      const { tempData } = state;

      return {
        ...state,
        tempData: {
          ...tempData,
          offerLetter: action.payload,
        },
      };
    },

    // DRAFT
    updateAdditionalQuestion(state, action) {
      const { tempData } = state;

      return {
        ...state,
        tempData: {
          ...tempData,
          additionalQuestion: action.payload,
        },
      };
    },

    updateAdditionalQuestions(state, action) {
      const { tempData } = state;

      return {
        ...state,
        tempData: {
          ...tempData,
          additionalQuestions: action.payload,
        },
      };
    },
  },
};

export default candidateInfo;
