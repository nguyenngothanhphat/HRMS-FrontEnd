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
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    listOffboarding,
    totalListTeamRequest,
    total,
    totalList,
    locationID,
    companyID,
    listTeamRequest,
    hrManager,
    listLocationsByCompany,
  }),
)
class HRrequestTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTeamRequest: [],
      loadingSearch: false,
      timezoneList: [],
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        dataListTeamRequest: query,
        loadingSearch: false,
      });
    }, 1000);
  }

  componentDidMount() {
    const { dispatch, locationID, listTeamRequest = [] } = this.props;
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
  }

  componentDidUpdate(prevProps) {
    const { listTeamRequest = [], listLocationsByCompany = [] } = this.props;
    if (JSON.stringify(listTeamRequest) !== JSON.stringify(prevProps.listTeamRequest)) {
      this.updateData(listTeamRequest, 1);
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

  updateData = (list) => {
    this.setState({
      dataListTeamRequest: list,
    });
  };

  // onSearch = (value) => {
  //   const { listTeamRequest = [] } = this.props;
  //   const formatValue = value.toLowerCase();

  //   const filterData = listTeamRequest.filter((item) => {
  //     const {
  //       ticketID = '',
  //       employee: { employeeId = '', generalInfo: { firstName = '', lastName = '' } = {} } = {},
  //     } = item;
  //     const formatTicketId = ticketID.toLowerCase();
  //     const fortmatEmployeeID = employeeId.toLowerCase();
  //     const formatFirstName = firstName.toLowerCase();
  //     const formatLastName = lastName.toLowerCase();

  //     if (
  //       formatTicketId.includes(formatValue) ||
  //       fortmatEmployeeID.includes(formatValue) ||
  //       formatFirstName.includes(formatValue) ||
  //       formatLastName.includes(formatValue)
  //     )
  //       return item;
  //     return 0;
  //   });
  //   // this.setState({ loadingSearch: true });

  //   // this.setDebounce(filterData);
  // };

  render() {
    const { TabPane } = Tabs;
    const {
      totalListTeamRequest = [],
      // listTeamRequest = [],
      listOffboarding = [],
      // totalList = [],
      hrManager = {},
      locationID = '',
    } = this.props;

    const { dataListTeamRequest, loadingSearch, timezoneList } = this.state;

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
                  data={listOffboarding}
                  // countdata={totalList}
                  hrManager={hrManager}
                  timezoneList={timezoneList}
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
