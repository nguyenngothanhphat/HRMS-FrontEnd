import React from 'react';
import { Button, Col, Row } from 'antd';
import { connect, formatMessage, history } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import MenuItem from './components/MenuItem';
import styles from './index.less';

const OnboardingLayout = (props) => {
  const {
    loadingAddTeamMember = false,
    permissions = {},
    activeTab = {},
    children,
    dispatch,
    onboarding: { menu: { onboardingOverviewTab: { listMenu = [] } = {} } } = {},
  } = props;

  const checkPermissionAddTeamMember = permissions.addTeamMemberOnboarding !== -1;

  const handleClick = (item) => {
    const { link = '' } = item;
    history.push(`/onboarding/list/${link}`);
  };

  const handleAddBtn = () => {
    dispatch({
      type: 'newCandidateForm/fetchCandidateInfo',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      },
    });
  };

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
                  onClick={handleAddBtn}
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
                return (
                  <div key={id}>
                    <MenuItem
                      selectedId={activeTab?.id}
                      id={id}
                      name={name}
                      component={component}
                      quantity={quantity}
                      link={link}
                      handleClick={handleClick}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
        <Col lg={18} xl={19}>
          <div className={styles.viewRight}>{children}</div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ loading, info, user: { permissions = {} } = {}, onboarding }) => ({
  info,
  permissions,
  onboarding,
  loadingAddTeamMember: loading.effects['newCandidateForm/fetchCandidateInfo'],
}))(OnboardingLayout);
