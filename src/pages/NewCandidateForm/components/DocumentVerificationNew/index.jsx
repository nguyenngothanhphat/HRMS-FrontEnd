import { Skeleton } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import BackgroundRecheck from './components/BackgroundRecheck';
import DocumentVerification from './components/DocumentVerification';
import { goToTop } from '@/utils/utils';

const EligibilityDocuments = (props) => {
  const {
    dispatch,
    loadingFetchCandidate = false,
    newCandidateForm: {
      data: { processStatus = '' },
      tempData: { workLocation },
      documentLayout = [],
    } = {},
    companyLocationList = [],
  } = props;

  const getDocumentLayoutByCountry = () => {
    let workLocation1 = workLocation;
    if (typeof workLocation === 'string') {
      workLocation1 = companyLocationList.find((w) => w._id === workLocation);
    }
    if (workLocation1) {
      dispatch({
        type: 'newCandidateForm/fetchDocumentLayoutByCountry',
        payload: {
          country:
            workLocation1?.headQuarterAddress?.country?._id ||
            workLocation1?.headQuarterAddress?.country,
        },
      });
    }
  };

  useEffect(() => {
    goToTop();
    if (documentLayout.length === 0) {
      getDocumentLayoutByCountry();
    }
  }, []);

  if (loadingFetchCandidate) {
    return <Skeleton />;
  }
  if (
    processStatus !== NEW_PROCESS_STATUS.PROFILE_VERIFICATION &&
    processStatus !== NEW_PROCESS_STATUS.DRAFT
  ) {
    return <BackgroundRecheck />;
  }
  return <DocumentVerification />;
};

export default connect(
  ({ newCandidateForm, user, loading, location: { companyLocationList = [] } = {} }) => ({
    user,
    newCandidateForm,
    companyLocationList,
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)(EligibilityDocuments);
