import React, { Component } from 'react';
import { Row, Col, Menu, Select } from 'antd';
import { connect } from 'umi';
import Regulations from './components/Regulations';
import Categories from './components/Categories';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    policiesRegulations: { listCategory = [], countryList = [] } = {},
    user: {
      permissions = {},
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
      } = {},
    },
  }) => ({
    loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
    listCategory,
    countryList,
    countryID,
    permissions,
  }),
)
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  componentDidMount() {
    const { dispatch, countryID = '' } = this.props;
    dispatch({
      type: 'policiesRegulations/getCountryListByCompany',
      payload: {
        tenantIds: [getCurrentTenant()],
        company: getCurrentCompany(),
      },
    });
    dispatch({
      type: 'policiesRegulations/saveOrigin',
      payload: {
        selectedCountry: countryID,
      },
    });
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/saveOrigin',
      payload: {
        selectedCountry: '',
      },
    });
  };

  handleChange = (key) => {
    this.setState({ content: key });
  };

  getContent = () => {
    const { content } = this.state;
    if (content === 'regulations') {
      return <Regulations />;
    }
    return <Categories />;
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;
    let countryArr = [];
    if (countryList.length > 0) {
      countryArr = countryList.map((item) => {
        return item.headQuarterAddress.country;
      });
    }
    const newArr = this.removeDuplicate(countryArr, (item) => item._id);

    let flagUrl = '';

    const flagItem = (id) => {
      newArr.forEach((item) => {
        if (item._id === id) {
          flagUrl = item.flag;
        }
        return flagUrl;
      });

      return (
        <div
          style={{
            maxWidth: '16px',
            height: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '12px',
          }}
        >
          <img
            src={flagUrl}
            alt="flag"
            style={{
              width: '100%',
              borderRadius: '50%',
              height: '100%',
            }}
          />
        </div>
      );
    };
    return (
      <>
        {newArr.map((item) => (
          <Option key={item._id} value={item._id} className={styles.optionCountry}>
            <div className={styles.labelText}>
              {flagItem(item._id)}
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{item.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  changeCountry = async (value) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'policiesRegulations/saveOrigin',
      payload: {
        selectedCountry: value,
      },
    });
    await dispatch({
      type: 'policiesRegulations/fetchListPolicy',
      payload: { country: [value], tenantId: getCurrentTenant() },
    });
    await dispatch({
      type: 'policiesRegulations/fetchListCategory',
      payload: { country: [value], tenantId: getCurrentTenant() },
    });
  };

  render() {
    const { countryID = '' } = this.props;
    return (
      <PageContainer>
        <Row className={styles.Settings}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>Settings</div>
              <div className={styles.header__location}>
                <Select
                  defaultValue={countryID}
                  size="large"
                  placeholder="Please select country"
                  showArrow
                  filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                  className={styles.selectCountry}
                  onChange={(value) => this.changeCountry(value)}
                >
                  {this.renderCountry()}
                </Select>
              </div>
            </div>
          </Col>
          <Col span={24} />
          <Col span={24}>
            <div className={styles.containerPolicies}>
              <Row>
                <Col span={5}>
                  <div className={styles.setttingsTabs}>
                    <Menu
                      defaultSelectedKeys={['category']}
                      onClick={(e) => this.handleChange(e.key)}
                    >
                      <Menu.Item key="category">Policies Categories</Menu.Item>
                      <Menu.Item key="regulations">Policies & Regulations</Menu.Item>
                    </Menu>
                  </div>
                </Col>
                <Col span={19}>{this.getContent()}</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}
export default Settings;
