import { Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import RequestScopeTabs from './components/RequestScopeTabs';
import styles from './index.less';
import { TIMEOFF_STATUS } from '@/utils/timeOff';

const { TabPane } = Tabs;
const { IN_PROGRESS, ON_HOLD } = TIMEOFF_STATUS;

const ManagerRequestTable = (props) => {
  const [leaveRequests, setLeaveRequests] = useState(0);
  const [specialLeaveRequests, setSpecialLeaveRequests] = useState(0);
  const [lwpRequests, setLWPRequests] = useState(0);
  const [wfhcpRequests, setWfhcpRequests] = useState(0);
  const [category, setCategory] = useState('ALL');

  const {
    dispatch,
    timeOff: {
      currentLeaveTypeTab = '',
      yourTimeOffTypes = {},
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
    } = {},
    loadingTimeOffType = false,
    eligibleForCompOff = false,
  } = props;

  const handleProgress = () => {
    const typeA = [];
    const typeB = [];
    const typeC = [];
    const typeD = [];

    // Get all ID and Seperated ID follow type

    const leavesTemp = [...commonLeaves, ...specialLeaves];

    const typeId = leavesTemp.map((item) => {
      switch (item.type) {
        case 'A':
          typeA.push(item._id);
          break;
        case 'B':
          typeB.push(item._id);
          break;
        case 'C':
          typeC.push(item._id);
          break;
        case 'D':
          typeD.push(item._id);
          break;
        default:
          break;
      }
      return item._id;
    });

    //

    const newCount = (items) => {
      const arrayId = items.map((item) => item?.type?._id);
      const typeALengthTemp = arrayId.filter((i) => typeA.includes(i)).length;
      const typeBLengthTemp = arrayId.filter((i) => typeB.includes(i)).length;
      const typeCLengthTemp = arrayId.filter((i) => typeC.includes(i)).length;
      const typeDLengthTemp = arrayId.filter((i) => typeD.includes(i)).length;

      setLeaveRequests(typeALengthTemp);
      setSpecialLeaveRequests(typeCLengthTemp);
      setLWPRequests(typeBLengthTemp);
      setWfhcpRequests(typeDLengthTemp);
    };

    // get all timeoff id by status IN_PROGRESS,ON_HOLD

    let typeAPI = '';
    switch (category) {
      case 'MY':
        typeAPI = 'timeOff/fetchLeaveRequestOfEmployee';
        break;
      case 'TEAM':
        typeAPI = 'timeOff/fetchTeamLeaveRequests';
        break;
      case 'ALL':
        typeAPI = 'timeOff/fetchAllLeaveRequests';
        break;
      default:
        break;
    }

    dispatch({
      type: typeAPI,
      payload: {
        status: [IN_PROGRESS, ON_HOLD],
        type: typeId,
        page: 1,
      },
    }).then((res) => {
      const { data: { items = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        newCount(items);
      }
    });
  };

  const saveCurrentTypeTab = (type) => {
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: String(type),
        currentFilterTab: '1',
      },
    });
    let arr = [];
    switch (type) {
      case '1':
        arr = commonLeaves.filter((x) => x.type === 'A');
        break;
      case '2':
        arr = specialLeaves.filter((x) => x.type === 'C');
        break;
      case '3':
        arr = commonLeaves.filter((x) => x.type === 'B');
        break;
      case '4':
        arr = specialLeaves.filter((x) => x.type === 'D');
        break;
      default:
        arr = [];
        break;
    }
    arr = arr.map((item) => item._id);
    dispatch({
      type: 'timeOff/saveFilter',
      payload: {
        type: arr,
      },
    });
    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: 1,
      },
    });
  };

  useEffect(() => {
    saveCurrentTypeTab('1');
    handleProgress();
  }, [JSON.stringify(yourTimeOffTypes)]);

  useEffect(() => {
    handleProgress();
  }, [category]);

  const renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  const addZeroToNumber = (number) => {
    if (number === 0) return 0;
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  return (
    <div className={styles.ManagerRequestTable}>
      <Spin spinning={loadingTimeOffType}>
        <Tabs
          tabPosition="left"
          // tabBarGutter={40}
          activeKey={currentLeaveTypeTab}
          tabBarExtraContent={renderTableTitle}
          onTabClick={(activeKey) => saveCurrentTypeTab(activeKey)}
          destroyInactiveTabPane
        >
          <>
            <TabPane tab={`Leave Requests (${addZeroToNumber(leaveRequests)})`} key="1">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                setCategory={setCategory}
                tab={1}
                tabName="Leave Requests"
                type={1}
              />
            </TabPane>
            <TabPane
              tab={`Special Leave Requests (${addZeroToNumber(specialLeaveRequests)})`}
              key="2"
            >
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                setCategory={setCategory}
                tab={2}
                tabName="Special Leave Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`LWP Requests (${addZeroToNumber(lwpRequests)})`} key="3">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                setCategory={setCategory}
                tab={3}
                tabName="LWP Requests"
                type={1}
              />
            </TabPane>
            <TabPane tab={`WFH/CP Requests (${addZeroToNumber(wfhcpRequests)})`} key="4">
              <RequestScopeTabs
                saveCurrentTypeTab={saveCurrentTypeTab}
                setCategory={setCategory}
                tab={4}
                tabName="WFH/CP Requests"
                type={1}
              />
            </TabPane>
            {eligibleForCompOff && (
              <TabPane tab="Compoff Requests" key="5">
                <RequestScopeTabs
                  saveCurrentTypeTab={saveCurrentTypeTab}
                  tab={5}
                  tabName="Compoff Requests"
                  type={2}
                />
              </TabPane>
            )}
          </>
        </Tabs>
      </Spin>
    </div>
  );
};

export default connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingTimeOffType: loading.effects['timeOff/fetchTimeOffTypeByEmployeeEffect'],
}))(ManagerRequestTable);
