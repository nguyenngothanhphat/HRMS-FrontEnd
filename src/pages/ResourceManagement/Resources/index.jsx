import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { debounce } from 'lodash';
import { PageContainer } from '@/layouts/layout/src';
import AllTicket from './components/ResourceList';
import styles from './index.less';
import OverView from '@/pages/ResourceManagement/components/OverView';

const baseModuleUrl = '/resource-management'

@connect(
  ({
    ticketManagement: { listOffAllTicket = [], totalList = [] } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    listOffAllTicket,
    totalList,
    locationID,
    companyID,
    listLocationsByCompany,
  }),
)
class ManagerTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListAllTickets: [],
      loadingSearch: false,
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        dataListAllTickets: query,
        loadingSearch: false,
      });
    }, 1000);
  }

  componentDidMount() {
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`${baseModuleUrl}/all-resources`);
    } else {
      const { dispatch, listOffAllTicket } = this.props;
      if (!dispatch) {
        return;
      }
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          // status: 'New',
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {},
      });
      if (listOffAllTicket.length > 0) this.updateData(listOffAllTicket);
    }
  }

  componentDidUpdate(prevProps) {
    const { listOffAllTicket = [] } = this.props;
    if (JSON.stringify(listOffAllTicket) !== JSON.stringify(prevProps.listOffAllTicket)) {
      this.updateData(listOffAllTicket);
    }
  }

  updateData = (listOffAllTicket) => {
    this.setState({
      dataListAllTickets: listOffAllTicket,
    });
  };

  onSearch = (value) => {
    const { listOffAllTicket = [] } = this.props;
    const formatValue = value.toLowerCase();
    const filterData = listOffAllTicket.filter((item) => {
      const { employeeRaise: { generalInfo: { userId = '', legalName = '' } = {} } = {} } = item;
      const formatUserIDTicket = userId.toLowerCase();
      const formatLegalName = legalName.toLowerCase();
      if (formatUserIDTicket.includes(formatValue) || formatLegalName.includes(formatValue))
        return item;
      return 0;
    });
    this.setState({ loadingSearch: true });
    this.setDebounce(filterData);
  };

  render() {
    const { TabPane } = Tabs;
    const { locationID = '', totalList = [] } = this.props;
    const { dataListAllTickets, loadingSearch } = this.state;

    return (
      <div className={styles.TicketManagement}>
        <PageContainer>
          <Tabs
            activeKey="resource-list"
            onChange={(key) => {
              history.push(`/ticket-management/${key}`);
            }}
          >
            <TabPane tab="OverView" key="overview">
              <OverView /> 
            </TabPane>
            <TabPane tab="Resource List" key="resource-list">
              <AllTicket
                location={[locationID]}
                data={dataListAllTickets}
                loadingSearch={loadingSearch}
                countData={totalList}
              />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default ManagerTicket;
