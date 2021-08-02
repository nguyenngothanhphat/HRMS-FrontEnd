import React, { Component } from 'react';
import { Tabs, Select } from 'antd';
import { connect } from 'umi';

import { getCurrentLocation } from '@/utils/authority';
import styles from './index.less';
import HealthWellbeing from '../HealthWellbeing';

const { TabPane } = Tabs;
const { Option } = Select;

@connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    country: { listCountry = [] } = {},
    loading,
  }) => ({
    listCountry,
    listLocationsByCompany,
    loadingFetchCountry: loading.effects['country/fetchListCountry'],
  }),
)
class BenefitSection extends Component {
  constructor(props) {
    super(props);
    this.state = { countryId: '' };
  }

  componentDidMount = () => {
    this.initGetCountryId();
  };

  initGetCountryId = () => {
    const { listLocationsByCompany = [] } = this.props;
    let countryId = '';

    listLocationsByCompany.forEach((item) => {
      if (item._id === getCurrentLocation()) {
        const { headQuarterAddress: { country = {} || {} } = {} || {} } = item;
        countryId = country._id;
      }
    });

    if (countryId) {
      this.fetchListBenefit(countryId);
      this.setState({ countryId });
    }
  };

  fetchListBenefit = (countryId) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'onboardingSettings/fetchListBenefit',
      payload: { country: countryId },
    });
  };

  onChangeSelectLocation = (value) => {
    const { onChangeSelect = () => {} } = this.props;
    onChangeSelect(value);

    this.fetchListBenefit(value);
  };

  render() {
    const { loadingFetchCountry, listCountry = [], onChangeTab = () => {} } = this.props;
    const { countryId } = this.state;

    let filterListCountry = listCountry.map((item) => {
      if (item._id === 'VN' || item._id === 'IN' || item._id === 'US') {
        return item;
      }

      return null;
    });
    filterListCountry = filterListCountry.filter((item) => item !== null);

    if (!countryId) return null;
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
              defaultValue={countryId}
              placeholder="Select location"
              onChange={this.onChangeSelectLocation}
              filterOption={(input, option) => {
                return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {filterListCountry.map((item) => (
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
        <Tabs defaultActiveKey="1" onChange={onChangeTab}>
          <TabPane tab="Health & Wellbeing" key="1">
            <HealthWellbeing />
          </TabPane>
          <TabPane tab="Financial Wellbeing" key="2">
            Financial Wellbeing
          </TabPane>
          <TabPane tab="Legal" key="3">
            Legal
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default BenefitSection;
