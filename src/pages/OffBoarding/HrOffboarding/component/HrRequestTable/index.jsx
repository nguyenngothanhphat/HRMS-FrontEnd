import React, { Component } from 'react';
import { Col, Tabs, Row, Button, Input } from 'antd';
import { SearchOutlined, CaretDownOutlined, CloseOutlined } from '@ant-design/icons';
// import { PageContainer } from '@/layouts/layout/src';
// import Icon from '@ant-design/icons';
import { Link, connect } from 'umi';
import filterIcon from '@/assets/offboarding-filter.svg';
import TeamRequest from './TeamRequest';
import MyRequestContent from '../../../components/TabMyRequest';
import styles from './index.less';

@connect(
  ({
    offboarding: {
      listTeamRequest = [],
      totalListTeamRequest = [],
      listOffboarding = [],
      totalList = [],
      hrManager = {},
    } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
  }) => ({
    listOffboarding,
    totalListTeamRequest,
    totalList,
    locationID,
    companyID,
    listTeamRequest,
    hrManager,
  }),
)
class HRrequestTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
    };
  }

  componentDidMount() {
    const { dispatch, locationID } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchListTeamRequest',
      payload: {
        status: 'IN-PROGRESS',
        location: [locationID],
      },
    });
  }

  onPressEnter = ({ target: { value } }) => {
    console.log('enter value: ', value);
  };

  onChangeInput = ({ target: { value } }) => {
    console.log('onChange Input: ', value);
    this.setState({
      q: value,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const {
      listTeamRequest = [],
      totalListTeamRequest = [],
      listOffboarding = [],
      totalList = [],
      hrManager = {},
      locationID = '',
    } = this.props;
    const { q = '' } = this.state;

    const resignationRequest = (
      <div className={styles.searchFilter}>
        <img src={filterIcon} alt="" className={styles.searchFilter__icon} />
        <Input
          value={q}
          size="large"
          placeholder="Search for Ticket numer, resignee, request ..."
          onChange={this.onChangeInput}
          prefix={<SearchOutlined />}
          onPressEnter={this.onPressEnter}
          className={styles.searchFilter__input}
        />
      </div>
    );

    return (
      <Row className={styles.hrContent}>
        <Col span={24}>
          <div className={styles.header}>
            <div className={styles.header__left}>Team Requests</div>
            <div className={styles.header__right}>
              <Button className={styles.buttonRequest}>
                <Link to="offboarding/resignation-request">
                  <span className={styles.buttonRequest__text}>Initiate Resignation Request</span>
                </Link>
              </Button>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            tabBarExtraContent={resignationRequest}
          >
            <TabPane tab="Team Requests" key="1">
              <div className={styles.tableTab}>
                <TeamRequest
                  data={listTeamRequest}
                  countdata={totalListTeamRequest}
                  hrManager={hrManager}
                  location={[locationID]}
                />
              </div>
            </TabPane>
            <TabPane tab="My Requests" key="2">
              <div className={styles.tableTab}>
                <MyRequestContent
                  data={listOffboarding}
                  countdata={totalList}
                  hrManager={hrManager}
                />
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

export default HRrequestTable;
