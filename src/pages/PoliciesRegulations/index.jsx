import { Button, Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import ExportButton from '@/components/ExportButton';
import { PageContainer } from '@/layouts/layout/src';
import PoliciesCertification from '@/pages/PoliciesRegulations/components/PoliciesCertification';
import { getCurrentLocation } from '@/utils/authority';
import { exportRawDataToCSV } from '@/utils/exportToCsv';
import Polices from './components/Policies';
import styles from './index.less';

@connect(({ user: { permissions = {} }, policiesRegulations }) => ({
  permissions,
  policiesRegulations,
}))
class PoliciesRegulations extends PureComponent {
  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  exportPoliciesCertification = () => {
    const {
      dispatch,
      permissions = {},
      policiesRegulations: { locationList = [] } = {},
    } = this.props;
    const viewAllCountry = permissions.viewPolicyAllCountry !== -1;
    let countryArr = [getCurrentLocation()];
    if (viewAllCountry) {
      countryArr = [...new Set(locationList.map((val) => val?._id))];
    }

    dispatch({
      type: 'policiesRegulations/exportPoliciesCertificationEffect',
      payload: {
        location: countryArr,
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        exportRawDataToCSV(res.data, 'policiesCertificationStatus');
      }
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
                {viewSetting && (
                  <ExportButton
                    onClick={this.exportPoliciesCertification}
                    title="Export Policies Certification"
                  />
                )}
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
