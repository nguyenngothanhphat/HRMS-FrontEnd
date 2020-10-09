import React, { PureComponent } from 'react';
import { connect } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';

import { PROCESS_STATUS } from './components/utils';

class OnboardingOverview extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    const {
      SENT_ELIGIBILITY_FORMS,
      RECEIVED_SUBMITTED_DOCUMENTS,
      ELIGIBLE_CANDIDATES,
      INELIGIBLE_CANDIDATES,
      SENT_PROVISIONAL_OFFERS,
      RECEIVED_PROVISIONAL_OFFERS,
      DISCARDED_PROVISIONAL_OFFERS,
      PENDING_APPROVALS,
      APPROVED_FINAL_OFFERS,
      REJECT_FINAL_OFFERS,
      SENT_FINAL_OFFERS,
      ACCEPTED_FINAL_OFFERS,
      FINAL_OFFERS_DRAFTS,
      DISCARDED_FINAL_OFFERS,
    } = PROCESS_STATUS;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: SENT_ELIGIBILITY_FORMS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: RECEIVED_SUBMITTED_DOCUMENTS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: ELIGIBLE_CANDIDATES,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: INELIGIBLE_CANDIDATES,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: SENT_PROVISIONAL_OFFERS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: RECEIVED_PROVISIONAL_OFFERS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: DISCARDED_PROVISIONAL_OFFERS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: PENDING_APPROVALS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: APPROVED_FINAL_OFFERS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: REJECT_FINAL_OFFERS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: SENT_FINAL_OFFERS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: ACCEPTED_FINAL_OFFERS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: FINAL_OFFERS_DRAFTS,
      },
    });
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: DISCARDED_FINAL_OFFERS,
      },
    });
  }

  render() {
    const { menu = {} } = this.props;
    const { onboardingOverviewTab = {} } = menu;
    const { phaseList = [] } = onboardingOverviewTab;

    return (
      <div>
        <OnboardingLayout listMenu={phaseList} />
      </div>
    );
  }
}

// export default OnboardingOverview;
export default connect((state) => {
  const { onboard = {} } = state;
  const { menu = {} } = onboard;
  return {
    menu,
  };
})(OnboardingOverview);
