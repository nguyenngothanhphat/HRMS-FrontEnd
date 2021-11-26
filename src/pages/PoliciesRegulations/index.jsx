import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';

import Polices from './components/Policies';
import styles from './index.less';

@connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))
class PoliciesRegulations extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <PageContainer>
        <Row className={styles.PoliciesRegulations}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>Policies</div>
              <div className={styles.header__right}>
                <Button className={styles.buttonSetting}>
                  {/** cần sửa lại  */}
                  <Link to="/policies-regulations/settings">
                    <span className={styles.buttonSetting__text}>Settings</span>
                  </Link>
                </Button>
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
