import React, { Component } from 'react';
import { connect } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';
import OnboardingEmpty from './components/OnboardingEmpty';

@connect(({ onboarding: { menu = {} } = {} }) => ({
  menu,
}))
class OnboardingOverview extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    // reset activeTab from Setting pages if we go to this OnboardingOverview page
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        activeTabDocument: '1',
        activeTabCustomEmail: '1',
      },
    });
    dispatch({
      type: 'newCandidateForm/fetchDocumentsCheckList',
    });
  }

  render() {
    const { menu: { onboardingOverviewTab: { listMenu = [] } = {} } = {}, type = '' } = this.props;
    const checkEmpty = false;

    return checkEmpty === 0 ? (
      <OnboardingEmpty />
    ) : (
      <OnboardingLayout listMenu={listMenu} tabName={type} />
    );
  }
}

export default OnboardingOverview;
