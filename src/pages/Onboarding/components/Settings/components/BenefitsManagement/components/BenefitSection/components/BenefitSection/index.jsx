import React, { Component } from 'react';
import { Tabs, Select, Button } from 'antd';
import { connect } from 'umi';

import { getCurrentLocation } from '@/utils/authority';
import styles from './index.less';
import HealthWellbeing from '../HealthWellbeing';
import ModalAddBenefit from '../ModaAddBenefit';

const { TabPane } = Tabs;
const { Option } = Select;

@connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    country: { listCountry = [] } = {},
    onboardingSettings: { listBenefit = [] } = {},
    loading,
  }) => ({
    listCountry,
    listBenefit,
    listLocationsByCompany,
    loadingFetchCountry: loading.effects['country/fetchListCountry'],
  }),
)
class BenefitSection extends Component {
  constructor(props) {
    super(props);
    const { activeKeyTab } = this.props;
    this.state = { countryId: '', activeKey: activeKeyTab };
  }

  componentDidMount = () => {
    this.initGetCountryId();
  };

  initGetCountryId = () => {
    const { listLocationsByCompany = [], onChangeSelect = () => {} } = this.props;
    let countryId = '';

    listLocationsByCompany.forEach((item) => {
      if (item._id === getCurrentLocation()) {
        const { headQuarterAddress: { country = {} || {} } = {} || {} } = item;
        countryId = country._id;
      }
    });

    if (countryId) {
      onChangeSelect(countryId);
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

  handleClick = (action) => {
    const { activeKey } = this.state;
    if (action === 'next' && +activeKey <= 3) {
      this.setState({ activeKey: `${+activeKey + 1}` });
    } else {
      this.setState({ activeKey: `${+activeKey - 1}` });
    }
  };

  onChangeTab = (value) => {
    this.setState({ activeKey: value });
  };

  render() {
    const {
      loadingFetchCountry,
      listCountry = [],
      listBenefit = [],
      visible = false,
      countryId: countryIdProps = '',
      closeModal = () => {},
    } = this.props;
    const { countryId, activeKey } = this.state;

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
        <Tabs activeKey={activeKey} onChange={this.onChangeTab}>
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
        <div
          style={listBenefit.length === 0 ? { display: 'none' } : {}}
          className={styles.benefitSection__bottom}
        >
          {activeKey === '1' ? null : (
            <Button
              onClick={() => this.handleClick('previous')}
              className={`${styles.benefitSection__bottom_btn} ${styles.previousBtn}`}
            >
              Previous
            </Button>
          )}
          {activeKey === '3' ? null : (
            <Button
              onClick={() => this.handleClick('next')}
              className={`${styles.benefitSection__bottom_btn} ${styles.nextBtn}`}
            >
              Next
            </Button>
          )}
        </div>
        <ModalAddBenefit
          activeKeyTab={activeKey}
          visible={visible}
          countryId={countryIdProps}
          handleCandelModal={closeModal}
        />
      </div>
    );
  }
}

export default BenefitSection;
