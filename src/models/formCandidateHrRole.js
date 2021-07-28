import {
  getGradeList,
  getDocumentList,
  getTitleListByDepartment,
  fetchDepartmentList,
  getLocationList,
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
  getWorkHistory,
} from '@/services/addNewMember';
import { history } from 'umi';
import { notification } from 'antd';
import { dialog, formatAdditionalQuestion } from '@/utils/utils';
import { getCurrentTenant, getCurrentCompany } from '@/utils/authority';

import {
  addTeamMember,
  sentForApproval,
  approveFinalOffer,
  getTemplates,
  getDefaultTemplateList,
  getCustomTemplateList,
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
      calledListTitle: false,
      payrollSettingCheck: false,
      benefitsCheck: false,
    },
    currentStep: 0,
    settingStep: 0,
    statusCodeToValidate: null,
    isAddNewMember: false,
    tempData: {
      checkStatus: {
        filledBasicInformation: false,
        filledJobDetail: false,
        filledSalaryCheck: false,
        filledBackgroundCheck: false,
        offerDetailCheck: false,
        payrollSettingCheck: false,
        benefitsCheck: false,
      },
      position: 'EMPLOYEE',
      employeeType: {},
      previousExperience: null,
      candidatesNoticePeriod: '',
      prefferedDateOfJoining: '',
      jobGradeLevelList: [],
      employeeTypeList: [],
      locationList: [],
      departmentList: [],
      titleList: [],
      managerList: [],
      joineeEmail: '',
      employer: '',
      grade: null,
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
        // aadharCard: true,
        // PAN: true,
        // passport: false,
        // drivingLicense: false,
        // voterCard: false,
        checkedList: [],
        // isChecked: false,
      },
      addressProof: {
        // rentalAgreement: false,
        // electricityBill: false,
        // telephoneBill: false,
        checkedList: [],
        // isChecked: false,
      },
      educational: {
        // sslc: true,
        // diploma: true,
        // graduation: true,
        // postGraduate: false,
        // phd: false,
        checkedList: [],
        // isChecked: false,
      },
      previousEmployment: {
        poe: [
          // {
          //   employer: '',
          //   offerLetter: false,
          //   appraisalLetter: false,
          //   paystubs: false,
          //   form16: false,
          //   relievingLetter: false,
          //   checkedList: [],
          //   isChecked: false,
          // },
        ],
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
      disablePreviewOffer: true,
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
      salaryTitle: null,
      salaryDepartment: null,
      salaryLocation: null,
    },
    data: {
      firstName: null,
      middleName: null,
      lastName: null,
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
        salaryDepartment: '',
        salaryLocation: '',
        salaryPosition: '',
      },
      id: '',
      candidate: '',
      documentChecklistSetting: [],
      documentsByCandidate: [],
      documentsByCandidateRD: [],
      managerList: [],
      listTitle: [],
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
    *getJobGradeList(_, { call, put }) {
      try {
        const response = yield call(getGradeList);
        yield put({
          type: 'saveTemp',
          payload: { jobGradeLevelList: response },
        });
      } catch (error) {
        dialog(error);
      }
    },
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

    *fetchDepartmentList({ payload: { company = '', tenantId = '' } }, { call, put }) {
      try {
        // const response = yield call(getDepartmentList, { company });
        const response = yield call(fetchDepartmentList, { company, tenantId });
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
        response = yield call(getTitleListByDepartment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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

    *fetchLocationList({ payload: { company = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getLocationList, { tenantId, company });
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
        const response = yield call(getLocationListByCompany, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        yield put({
          type: 'updateEmployeeType',
          payload: employeeTypeList[0],
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchManagerList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getManagerList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        const response = yield call(addCandidate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(updateByHR, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(submitBasicInfo, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(addSchedule, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(addManagerSignature, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { ...data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchCandidateInfo({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addTeamMember, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { data, statusCode } = response;
        const { ticketID = '', _id } = data;
        if (statusCode !== 200) throw response;
        const rookieId = ticketID;
        yield put({
          type: 'save',
          payload: { rookieId, data: { ...data, _id } },
        });

        yield put({
          type: 'updateSignature',
          payload: data,
        });

        yield put({
          type: 'saveTemp',
          payload: { ...data },
        });

        history.push({
          pathname: `/employee-onboarding/list/add/${rookieId}`,
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
        response = yield call(getCandidateManagerList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(getById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(getTitleListByCompany, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          // payload: { ...data, listTitle: data },
          payload: { listTitle: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchTableData({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTableDataByTitle, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        const { setting } = data;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveSalaryStructure',
          payload: {
            department: payload.department,
            workLocation: payload.workLocation,
            title: payload.title,
            settings: setting,
          },
        });

        yield put({
          type: 'saveOrigin',
          payload: {
            salaryStructure: {
              department: payload.department,
              workLocation: payload.workLocation,
              title: payload.title,
              settings: setting,
            },
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *closeCandidate({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(closeCandidate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        const response = yield call(editSalaryStructure, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        const candidate = payload._id;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { candidate },
        });

        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *submitPhase1Effect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(submitPhase1, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(sentForApproval, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(approveFinalOffer, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({ type: 'save', payload: { test: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    // *fetchCandidateByRookie({ payload }, { call, put }) {
    //   let response = {};
    //   try {
    //     response = yield call(getById, {...payload, tenantId: getCurrentTenant(), company: getCurrentCompany()});
    //     const { data, statusCode } = response;

    //     if (statusCode !== 200) throw response;
    //     const { _id } = data;
    //     yield put({
    //       type: 'save',
    //       payload: {
    //         currentStep: data.currentStep,
    //       },
    //     });
    //     yield put({
    //       type: 'saveOrigin',
    //       payload: {
    //         ...data,
    //         candidate: _id,
    //         _id,
    //       },
    //     });
    //     const {
    //       offerLetter: { attachment: { url = '', name = '' } = {} } = {
    //         attachment: { url: '', name: '' },
    //       },
    //     } = data;
    //     yield put({
    //       type: 'save',
    //       payload: {
    //         data: {
    //           ...data,
    //           offerLetter: {
    //             url,
    //             name,
    //           },
    //           candidate: data._id,
    //         },
    //       },
    //     });

    //     const {
    //       fullName = '',
    //       privateEmail = '',
    //       previousExperience = '',
    //       salaryStructure = {},
    //       documentChecklistSetting = [],
    //       amountIn,
    //       timeOffPolicy,
    //       currentStep,
    //     } = data;

    //     const identityProof = documentChecklistSetting[0]?.data;
    //     const addressProof = documentChecklistSetting[1]?.data;
    //     const educational = documentChecklistSetting[2]?.data;
    //     const technicalCertification = documentChecklistSetting[3]?.data;

    //     let listCheckIP = identityProof.map((item) => item.value);
    //     listCheckIP = listCheckIP.filter((item) => item === true);

    //     let listCheckAP = addressProof.map((item) => item.value);
    //     listCheckAP = listCheckAP.filter((item) => item === true);

    //     let listCheckEdu = educational.map((item) => item.value);
    //     listCheckEdu = listCheckEdu.filter((item) => item === true);

    //     let listCheckTC = technicalCertification.map((item) => item.value);
    //     listCheckTC = listCheckTC.filter((item) => item === true);

    //     const checkStatus = {};

    //     if (
    //       listCheckIP.length > 2 ||
    //       listCheckAP.length > 0 ||
    //       listCheckEdu.length > 3 ||
    //       listCheckTC.length > 0 ||
    //       'employer' in documentChecklistSetting[3]
    //     ) {
    //       checkStatus.filledBgCheck = true;
    //     }

    //     if (fullName && privateEmail && previousExperience) {
    //       checkStatus.filledBasicInformation = true;
    //     }
    //     if ('title' in data && 'workLocation' in data && 'department' in data) {
    //       checkStatus.filledJobDetail = true;
    //     }
    //     if ('title' in salaryStructure) {
    //       checkStatus.filledSalaryCheck = true;
    //     }

    //     if (amountIn && timeOffPolicy) {
    //       checkStatus.offerDetailCheck = true;
    //     }

    //     if (currentStep >= 5) {
    //       checkStatus.payrollSettingCheck = true;
    //     } else {
    //       checkStatus.payrollSettingCheck = false;
    //     }

    //     if (currentStep >= 6) {
    //       checkStatus.benefitsCheck = true;
    //     }

    //     yield put({
    //       type: 'saveTemp',
    //       payload: {
    //         ...data,
    //         checkStatus,
    //         valueToFinalOffer: 0,
    //         offerLetter: data.offerLetter,
    //         candidate: data._id,
    //         candidateSignature: data.candidateSignature || {},
    //         amountIn: data.amountIn || '',
    //         timeOffPolicy: data.timeOffPolicy || '',
    //         compensationType: data.compensationType || '',
    //         salaryTitle: data.salaryStructure?.title?._id,
    //         salaryStructure: data.salaryStructure,
    //         salaryNote: data.salaryNote,
    //         includeOffer: data.includeOffer || 1,
    //         // hidePreviewOffer: !!(data.staticOfferLetter && data.staticOfferLetter.url), // Hide preview offer screen if there's already static offer
    //         // disablePreviewOffer:
    //         //   (data.offerLetter && data.offerLetter.attachment) ||
    //         //   (data.staticOfferLetter && data.staticOfferLetter.url),
    //         additionalQuestions: formatAdditionalQuestion(data.additionalQuestions) || [],
    //       },
    //     });

    //     if (
    //       (data.offerLetter && data.offerLetter.attachment) ||
    //       (data.staticOfferLetter && data.staticOfferLetter.url)
    //     ) {
    //       yield put({
    //         type: 'saveTemp',
    //         payload: {
    //           disablePreviewOffer: false,
    //         },
    //       });
    //     }

    //     // yield put({
    //     //   type: 'upadateAdditionalQuestion',
    //     //   payload: formatAdditionalQuestion(data.additionalQuestions),
    //     // });
    //     yield put({
    //       type: 'updateSignature',
    //       payload: data,
    //     });
    //     if (_id) {
    //       yield put({
    //         type: 'fetchDocumentByCandidateID',
    //         payload: {
    //           candidate: _id,
    //           tenantId: payload.tenantId,
    //         },
    //       });
    //     }
    //   } catch (error) {
    //     dialog(error);
    //   }
    //   return response;
    // },

    *fetchCandidateByRookie({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { data, statusCode } = response;

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
        console.log('a');
        const {
          firstName = '',
          middleName = '',
          lastName = '',
          privateEmail = '',
          previousExperience = '',
          salaryStructure = {},
          documentChecklistSetting = [],
          amountIn,
          timeOffPolicy,
          currentStep,
        } = data;

        const filterValue = (arr) => {
          let listCheck = arr.map((item) => item.value);
          listCheck = listCheck.filter((item) => item === true);

          return listCheck;
        };
        const identityProof = documentChecklistSetting[0]?.data || [];
        const addressProof = documentChecklistSetting[1]?.data || [];
        const educational = documentChecklistSetting[2]?.data || [];
        const technicalCertification = documentChecklistSetting[3]?.data || [];

        const prevEmployee = documentChecklistSetting[4]?.data || [];

        const checkStatusTypeA = filterValue(identityProof);
        const checkStatusTypeB = filterValue(addressProof);
        const checkStatusTypeC = filterValue(educational);
        const checkStatusTypeD = filterValue(technicalCertification);
        const checkStatusTypeE = filterValue(prevEmployee);

        const checkStatus = {};
        if (
          checkStatusTypeA.length > 4 ||
          checkStatusTypeB.length > 1 ||
          checkStatusTypeC.length > 4 ||
          checkStatusTypeD.length > 0 ||
          checkStatusTypeE.length > 0 ||
          'employer' in (documentChecklistSetting[4] ? documentChecklistSetting[4] : {})
        ) {
          checkStatus.filledBgCheck = true;
        }

        if (firstName && middleName && lastName && privateEmail && previousExperience) {
          checkStatus.filledBasicInformation = true;
        }
        if ('title' in data && 'workLocation' in data && 'department' in data) {
          checkStatus.filledJobDetail = true;
        }
        if ('title' in salaryStructure) {
          checkStatus.filledSalaryCheck = true;
        }

        if (amountIn && timeOffPolicy) {
          checkStatus.offerDetailCheck = true;
        }

        if (currentStep >= 5) {
          checkStatus.payrollSettingCheck = true;
        } else {
          checkStatus.payrollSettingCheck = false;
        }

        if (currentStep >= 6) {
          checkStatus.benefitsCheck = true;
        }
        console.log('documentChecklistSetting', data.documentChecklistSetting);
        yield put({
          type: 'saveTemp',
          payload: {
            ...data,
            checkStatus,
            valueToFinalOffer: 0,
            offerLetter: data.offerLetter,
            candidate: data._id,
            candidateSignature: data.candidateSignature || {},
            amountIn: data.amountIn || '',
            timeOffPolicy: data.timeOffPolicy || '',
            compensationType: data.compensationType || '',
            salaryTitle: data.salaryStructure?.title?._id,
            salaryStructure: data.salaryStructure,
            salaryNote: data.salaryNote,
            includeOffer: data.includeOffer || 1,
            // hidePreviewOffer: !!(data.staticOfferLetter && data.staticOfferLetter.url), // Hide preview offer screen if there's already static offer
            // disablePreviewOffer:
            //   (data.offerLetter && data.offerLetter.attachment) ||
            //   (data.staticOfferLetter && data.staticOfferLetter.url),
            additionalQuestions: formatAdditionalQuestion(data.additionalQuestions) || [],
          },
        });

        if (
          (data.offerLetter && data.offerLetter.attachment) ||
          (data.staticOfferLetter && data.staticOfferLetter.url)
        ) {
          yield put({
            type: 'saveTemp',
            payload: {
              disablePreviewOffer: false,
            },
          });
        }

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
              tenantId: payload.tenantId,
            },
          });
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchTemplate(_, { call, put }) {
      const OFFBOARD_TEMPLATE_TYPE = 'OFF_BOARDING-EXIT_PACKAGE';
      try {
        const response = yield call(getTemplates);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        const templateList = data;
        const onboardTemplates = templateList.filter(
          (template) => template.type !== OFFBOARD_TEMPLATE_TYPE,
        );
        yield put({
          type: 'updateTemplate',
          payload: onboardTemplates,
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchDefaultTemplateList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDefaultTemplateList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveTemp',
          payload: {
            defaultTemplates: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCustomTemplateList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getCustomTemplateList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveTemp',
          payload: {
            customTemplates: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *removeTemplateEffect({ payload }, { call, put }) {
      try {
        // const { id = '' } = payload;
        const response = yield call(removeTemplate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        }); // payload: id
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const newPayload = {
          tenantId: payload.tenantId,
          type: 'ON_BOARDING',
        };
        yield put({
          type: 'fetchDefaultTemplateList',
          payload: newPayload,
        });
        yield put({
          type: 'fetchCustomTemplateList',
          payload: newPayload,
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
        response = yield call(createFinalOffer, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        }); // payload: offer data ...
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
        response = yield call(getDocumentByCandidate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { documentsByCandidate: data },
        });

        yield put({
          type: 'saveTemp',
          payload: {
            documentsByCandidate: data,
            // documentsByCandidateRD: documentsCandidateList,
          },
        });
        // yield put({
        //   type: 'updateBackgroundRecheck',
        //   payload: data,
        // });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *checkDocumentEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(checkDocument, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        response = yield call(sendDocumentStatus, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
          pathname: `/employee-onboarding/list/review/${rookieId}`,
          state: { isAddNew: true },
        });
        yield null;
      } catch (error) {
        dialog(error);
      }
    },

    *redirectToOnboardList() {
      try {
        history.push({
          pathname: `/employee-onboarding`,
        });
        yield null;
      } catch (error) {
        dialog(error);
      }
    },

    *fetchAdditionalQuestion({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(getAdditionalQuestion, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        // put({
        //   type: 'updateAdditionalQuestion',
        //   payload: data
        // })
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchWorkHistory({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getWorkHistory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: {
            workHistory: data,
          },
        });
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
    saveFilledSalaryStructure(state, action) {
      const { checkMandatory } = state;
      return {
        ...state,
        checkMandatory: {
          ...checkMandatory,
          ...action.payload,
        },
      };
    },
    saveSalaryStructure(state, action) {
      const { tempData } = state;

      return {
        ...state,
        tempData: {
          ...tempData,
          salaryStructure: {
            ...tempData.salaryStructure,
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
          hidePreviewOffer: false,
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

    updateEmployeeType(state, action) {
      const { tempData = {} } = state;
      const { employeeType = '' } = tempData;

      if (Object.keys(employeeType).length === 0) {
        return {
          ...state,
          tempData: {
            ...tempData,
            employeeType: action.payload,
          },
        };
      }
      return state;
    },
  },
};

export default candidateInfo;
