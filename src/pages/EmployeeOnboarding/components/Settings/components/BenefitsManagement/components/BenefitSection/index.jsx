import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import { connect } from 'umi';
import BenefitSection from './components/BenefitSection';

import styles from './index.less';

@connect(({ loading }) => ({
  loadingFetchCountry: loading.effects['country/fetchListCountry'],
}))
class BenefitPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentDidMount = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'country/fetchListCountry',
  //   });
  // };

  render() {
    const { loadingFetchCountry } = this.props;
    if (loadingFetchCountry)
      return (
        <div className={styles.loadingSpin}>
          <Spin />
        </div>
      );
    return (
      <div className={styles.benefitManagement}>
        <div className={styles.benefitRoot}>
          <div className={styles.benefitRoot__header}>
            <div className={styles.benefitRoot__header__text}>
              <div className={styles.title}>Benefits</div>
              <div className={styles.subTitle}>
                The list of benefits the candidate is eligible for is populated below.
              </div>
            </div>
            <Button>Add a Benefit</Button>
          </div>

          <div className={styles.benefitRoot__bottom}>
            <BenefitSection />
          </div>
        </div>
      </div>
    );
  }
}

export default BenefitPage;
