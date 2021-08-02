import React, { Component } from 'react';
import { Tabs, Select } from 'antd';
import { connect } from 'umi';

import styles from './index.less';
import HealthWellbeing from '../HealthWellbeing';

const { TabPane } = Tabs;
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

  render() {
    const { loadingFetchCountry, listCountry = [], onChangeSelect = () => {} } = this.props;

    return (
      <div className={styles.benefitSection}>
        <div className={styles.locationSelection}>
          <div className={styles.locationSelection__text}>Choose Location</div>
          <div className={styles.locationSelection__selectCountry}>
            <Select
              showSearch
              showArrow
              allowClear
              loading={loadingFetchCountry}
              placeholder="Select location"
              onChange={onChangeSelect}
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="Health & Wellbeing" key="1">
            <HealthWellbeing />
          </TabPane>
          <TabPane tab="Financial Wellbeing" key="2">
            Financial Wellbeing
          </TabPane>
          <TabPane tab="Health & Wellbeing" key="3">
            Health & Wellbeing 3
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default BenefitSection;
