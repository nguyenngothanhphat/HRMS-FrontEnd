import React, { PureComponent } from 'react';

import { Button } from 'antd';
import { formatMessage, connect, history } from 'umi';

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

import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
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
    case 'DocumentVerification':
      return <BackgroundCheck />;
    case 'DiscardedOffers':
      return <DiscardedOffers />;
    default:
      return <PendingEligibilityChecks />;
  }
};

@connect(({ loading }) => ({
  loadingAddTeamMember:
    loading.effects['info/fetchCandidateInfo'] ||
    loading.effects['candidateInfo/fetchCandidateInfo'],
}))
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
    this.fetchTab();
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        a: 2,
        data: {},
      },
    });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, tabName = 'all-drafts' } = this.props;
    if (prevProps.data._id) {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          data: {},
        },
      });
    }

    if (prevProps.tabName !== tabName) {
      this.fetchTab();
    }
  }

  fetchTab = () => {
    const { listMenu = [], tabName = 'all-drafts' } = this.props;
    const findTab = listMenu.find((menu) => menu.link === tabName) || listMenu[0];

    const firstComponent = findTab.component;
    this.setState({
      pageTitle: findTab.name,
      selectedId: findTab.id,
      displayComponent: getComponent(firstComponent),
    });
  };

  handleClick = (item) => {
    const { id = 1, component = '', name = '', link = '' } = item;
    history.push(`/employee-onboarding/list/${link}`);
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
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      },
    });
  };

  render() {
    const { listMenu = [], loadingAddTeamMember = false, permissions = {} } = this.props;
    const { displayComponent = null, pageTitle = '' } = this.state;
    const checkPermissionAddTeamMember = permissions.addTeamMemberOnboarding !== -1;

    return (
      <div className={styles.overviewContainer}>
        <div className={styles.viewLeft}>
          {/* <Link to="/employee-onboarding/add"> */}
          {checkPermissionAddTeamMember && (
            <Button
              icon={<img src="/assets/images/addMemberIcon.svg" alt="add member icon" />}
              className={styles.addMember}
              type="primary"
              loading={loadingAddTeamMember}
              onClick={this.handleAddBtn}
            >
              <span className={styles.title}>
                {formatMessage({ id: 'component.onboardingOverview.addTeamMember' })}
              </span>
            </Button>
          )}
          {/* </Link> */}

          <div className={styles.divider} />

          <div className={styles.leftMenu}>
            {listMenu.map((item) => {
              const { id, name, component, quantity, link } = item;
              const { selectedId } = this.state;
              return (
                <div key={id}>
                  <MenuItem
                    selectedId={selectedId}
                    id={id}
                    name={name}
                    component={component}
                    quantity={quantity}
                    link={link}
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
export default connect(
  ({ info, user: { permissions = {} } = {}, candidateInfo: { data = {} } = {} }) => ({
    info,
    data,
    permissions,
  }),
)(OnboardingLayout);
