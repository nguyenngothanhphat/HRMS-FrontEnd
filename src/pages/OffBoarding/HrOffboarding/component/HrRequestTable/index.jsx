import React, { Component } from 'react';
import { Col, Tabs, Row, Button } from 'antd';
import { Link, connect } from 'umi';
import { debounce } from 'lodash';

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
      dataListTeamRequest: [],
      loadingSearch: false,
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
        status: 'IN-PROGRESS',
        location: [locationID],
      },
    });

    if (listTeamRequest.length > 0) this.updateData(listTeamRequest);
  }

  componentDidUpdate(prevProps) {
    const { listTeamRequest = [] } = this.props;
    if (JSON.stringify(listTeamRequest) !== JSON.stringify(prevProps.listTeamRequest)) {
      this.updateData(listTeamRequest);
    }
  }

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
      totalListTeamRequest = [],
      listOffboarding = [],
      totalList = [],
      hrManager = {},
      locationID = '',
    } = this.props;

    const { dataListTeamRequest, loadingSearch } = this.state;

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
                  loadingSearch={loadingSearch}
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
