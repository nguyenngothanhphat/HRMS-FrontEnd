import React, { PureComponent } from 'react';

import { Button } from 'antd';
import { formatMessage, connect, history } from 'umi';

import Draft from '@/pages/Onboarding/components/OnboardingOverview/components/Draft';
import OnboardingAll from '@/pages/Onboarding/components/OnboardingOverview/components/All';
import ProfileVerification from '@/pages/Onboarding/components/OnboardingOverview/components/ProfileVerification';

import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import MenuItem from './components/MenuItem';

import styles from './index.less';

const getComponent = (name) => {
  switch (name) {
    case 'All':
      return <OnboardingAll />;
    case 'Drafts':
      return <Draft />;
    default:
      return <ProfileVerification />;
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
    const { dispatch, tabName = 'all' } = this.props;
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
