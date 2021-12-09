import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';

import Polices from './components/Policies';
import styles from './index.less';

const HR_MANAGER = 'HR-MANAGER';
const HR_EMPLOYEE = 'HR';
const MANAGER = 'MANAGER';
@connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))
class PoliciesRegulations extends PureComponent {
  componentDidMount() {}

  render() {
    const {
      currentUser: { roles = [] },
    } = this.props;
    const checkRoleHrAndManager =
      roles.includes(HR_MANAGER) || roles.includes(HR_EMPLOYEE) || roles.includes(MANAGER);
    return (
      <PageContainer>
        <Row className={styles.PoliciesRegulations}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>Policies</div>
              <div className={styles.header__right}>
                {checkRoleHrAndManager ? (
                  <Button>
                    <Link to="/policies-regulations/settings">
                      <span className={styles.buttonSetting__text}>Settings</span>
                    </Link>
                  </Button>
                ) : (
                  <div className={styles.buttonSetting}>
                    <span className={styles.buttonSetting__text}>Settings</span>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col span={24} />
          <Col span={24}>
            <div className={styles.containerPolicies}>
              <Polices />
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default PoliciesRegulations;
