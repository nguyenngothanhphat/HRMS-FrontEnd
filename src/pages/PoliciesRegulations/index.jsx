import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Polices from './components/Policies';
import styles from './index.less';
import PoliciesCertification from '@/pages/PoliciesRegulations/components/PoliciesCertification';
import ExportButton from '@/components/ExportButton';
import { getCurrentLocation } from '@/utils/authority';

@connect(({ user: { permissions = {} } = {} }) => ({
  permissions,
}))
class PoliciesRegulations extends PureComponent {
  downloadFile = (fileName, urlData) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/text;charset=utf-8,%EF%BB%BF${encodeURI(urlData)}`);
    element.setAttribute('download', fileName);
    element.click();
  };

  exportPoliciesCertification = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/exportPoliciesCertificationEffect',
      payload: {
        location: getCurrentLocation(),
      },
    }).then((res) => {
      this.downloadFile('policiesCertificationStatus.csv', res.data);
    });
  };

  render() {
    const { permissions = {} } = this.props;

    const viewSetting = permissions.viewSettingPolicy !== -1;
    const isCertify = window.location.pathname.includes('certify');

    return (
      <PageContainer>
        <Row className={styles.PoliciesRegulations}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>
                {isCertify ? 'Policies Certification' : 'Policies'}
              </div>
              <div className={styles.header__right}>
                {viewSetting && <ExportButton onClick={this.exportPoliciesCertification} />}
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
