import { dialog } from '@/utils/utils';

const candidateProfile = {
  namespace: 'candidateProfile',
  state: {
    currentStep: 3,
    basicInformation: {
      fullName: '',
      privateEmail: '',
      experienceYear: '',
      workLocation: '',
    },
    jobDetails: {
      position: 'EMPLOYEE',
      employeeType: '5f50c2541513a742582206f9',
      department: '',
      title: '',
      workLocation: '',
      reportingManager: '',
      candidatesNoticePeriod: '',
      prefferedDateOfJoining: '',
    },
    checkCandidateMandatory: {
      filledCandidateBasicInformation: false,
      filledCandidateJobDetails: false,
      filledCandidateCustomField: false,
      salaryStatus: 2,
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
export default candidateProfile;
