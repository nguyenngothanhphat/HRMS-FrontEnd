import { Skeleton } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { NEW_PROCESS_STATUS } from '@/constants/onboarding';
import BackgroundRecheck from './components/BackgroundRecheck';
import DocumentVerification from './components/DocumentVerification';
import { goToTop } from '@/utils/utils';

const DocumentsCheckList = (props) => {
  const { loadingFetchCandidate = false, newCandidateForm: { data: { processStatus = '' } } = {} } =
    props;

  useEffect(() => {
    goToTop();
  }, []);

  if (loadingFetchCandidate) {
    return <Skeleton />;
  }
  if (
    processStatus !== NEW_PROCESS_STATUS.OFFER_ACCEPTED &&
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
)(DocumentsCheckList);
