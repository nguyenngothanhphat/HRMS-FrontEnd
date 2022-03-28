import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Polices from './components/Policies';
import styles from './index.less';
import PoliciesCertification from '@/pages/PoliciesRegulations/components/PoliciesCertification';
import ExportButton from '@/components/ExportButton';
import { getCurrentLocation } from '@/utils/authority';

@connect(({ user: { permissions = {} } = {}, policiesRegulations }) => ({
  permissions,
  policiesRegulations,
}))
class PoliciesRegulations extends PureComponent {
  downloadFile = (fileName, urlData) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/text;charset=utf-8,%EF%BB%BF${encodeURI(urlData)}`);
    element.setAttribute('download', fileName);
    element.click();
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  exportPoliciesCertification = () => {
    const {
      dispatch,
      permissions = {},
      policiesRegulations: { countryList = [] } = {},
    } = this.props;
    const viewAllCountry = permissions.viewPolicyAllCountry !== -1;
    let countryArr = [getCurrentLocation()];
    if (viewAllCountry) {
      countryList.map((item) => {
        return item.headQuarterAddress?.country;
      });
      const newArr = this.removeDuplicate(countryArr, (item) => item?._id);
      countryArr = [...new Set(newArr.map((val) => val?._id))];
    }

    dispatch({
      type: 'policiesRegulations/exportPoliciesCertificationEffect',
      payload: {
        location: countryArr,
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        this.downloadFile('policiesCertificationStatus.csv', res.data);
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
