import React, { Component } from 'react';
import { Col, Tabs, Row, Button } from 'antd';
import { Link, connect } from 'umi';
import { debounce } from 'lodash';
import { getTimezoneViaCity } from '@/utils/times';
import TeamRequest from './TeamRequest';
import MyRequestContent from '../../../components/TabMyRequest';
import TableSearch from './TableSearch';
import styles from './index.less';

@connect(
  ({
    offboarding: {
      listTeamRequest = [],
      totalListTeamRequest = [],
      listOffboarding = [],
      totalList = [],
      hrManager = {},
      total = '',
    } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
    location: { companyLocationList = [] },
  }) => ({
    listOffboarding,
    totalListTeamRequest,
    total,
    totalList,
    locationID,
    companyID,
    listTeamRequest,
    hrManager,
    companyLocationList,
  }),
)
class HRrequestTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTeamRequest: [],
      dataListMyRequest: [],
      loadingSearch: false,
      timezoneList: [],
      tabId: '1',
    };
    this.setDebounce = debounce((query, key) => {
      if (key === '1') {
        this.setState({
          dataListTeamRequest: query,
          loadingSearch: false,
        });
      } else {
        this.setState({
          dataListMyRequest: query,
          loadingSearch: false,
        });
      }
    }, 1000);
  }

  componentDidMount() {
    const { dispatch, locationID, listTeamRequest = [], listOffboarding = [] } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchListTeamRequest',
      payload: {
        location: [locationID],
      },
    });
    dispatch({
      type: 'offboarding/getListAssigneeHr',
    });

    this.fetchTimezone();
    if (listTeamRequest.length > 0) this.updateData(listTeamRequest, 1);
    if (listOffboarding.length > 0) this.updateData(listOffboarding, 2);
  }

  componentDidUpdate(prevProps) {
    const { listTeamRequest = [], companyLocationList = [], listOffboarding = [] } = this.props;
    if (JSON.stringify(listTeamRequest) !== JSON.stringify(prevProps.listTeamRequest)) {
      this.updateData(listTeamRequest, 1);
    }
    if (JSON.stringify(listOffboarding) !== JSON.stringify(prevProps.listOffboarding)) {
      this.updateData(listOffboarding, 2);
    }
    if (JSON.stringify(prevProps.companyLocationList) !== JSON.stringify(companyLocationList)) {
      this.fetchTimezone();
    }
  }

  fetchTimezone = () => {
    const { companyLocationList = [] } = this.props;
    const timezoneList = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    this.setState({
      timezoneList,
    });
  };

  updateData = (list, key) => {
    if (key === 1) {
      this.setState({
        dataListTeamRequest: list,
      });
    } else {
      this.setState({
        dataListMyRequest: list,
      });
    }
  };

  filterDataSearch = (list, value, tabId) => {
    const formatValue = value.toLowerCase();
    const filterData = list.filter((item) => {
      const {
        ticketID = '',
        employee: { employeeId = '', generalInfo: { firstName = '', lastName = '' } = {} } = {},
      } = item;
      const formatTicketId = ticketID.toLowerCase();
      const fortmatEmployeeID = employeeId.toLowerCase();
      const formatFirstName = firstName.toLowerCase();
      const formatLastName = lastName.toLowerCase();

      if (
        formatTicketId.includes(formatValue) ||
        fortmatEmployeeID.includes(formatValue) ||
        formatFirstName.includes(formatValue) ||
        formatLastName.includes(formatValue)
      ) {
        return item;
      }
      return 0;
    });

    this.setState({ loadingSearch: true });

    this.setDebounce(filterData, tabId);
  };

  onSearch = (value) => {
    const { listTeamRequest = [], listOffboarding = [] } = this.props;
    const { tabId } = this.state;

    if (tabId === '1') {
      this.filterDataSearch(listTeamRequest, value, tabId);
    } else {
      this.filterDataSearch(listOffboarding, value, tabId);
    }
  };

  onChangeTabId = (value) => {
    this.setState({ tabId: value });
  };

  render() {
    const { TabPane } = Tabs;
    const {
      totalListTeamRequest = [],
      // listTeamRequest = [],
      // listOffboarding = [],
      totalList = [],
      hrManager = {},
      locationID = '',
    } = this.props;

    const { dataListTeamRequest, dataListMyRequest, loadingSearch, timezoneList } = this.state;

    return (
      <Row className={styles.hrContent}>
        <Col span={24}>
          <div className={styles.header}>
            <div className={styles.header__left}>Team Requests</div>
            <div className={styles.header__right}>
              <Button className={styles.buttonRequest}>
                <Link to="/offboarding/list/my-request/new">
                  <span className={styles.buttonRequest__text}>Initiate Resignation Request</span>
                </Link>
              </Button>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            onChange={this.onChangeTabId}
            className={styles.tabComponent}
            tabBarExtraContent={<TableSearch onSearch={this.onSearch} />}
          >
            <TabPane tab="Team Requests" key="1">
              <div className={styles.tableTab}>
                <TeamRequest
                  data={dataListTeamRequest}
                  loadingSearch={loadingSearch}
                  countdata={totalListTeamRequest}
                  hrManager={hrManager}
                  location={[locationID]}
                  timezoneList={timezoneList}
                />
              </div>
            </TabPane>
            <TabPane tab="My Requests" key="2">
              <div className={styles.tableTab}>
                <MyRequestContent
                  data={dataListMyRequest}
                  countdata={totalList}
                  hrManager={hrManager}
                  timezoneList={timezoneList}
                  loadingSearch={loadingSearch}
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
