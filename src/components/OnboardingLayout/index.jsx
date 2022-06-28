import React, { PureComponent } from 'react';

import { Button, Col, Row } from 'antd';
import { formatMessage, connect, history } from 'umi';

import Draft from '@/pages/Onboarding/components/OnboardingOverview/components/Draft';
import OnboardingAll from '@/pages/Onboarding/components/OnboardingOverview/components/All';
import ProfileVerification from '@/pages/Onboarding/components/OnboardingOverview/components/ProfileVerification';
import DocumentVerification from '@/pages/Onboarding/components/OnboardingOverview/components/DocumentVerification';
import WithdrawnOffers from '@/pages/Onboarding/components/OnboardingOverview/components/WithdrawnOffers';
import RejectedOffers from '@/pages/Onboarding/components/OnboardingOverview/components/RejectedOffers';
import OfferAccepted from '@/pages/Onboarding/components/OnboardingOverview/components/OfferAccepted';
import OfferReleased from '@/pages/Onboarding/components/OnboardingOverview/components/OfferReleased';
import SalaryNegotiation from '@/pages/Onboarding/components/OnboardingOverview/components/SalaryNegotiation';
import AwaitingApprovals from '@/pages/Onboarding/components/OnboardingOverview/components/AwaitingApprovals';
import NeedsChanges from '@/pages/Onboarding/components/OnboardingOverview/components/NeedsChanges';
import DocumentCheckList from '@/pages/Onboarding/components/OnboardingOverview/components/DocumentCheckList';
import Joined from '@/pages/Onboarding/components/OnboardingOverview/components/Joined';
import ReferenceVerification from '@/pages/Onboarding/components/OnboardingOverview/components/ReferenceVerification';

import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import MenuItem from './components/MenuItem';

import styles from './index.less';

const getComponent = (name) => {
  switch (name) {
    case 'All': // flow 1
      return <OnboardingAll />;
    case 'Drafts': // 2
      return <Draft />;
    case 'ProfileVerification': // 3
      return <ProfileVerification />;
    case 'DocumentVerification': // 4
      return <DocumentVerification />;
    case 'ReferenceVerification': // 5
      return <ReferenceVerification />;
    case 'SalaryNegotiation': // 5
      return <SalaryNegotiation />;
    case 'AwaitingApprovals': // 6
      return <AwaitingApprovals />;
    case 'NeedsChanges': // 6
      return <NeedsChanges />;
    case 'OfferReleased': // 7
      return <OfferReleased />;
    case 'OfferAccepted': // 8
      return <OfferAccepted />;
    case 'RejectedOffers': // 9
      return <RejectedOffers />;
    case 'DocumentCheckList': // 10
      return <DocumentCheckList />;
    case 'Joined':
      return <Joined />;
    default:
      // 10
      return <WithdrawnOffers />;
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
  }

  componentDidMount() {
    this.fetchTab();
  }

  componentDidUpdate(prevProps) {
    const { dispatch, tabName = 'all' } = this.props;
    if (prevProps.data._id) {
      dispatch({
        type: 'newCandidateForm/save',
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
    const { listMenu = [], tabName = 'all' } = this.props;
    const findTab = listMenu.find((menu) => menu.link === tabName) || listMenu[0];

    const firstComponent = findTab.component;
    this.setState({
      pageTitle: findTab.name,
      selectedId: findTab.id,
      displayComponent: getComponent(firstComponent),
    });
  };

  handleClick = (item) => {
    const { link = '' } = item;
    history.push(`/onboarding/list/${link}`);
  };

  handleAddBtn = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newCandidateForm/fetchCandidateInfo',
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
        <Row>
          <Col lg={6} xl={5}>
            <div className={styles.viewLeft}>
              {checkPermissionAddTeamMember && (
                <div className={styles.buttonContainer}>
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
                </div>
              )}

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
          </Col>
          <Col lg={18} xl={19}>
            <div className={styles.viewRight}>
              {/* <p className={styles.pageTitle}>{pageTitle}</p> */}
              {displayComponent}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  ({ loading, info, user: { permissions = {} } = {}, newCandidateForm: { data = {} } = {} }) => ({
    info,
    data,
    permissions,
    loadingAddTeamMember:
      loading.effects['info/fetchCandidateInfo'] ||
      loading.effects['newCandidateForm/fetchCandidateInfo'],
  }),
)(OnboardingLayout);
