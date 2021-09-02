import { Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import BackgroundRecheck from './components/BackgroundRecheck';
import DocumentVerification from './components/DocumentVerification';

@connect(({ newCandidateForm: { data = {} } = {}, user, loading }) => ({
  data,
  user,
  loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
}))
class MessageBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      loadingFetchCandidate = false,
      data: { processStatus = '' },
    } = this.props;

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
  }
}

export default MessageBox;
