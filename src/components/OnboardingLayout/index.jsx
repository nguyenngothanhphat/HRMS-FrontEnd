import React, { PureComponent } from 'react';

import { Button } from 'antd';
import { formatMessage, connect } from 'umi';

import AwaitingApprovals from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/AwaitingApprovals';
import DiscardedProvisionalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/DiscardedProvisionalOffers';
import EligibleCandidates from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/EligibleCandidates';
import AllDrafts from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/AllDrafts';
import FinalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/FinalOffers';
import IneligibleCandidates from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/IneligibleCandidates';
import PendingEligibilityChecks from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/PendingEligibilityChecks';
import ProvisionalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/ProvisionalOffers';
import DiscardedFinalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/DiscardedFinalOffers';
import BackgroundCheck from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/BackgroundCheck';
import DiscardedOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/DiscardedOffers';

import MenuItem from './components/MenuItem';

import styles from './index.less';

const getComponent = (name) => {
  switch (name) {
    case 'PendingEligibilityChecks':
      return <PendingEligibilityChecks />;
    case 'EligibleCandidates':
      return <EligibleCandidates />;
    case 'IneligibleCandidates':
      return <IneligibleCandidates />;
    case 'ProvisionalOffers':
      return <ProvisionalOffers />;
    case 'DiscardedProvisionalOffers':
      return <DiscardedProvisionalOffers />;
    case 'AwaitingApprovals':
      return <AwaitingApprovals />;
    case 'FinalOffers':
      return <FinalOffers />;
    case 'AllDrafts':
      return <AllDrafts />;
    case 'DiscardedFinalOffers': // del
      return <DiscardedFinalOffers />; // del
    case 'BackgroundCheck':
      return <BackgroundCheck />;
    case 'DiscardedOffers':
      return <DiscardedOffers />;
    default:
      return <PendingEligibilityChecks />;
  }
};

@connect()
class OnboardingLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: 1,
      pageTitle: '',
      displayComponent: null,
    };
  }

  componentDidMount() {
    const { listMenu = [] } = this.props;
    const firstComponent = listMenu[0].component;
    this.setState({
      pageTitle: listMenu[0].name,
      selectedId: listMenu[0].id,
      displayComponent: getComponent(firstComponent),
    });
  }

  handleClick = (item) => {
    const { id = 1, component = '', name = '' } = item;
    this.setState({
      selectedId: id,
      displayComponent: getComponent(component),
      pageTitle: name,
    });
  };

  handleAddBtn = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/fetchCandidateInfo',
      payload: {},
    });
  };

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent = null, pageTitle = '' } = this.state;

    return (
      <div className={styles.overviewContainer}>
        <div className={styles.viewLeft}>
          {/* <Link to="/employee-onboarding/add"> */}
          <Button className={styles.addMember} type="primary" onClick={this.handleAddBtn}>
            <div className={styles.icon}>
              <img src="/assets/images/addMemberIcon.svg" alt="add member icon" />

              <span>{formatMessage({ id: 'component.onboardingOverview.addTeamMember' })}</span>
            </div>
          </Button>
          {/* </Link> */}

          <div className={styles.divider} />

          <div className={styles.leftMenu}>
            {listMenu.map((item) => {
              const { id, name, component, quantity } = item;
              const { selectedId } = this.state;
              return (
                <div key={id}>
                  <MenuItem
                    selectedId={selectedId}
                    id={id}
                    name={name}
                    component={component}
                    quantity={quantity}
                    handleClick={this.handleClick}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.viewRight}>
          <p className={styles.pageTitle}>{pageTitle}</p>
          {displayComponent}
        </div>
      </div>
    );
  }
}

// export default OnboardingLayout;
export default connect(({ info }) => ({
  info,
}))(OnboardingLayout);
