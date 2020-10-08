// import { dialog } from '@/utils/utils';

const candidateProfile = {
  namespace: 'candidateProfile',
  state: {
    currentStep: 5,
    basicInformation: {
      fullName: '',
      privateEmail: '',
      experienceYears: '',
      workLocation: '',
    },
    checkMandatory: {
      filledBasicInformation: false,
      filledJobDetail: false,
      filledCustomField: false,
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
