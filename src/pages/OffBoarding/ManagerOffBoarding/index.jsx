/* eslint-disable import/no-cycle */
import React, { Component } from 'react';
import { Col, Tabs, Row, Affix, Button } from 'antd';
import { Link, connect, history } from 'umi';
import { debounce } from 'lodash';
import { PageContainer } from '@/layouts/layout/src';
// import TableAssigned from '@/components/TableAssigned';
import { getTimezoneViaCity } from '@/utils/times';
import TeamRequest from './component/TeamRequest';
import MyRequestContent from '../components/TabMyRequest';
import TableSearch from './component/TableSearch';
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
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    listOffboarding,
    totalList,
    totalListTeamRequest,
    locationID,
    companyID,
    listTeamRequest,
    hrManager,
    listLocationsByCompany,
  }),
)
class ManagerOffBoading extends Component {
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
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`/offboarding/list`);
    } else {
      const { dispatch, listTeamRequest, locationID } = this.props;
      if (!dispatch) {
        return;
      }
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          location: [locationID],
        },
      });

      this.fetchTimezone();
      if (listTeamRequest.length > 0) this.updateData(listTeamRequest);
    }
  }

  componentDidUpdate(prevProps) {
    const { listTeamRequest = [], listLocationsByCompany = [] } = this.props;
    if (JSON.stringify(listTeamRequest) !== JSON.stringify(prevProps.listTeamRequest)) {
      this.updateData(listTeamRequest);
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

  updateData = (listTeamRequest) => {
    this.setState({
      dataListTeamRequest: listTeamRequest,
    });
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
      totalListTeamRequest,
      listOffboarding = [],
      totalList = [],
      hrManager = {},
      locationID = '',
    } = this.props;
    const { dataListTeamRequest, loadingSearch, timezoneList } = this.state;

    const checkInprogress = totalList.find(({ _id }) => _id === 'IN-PROGRESS') || {};
    const checkAccepted = totalList.find(({ _id }) => _id === 'ACCEPTED') || {};

    const checkSendRequest = checkInprogress.count > 0 || checkAccepted.count > 0;

    return (
      <PageContainer>
        <div className={styles.managerContainer}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship / Initiate Resignation Request
              </p>
            </div>
          </Affix>
          <Row className={styles.content}>
            <Col span={24}>
              <div className={styles.content__top}>
                <div className={styles.text}>Team Requests</div>
                <>
                  {!checkSendRequest && (
                    <Button className={styles.btnInitiate}>
                      <Link to="/offboarding/list/my-request/new">
                        <span className={styles.btnText}>Initiate Resignation Request</span>
                      </Link>
                    </Button>
                  )}
                </>
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
                      countdata={totalListTeamRequest}
                      hrManager={hrManager}
                      loadingSearch={loadingSearch}
                      timezoneList={timezoneList}
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
                      timezoneList={timezoneList}
                    />
                  </div>
                </TabPane>
                {/* <TabPane tab="Assigned" key="3">
                  <div style={{ padding: '10px 18px' }}>
                    <TableAssigned />
                  </div>
                </TabPane> */}
              </Tabs>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ManagerOffBoading;
