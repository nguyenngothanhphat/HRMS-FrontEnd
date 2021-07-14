import React, { Component } from 'react';
import { Col, Tabs, Row, Button } from 'antd';
import { Link, connect } from 'umi';
import { debounce } from 'lodash';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import TeamRequest from './TeamRequest';
import MyRequestContent from '../../../components/TabMyRequest';
import TableSearch from './TableSearch';
import styles from './index.less';

@connect(
  ({
    offboarding: {
      listTeamRequest = [],
      listAllRequest = [],
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
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    listOffboarding,
    totalListTeamRequest,
    totalList,
    locationID,
    companyID,
    listTeamRequest,
    listAllRequest,
    hrManager,
    listLocationsByCompany,
  }),
)
class HRrequestTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTeamRequest: [],
      dataListAll: [],
      loadingSearch: false,
      timezoneList: [],
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        dataListAll: query,
        dataListTeamRequest: query,
        loadingSearch: false,
      });
    }, 1000);
  }

  componentDidMount() {
    const { dispatch, locationID, listTeamRequest = [], listAllRequest = [] } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchListAllRequest',
      payload: {
        location: [locationID],
      },
    });

    this.fetchTimezone();
    if (listTeamRequest.length > 0) this.updateData(listTeamRequest, 1);
    if (listAllRequest.length > 0) this.updateData(listAllRequest, 2);
  }

  componentDidUpdate(prevProps) {
    const { listTeamRequest = [], listAllRequest = [], listLocationsByCompany = [] } = this.props;
    if (JSON.stringify(listTeamRequest) !== JSON.stringify(prevProps.listTeamRequest)) {
      this.updateData(listTeamRequest, 1);
    }
    if (JSON.stringify(listAllRequest) !== JSON.stringify(prevProps.listAllRequest)) {
      this.updateData(listAllRequest, 2);
    }
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchTimezone();
    }
  }

  fetchTimezone = () => {
    const { listLocationsByCompany = [] } = this.props;
    const timezoneList = [];
    listLocationsByCompany.forEach((location) => {
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
        dataListAll: list,
      });
    }
  };

  onSearch = (value) => {
    const { listTeamRequest = [] } = this.props;
    const formatValue = value.toLowerCase();

    const filterData = listTeamRequest.filter((item) => {
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
      )
        return item;
      return 0;
    });
    this.setState({ loadingSearch: true });

    this.setDebounce(filterData);
  };

  render() {
    const { TabPane } = Tabs;
    const {
      totalListTeamRequest = [],
      listOffboarding = [],
      totalList = [],
      hrManager = {},
      locationID = '',
    } = this.props;

    const { dataListTeamRequest, dataListAll, loadingSearch, timezoneList } = this.state;

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
            tabBarExtraContent={<TableSearch onSearch={this.onSearch} />}
          >
            <TabPane tab="Team Requests" key="1">
              <div className={styles.tableTab}>
                <TeamRequest
                  data={dataListTeamRequest}
                  dataAll={dataListAll}
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
