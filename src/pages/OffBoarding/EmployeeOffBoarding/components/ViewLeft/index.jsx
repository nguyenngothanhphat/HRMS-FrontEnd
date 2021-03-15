import React, { Component, Fragment } from 'react';
import { Button, Tabs } from 'antd';
import { Link, connect } from 'umi';
// import icon from '@/assets/offboarding-flow.svg';
import TableAssigned from '@/components/TableAssigned';
import ViewTable from './ViewTable';
import TabDrafts from './TableEmployee';
import styles from './index.less';

@connect()
class ViewLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
    };
  }

  componentDidMount() {
    this.initDataTable('1');
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { tabId } = this.state;
    const { tabId: nextTabId } = nextState;
    if (tabId !== nextTabId) {
      this.initDataTable(nextTabId);
    }
    return true;
  }

  initDataTable = (tabId) => {
    const { dispatch } = this.props;
    if (tabId === '1') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'IN-PROGRESS',
        },
      });
    }
    if (tabId === '2') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'DRAFT',
        },
      });
    }
  };

  callback = (key) => {
    this.setState({
      tabId: key,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const { data = [], countdata = [], hrManager = {} } = this.props;
    // const checkInprogress = countdata.find(({ _id }) => _id === 'IN-PROGRESS') || {};
    // const checkAccepted = countdata.find(({ _id }) => _id === 'ACCEPTED') || {};

    // const checkSendRequest = checkInprogress.count > 0 || checkAccepted.count > 0;
    return (
      <div className={styles.Container}>
        {/* <div className={styles.title_Box}>
          <img src={icon} alt="iconCheck" className={styles.icon} />
          <span className={styles.title_Text}>
            Super six years with us. Thank you. We are indebted by your contribution to our company
            and clients all this while.
            <div>
              This is not the end we like to see.{' '}
              <span style={{ color: 'blue' }}> Request for feedback?</span>
            </div>
          </span>
        </div>
        {!checkSendRequest && (
          <>
            <div className={styles.subTitle_Text}>
              But, if you have made your mind then lets get to it.
            </div>
            <Button className={styles.submitButton}>
              <Link to="/offboarding/resignation-request">Set a resignation request</Link>
            </Button>
          </>
        )} */}

        <div className={styles.headerTerminate}> 
          <div className={styles.leftSection}>
            <div className={styles.leftSection__title}> 
              Super six years with us. Thank you.
            </div>
            <div className={styles.leftSection__content}> 
              We are indebted by your contribution to our company and clients all this while. This is not the end we like to see.
            </div>
            <a href='#' className={styles.leftSection__linkRequest}>Request for feedback?</a>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.rightSection__bg} />
          </div>
        </div>

        <div>
          <Tabs defaultActiveKey="1" className={styles.tabComponent} onTabClick={this.callback}>
            <TabPane tab="Send Request" key="1">
              <ViewTable data={data} countTable={countdata} hrManager={hrManager} />
            </TabPane>
            <TabPane tab="Drafts" key="2">
              <div className={styles.marrinTop}>
                <TabDrafts data={data} textEmpty="No draft saved" />
              </div>
            </TabPane>
            <TabPane tab="Assigned" key="3">
              <div className={styles.marrinTop}>
                <TableAssigned />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ViewLeft;
