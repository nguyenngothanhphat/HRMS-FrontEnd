import React, { Component } from 'react';
import { Button, Spin, notification } from 'antd';
import { connect } from 'umi';

import BenefitSection from './components/BenefitSection';
import styles from './index.less';

@connect(({ loading }) => ({
  loadingFetchCountry: loading.effects['country/fetchListCountry'],
}))
class BenefitPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      countryId: '',
      activeKeyTab: '1',
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'country/fetchListCountry',
    });
  };

  onChangeSelect = (value) => {
    this.setState({ countryId: value });
  };

  openModal = () => {
    const { dispatch } = this.props;
    const { countryId } = this.state;

    if (countryId) {
      dispatch({
        type: 'onboardingSettings/fetchListBenefitDefault',
        payload: {
          country: countryId,
        },
      });
      this.setState({ visible: true });
    } else {
      notification.warning({ message: 'Notification', description: 'Please choose your location' });
    }
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { loadingFetchCountry } = this.props;
    const { visible, activeKeyTab, countryId } = this.state;

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
            <BenefitSection
              activeKeyTab={activeKeyTab}
              onChangeSelect={this.onChangeSelect}
              visible={visible}
              countryId={countryId}
              closeModal={this.closeModal}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BenefitPage;
