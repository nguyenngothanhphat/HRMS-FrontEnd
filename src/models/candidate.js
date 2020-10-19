const candidateProfile = {
  namespace: 'candidateProfile',
  state: {
    currentStep: 6,
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
    eligibilityDocs: [
      {
        type: 'A',
        name: 'Identity Proof',
        data: [
          { name: 'Aahar Card', value: false },
          { name: 'PAN Card', value: false },
          { name: 'Passport', value: false },
          { name: 'Driving License', value: false },
          { name: 'Voter Card', value: false },
        ],
      },
      {
        type: 'B',
        name: 'Address Proof',
        data: [
          { name: 'Rental Aggreement', value: false },
          { name: 'Electricity & Utility Bills', value: false },
          { name: 'Telephone Bills', value: false },
        ],
      },
      {
        type: 'C',
        name: 'Educational',
        data: [
          { name: 'SSLC', value: false },
          { name: 'Intermediate/Diploma', value: false },
          { name: 'Graduation', value: false },
          { name: 'Post Graduate', value: false },
          { name: 'PHP/Doctorate', value: false },
        ],
      },
      {
        type: 'D',
        name: 'Technical Certifications',
        data: [
          { name: 'Offer letter', value: false },
          { name: 'Appraisal letter', value: false },
          { name: 'Paystubs', value: false },
          { name: 'Form 16', value: false },
          { name: 'Relieving Letter', value: false },
        ],
      },
    ],
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
