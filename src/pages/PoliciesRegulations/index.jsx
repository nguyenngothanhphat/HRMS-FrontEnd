import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';

import Polices from './components/Policies';
import styles from './index.less';

@connect(({ user: { permissions = {} } = {} }) => ({
  permissions,
}))
class PoliciesRegulations extends PureComponent {
  componentDidMount() {}

  render() {
    const { permissions = {} } = this.props;
    const viewSetting = permissions.viewSettingPolicy !== -1;
    return (
      <PageContainer>
        <Row className={styles.PoliciesRegulations}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>Policies</div>
              <div className={styles.header__right}>
                {viewSetting ? (
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
              <Polices />
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default PoliciesRegulations;
