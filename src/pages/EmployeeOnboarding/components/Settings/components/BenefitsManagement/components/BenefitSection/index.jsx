import React, { Component } from 'react';
import { Button, Select, Spin } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

const { Option } = Select;
@connect(({ country: { listCountry = [] } = {}, loading }) => ({
  listCountry,
  loadingFetchCountry: loading.effects['country/fetchListCountry'],
}))
class BenefitSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'country/fetchListCountry',
    });
  };

  render() {
    const { listCountry = [], loadingFetchCountry } = this.props;
    if (loadingFetchCountry)
      return (
        <div className={styles.loadingSpin}>
          <Spin />
        </div>
      );
    return (
      <div className={styles.benefitSection}>
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

          <div className={styles.benefitRoot__form}>
            <div className={styles.benefitRoot__form__text}>Choose Location</div>
            <div className={styles.benefitRoot__form__selectCountry}>
              <Select
                showSearch
                showArrow
                allowClear
                loading={loadingFetchCountry}
                placeholder="Select location"
                onChange={this.onChangeSelect}
                filterOption={(input, option) => {
                  return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {listCountry.map((item) => (
                  <Option value={item._id}>
                    <img
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        marginRight: '8px',
                      }}
                      src={item.flag}
                      alt="flag"
                    />
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BenefitSection;
