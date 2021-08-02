import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import { connect } from 'umi';
import BenefitSection from './components/BenefitSection';
import ModalAddBenefit from './components/ModaAddBenefit';

import styles from './index.less';

@connect(({ loading }) => ({
  loadingFetchCountry: loading.effects['country/fetchListCountry'],
}))
class BenefitPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  // componentDidMount = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'country/fetchListCountry',
  //   });
  // };

  openModal = () => {
    this.setState({ visible: true });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { loadingFetchCountry } = this.props;
    const { visible } = this.state;

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
            <Button onClick={this.openModal}>Add a Benefit</Button>
          </div>

          <div className={styles.benefitRoot__bottom}>
            <BenefitSection />
          </div>
        </div>
        <ModalAddBenefit visible={visible} handleCandelModal={this.closeModal} />
      </div>
    );
  }
}

export default BenefitPage;
