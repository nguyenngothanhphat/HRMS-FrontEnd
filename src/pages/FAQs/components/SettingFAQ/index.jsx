import React, { PureComponent } from 'react';
import { Row, Col, Menu, Select, Skeleton } from 'antd';
import { connect } from 'umi';
import FaqCategory from './components/FaqCategory';
import ListQuestionAnswer from './components/ListQuestionAnswer';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const { Option } = Select;

@connect(
  ({
    loading,
    faqs: { countryList = [], selectedCountry = '' } = {},
    user: {
      permissions = {},
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
      } = {},
    },
  }) => ({
    loadingGetListCountry: loading.effects['faqs/fetchListLocationEffect'],
    countryList,
    countryID,
    permissions,
    selectedCountry,
  }),
)
class Settings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: 'category',
    };
  }

  componentDidMount = () => {
    const { dispatch, countryID = '' } = this.props;
    dispatch({
      type: 'faqs/fetchListLocationEffect',
      payload: {
        tenantIds: [getCurrentTenant()],
        company: getCurrentCompany(),
      },
    }).then(() => {
      dispatch({
        type: 'faqs/save',
        payload: {
          selectedCountry: countryID,
        },
      });
    });
  };

  handleChange = (key) => {
    this.setState({ content: key });
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;
    let countryArr = [];
    if (countryList.length > 0) {
      countryArr = countryList.map((item) => {
        return item.headQuarterAddress?.country;
      });
    }
    const newArr = this.removeDuplicate(countryArr, (item) => item?._id);

    let flagUrl = '';

    const flagItem = (id) => {
      newArr.forEach((item) => {
        if (item?._id === id) {
          flagUrl = item?.flag;
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
          <Option key={item?._id} value={item?._id} className={styles.optionCountry}>
            <div className={styles.labelText}>
              {flagItem(item?._id)}
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{item?.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  changeCountry = async (value) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'faqs/save',
      payload: {
        selectedCountry: value,
      },
    });
  };

  render() {
    const { selectedCountry = '', loadingGetListCountry = false } = this.props;
    const getContent = () => {
      const { content } = this.state;
      if (loadingGetListCountry)
        return (
          <div style={{ padding: 24 }}>
            <Skeleton />
          </div>
        );
      if (content === 'category') {
        return <FaqCategory />;
      }
      return <ListQuestionAnswer />;
    };

    return (
      <PageContainer>
        <div className={styles.SettingFAQ}>
          <div className={styles.header}>
            <div className={styles.header__left}>Settings</div>
            <div className={styles.header__location}>
              <Select
                value={selectedCountry}
                size="large"
                placeholder="Please select the country"
                showArrow
                loading={loadingGetListCountry}
                disabled={loadingGetListCountry}
                filterOption={(input, option) => {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                className={styles.selectCountry}
                onChange={this.changeCountry}
              >
                {this.renderCountry()}
              </Select>
            </div>
          </div>

          <div className={styles.containerPolicies}>
            <Row>
              <Col span={5}>
                <div className={styles.settingTabs}>
                  <Menu
                    defaultSelectedKeys={['category']}
                    onClick={(e) => this.handleChange(e.key)}
                  >
                    <Menu.Item key="category">FAQ Categories</Menu.Item>
                    <Menu.Item key="faqList">FAQ List</Menu.Item>
                  </Menu>
                </div>
              </Col>

              <Col span={19}>{getContent()}</Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}
export default Settings;
