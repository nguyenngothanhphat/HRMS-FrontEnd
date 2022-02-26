import React, { Component } from 'react';
import { Row, Col, Menu } from 'antd';
import { connect } from 'umi';
import Regulations from './components/Regulations';
import Categories from './components/Categories';
import { PageContainer } from '@/layouts/layout/src';

import styles from './index.less';

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
    const { dispatch, countryID = '', permissions = {}, countryList = [] } = this.props;
    const viewAllCountry = permissions.viewPolicyAllCountry !== -1;
    if (countryList.length > 0) {
      let countryArr = [];
      if (viewAllCountry) {
        countryArr = countryList.map((item) => {
          return item.headQuarterAddress.country;
        });
        const newArr = this.removeDuplicate(countryArr, (item) => item._id);
        countryArr = newArr.map((val) => val._id);
        dispatch({
          type: 'policiesRegulations/fetchListCategory',
          payload: {
            country: countryArr,
          },
        });
      } else {
        dispatch({
          type: 'policiesRegulations/fetchListCategory',
          payload: {
            country: [countryID],
          },
        });
      }
    }
  }

  handleChange = (key) => {
    this.setState({ content: key });
  };

  render() {
    const getContent = () => {
      const { content } = this.state;
      if (content === 'regulations') {
        return <Regulations />;
      }
      return <Categories />;
    };

    return (
      <PageContainer>
        <Row className={styles.Settings}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>Settings</div>
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

                <Col span={19}>{getContent()}</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}
export default Settings;
