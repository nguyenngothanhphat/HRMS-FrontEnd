import React, { Component } from 'react';
import { Button, Col, Row, Tabs } from 'antd';
import { history, connect, formatMessage } from 'umi';
import { debounce } from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';
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
// const { dispatch, listOffAllTicket } = this.props;
// if (!dispatch) {
//   return;
// }
// dispatch({
//   type: 'ticketManagement/fetchListAllTicket',
//   payload: {
//     // status: 'New',
//   },
// });
// dispatch({
//   type: 'ticketManagement/fetchToTalList',
//   payload: {},
// });
this.dummyData();
// if (listOffAllTicket.length > 0) this.updateData(listOffAllTicket);

    }
  }

  componentDidUpdate() {
    // const { listOffAllTicket = [] } = this.props;
    // if (JSON.stringify(listOffAllTicket) !== JSON.stringify(prevProps.listOffAllTicket)) {
    //   this.updateData(listOffAllTicket);
    // }
    // this.dummyData()
  }

  dummyData = () => {
    const data = []
    for(let i = 1; i <= 100; i+=1) {
      if(i % 15 === 0) {
        const obj = {
        employeeId : (i < 5 ? 1 : i),
        employeeName: `employee ${i}`,
        division: 'division',
        designation: 'designation',
        experience: (Math.random(i) * i).toFixed(1),
        projectName: '',
        utilization: 0,
        startDate: '',
        endDate: ''
      }
      data.push(obj)
      } else if(i < 5) {
      const obj = {
        employeeId : (i < 5 ? 1 : i),
        employeeName: (i < 5 ? 'employee 1' : (`employee ${i}`)),
        division: 'division',
        designation: 'designation',
        billStatus: 'Billed',
        experience: 1,
        projectName: `Project ${Math.floor(Math.random(i) * i)}`,
        utilization: (i < 5 ? 25 : 100),
        startDate: '2021-01-01',
        endDate: '2021-01-01'
      }
      data.push(obj)
      } else if(i > 11 && i < 15) {
      const obj = {
        employeeId : 12,
        employeeName: 'Multiple Project page 2',
        division: 'division',
        designation: 'designation',
        experience: 2,
        projectName: `Project ${Math.floor(Math.random(i) * i)}`,
        utilization: (i < 5 ? 25 : 100),
        startDate: '2021-01-01',
        endDate: '2021-01-01'
      }
      data.push(obj)
      } else {
      const obj = {
        employeeId : i,
        employeeName: `Employee ${ i }`,
        division: 'division',
        designation: 'designation',
        billStatus: 'Bench',
        experience: i< 5? 2: (Math.random(i) * i).toFixed(1),
        projectName: `Project ${Math.floor(Math.random(i) * i)}`,
        utilization: (i < 5 ? 25 : 100),
        startDate: '2021-01-01',
        endDate: '2021-01-01'
      }
      data.push(obj)
      }
      
    }
    this.updateData(data)
  };

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

  renderActionButton = () => {
    return (
      <div className={styles.options}>
        <Row gutter={[24, 0]}>
          <Col>
            <Button
              icon={<DownloadOutlined />}
              className={styles.generate}
              type="Export"
              onClick={this.downloadTemplate}
            >
              {formatMessage({ id: 'component.employeeOnboarding.generate' })}
            </Button>
          </Col>
  
          {/* {tabName === 'settings' && (type === '' || type === 'documents-templates') && (
            <Col>
              <Button
                icon={<UploadOutlined />}
                className={styles.generate}
                type="text"
                onClick={this.onUploadDocument}
              >
                Upload
              </Button>
            </Col>
          )}
          <Col>
            <Button className={styles.view} type="link">
              {formatMessage({ id: 'component.employeeOnboarding.viewActivityLogs' })} (15)
            </Button>
          </Col> */}
        </Row>
      </div>
    );
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
            tabBarExtraContent={this.renderActionButton()}
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
