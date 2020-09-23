import React, { PureComponent } from 'react';

import { Button } from 'antd';
import { connect, Link } from 'umi';

import AwaitingApprovals from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/AwaitingApprovals';
import DiscardedProvisionalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/DiscardedProvisionalOffers';
import EligibleCandidates from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/EligibleCandidates';
import FinalOfferDrafts from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/FinalOfferDrafts';
import FinalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/FinalOffers';
import IneligibleCandidates from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/IneligibleCandidates';
import PendingEligibilityChecks from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/PendingEligibilityChecks';
import ProvisionalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/ProvisionalOffers';
import DiscardedFinalOffers from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/DiscardedFinalOffers';

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
    case 'FinalOfferDrafts':
      return <FinalOfferDrafts />;
    case 'DiscardedFinalOffers':
      return <DiscardedFinalOffers />;
    default:
      return <PendingEligibilityChecks />;
  }
};

class OnboardingLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: 1,
      pageTitle: '',
      displayComponent: null,
    };
    console.log(this.props);
  }

  componentDidMount() {
    const { listMenu = [] } = this.props;
    const firstComponent = listMenu[0].menuItem[0].component;
    this.setState({
      pageTitle: listMenu[0].menuItem[0].name,
      selectedId: listMenu[0].menuItem[0].id,
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

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent = null, pageTitle = '' } = this.state;

    return (
      <div className={styles.overviewContainer}>
        <div className={styles.viewLeft}>
          <Link to="/employee-onboarding/add">
            <Button className={styles.addMember} type="primary">
              <div className={styles.icon}>
                <img src="/assets/images/addMemberIcon.svg" alt="add member icon" />

                <span>Add Team Member</span>
              </div>
            </Button>
          </Link>

          <div className={styles.divider} />

          <div className={styles.leftMenu}>
            {listMenu.map((phase) => {
              const { id, title, menuItem } = phase;
              const { selectedId } = this.state;
              return (
                <div key={id}>
                  <MenuItem
                    selectedId={selectedId}
                    title={title}
                    menuItem={menuItem}
                    handleClick={this.handleClick}
                  />
                </div>
              );
            })}
          </div>

          {/* <Link
            to="/employee-onboarding/review/16003134"
            style={{ marginTop: '1rem', display: 'block' }}
          >
            Link review member by rookieId =16003134
          </Link> */}
        </div>

        <div className={styles.viewRight}>
          <p className={styles.pageTitle}>{pageTitle}</p>
          {displayComponent}
        </div>
      </div>
    );
  }
}

export default OnboardingLayout;
