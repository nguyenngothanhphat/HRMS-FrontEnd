import React, { Component } from 'react';
import { Row, Col, Menu } from 'antd';
import { connect } from 'umi';
import Regulations from './components/Regulations';
import Categories from './components/Categories';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
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
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/getCountryListByCompany',
      payload: {
        tenantIds: [getCurrentTenant()],
        company: getCurrentCompany(),
      },
    });
  }

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

  render() {
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
