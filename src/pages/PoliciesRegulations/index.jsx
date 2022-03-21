import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Polices from './components/Policies';
import styles from './index.less';
import PoliciesCertification from '@/pages/PoliciesRegulations/components/PoliciesCertification';

@connect(({ user: { permissions = {} } = {} }) => ({
  permissions,
}))
class PoliciesRegulations extends PureComponent {
  render() {
    const {
      permissions = {},
      match: { params: { action = '' } = {} },
    } = this.props;

    const viewSetting = permissions.viewSettingPolicy !== -1;
    const isCertify = action === 'certify';

    return (
      <PageContainer>
        <Row className={styles.PoliciesRegulations}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>
                {isCertify ? 'Policies Certification' : 'Policies'}
              </div>
              <div className={styles.header__right}>
                {viewSetting && !isCertify ? (
                  <Button>
                    <Link to="/policies-regulations/settings">
                      <span className={styles.buttonSetting__text}>Settings</span>
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </Col>
          <Col span={24} />
          <Col span={24}>
            <div className={styles.containerPolicies}>
              {isCertify ? <PoliciesCertification /> : <Polices />}
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default PoliciesRegulations;
