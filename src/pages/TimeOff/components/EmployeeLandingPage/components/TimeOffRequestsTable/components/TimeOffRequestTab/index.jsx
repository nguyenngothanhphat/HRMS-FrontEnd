import React, { PureComponent } from 'react';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { connect } from 'umi';
import MyLeaveTable from '../MyLeaveTable';
import MyCompoffTable from '../MyCompoffTable';
import FilterBar from '../FilterBar';
import styles from './index.less';

@connect(({ timeOff, loading, user }) => ({
  loadingFetchLeaveRequests: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
  loadingFetchMyCompoffRequests: loading.effects['timeOff/fetchMyCompoffRequests'],
  timeOff,
  user,
}))
class TimeOffRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formatData: [],
      formatMainTabData: [],
      inProgressLength: 0,
      approvedLength: 0,
      rejectedLength: 0,
      draftLength: 0,
      onHoldLength: 0,
    };
  }

  getDataByType = (requests, key) => {
    if (key === 1)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'A' || type === 'B';
      });

    if (key === 2)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'C';
      });

    if (key === 3)
      return requests.filter((req) => {
        const { type: { type = '', shortType = '' } = {} } = req;
        return type === 'C' && shortType === 'LWP';
      });

    if (key === 4)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'D';
      });

    // compoff requests
    if (key === 5) {
      return requests;
    }

    return [];
  };

  fetchFilteredDataFromServer = (filterTab) => {
    const { dispatch, tab = 0, type: tabType = 0 } = this.props;
    // const { user: { currentUser: { employee: { _id = '' } = {} } = {} } = {} } = this.props;

    let status = '';

    if (tabType === 1) {
      if (filterTab === '1') {
        status = 'IN-PROGRESS';
      }
      if (filterTab === '2') {
        status = 'ACCEPTED';
      }
      if (filterTab === '3') {
        status = 'REJECTED';
      }
      if (filterTab === '4') {
        status = 'DRAFTS';
      }
      if (filterTab === '5') {
        status = 'ON-HOLD';
      }
    } else if (tabType === 2) {
      // compoff
      if (filterTab === '1') {
        status = ['IN-PROGRESS-NEXT', 'IN-PROGRESS'];
      }
      if (filterTab === '2') {
        status = ['ACCEPTED'];
      }
      if (filterTab === '3') {
        status = ['REJECTED'];
      }
      if (filterTab === '4') {
        status = ['DRAFTS'];
      }
      if (filterTab === '5') {
        status = ['ON-HOLD'];
      }
    }

    const commonFunction = (res = {}) => {
      const { data: { items = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        const newData = this.getDataByType(items, tab);
        this.setState({
          formatData: newData,
        });
      }
    };

    let type = '';
    if (tabType === 1) {
      type = 'timeOff/fetchLeaveRequestOfEmployee';
    } else type = 'timeOff/fetchMyCompoffRequests';

    dispatch({
      type,
      status,
    }).then((res) => {
      commonFunction(res);
    });
  };

  fetchAllData = () => {
    const { dispatch, tab = 0, type: tabType = 0 } = this.props;
    let type = '';
    if (tabType === 1) {
      type = 'timeOff/fetchLeaveRequestOfEmployee';
    } else type = 'timeOff/fetchMyCompoffRequests';

    dispatch({
      type,
    }).then((res) => {
      const { data: { items = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        const newData = this.getDataByType(items, tab);
        this.countTotal(newData);
        const formatMainTabData = newData.filter((data) => data.status !== 'DELETED');
        this.setState({
          formatMainTabData,
        });
      }
    });
  };

  componentDidMount = () => {
    const { timeOff: { currentFilterTab } = {} } = this.props;
    this.fetchAllData();
    this.fetchFilteredDataFromServer(currentFilterTab);
  };

  saveCurrentTab = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentFilterTab: String(type),
      },
    });
  };

  setSelectedFilterTab = (id) => {
    this.fetchAllData();
    this.fetchFilteredDataFromServer(id);
    this.saveCurrentTab(id);
  };

  countTotal = (newData) => {
    const inProgressLength = [];
    const approvedLength = [];
    const rejectedLength = [];
    const draftLength = [];
    const onHoldLength = [];

    newData.forEach((row) => {
      const { status = '' } = row;
      switch (status) {
        case 'IN-PROGRESS': {
          inProgressLength.push(row);
          break;
        }
        case 'ACCEPTED': {
          approvedLength.push(row);
          break;
        }
        case 'REJECTED': {
          rejectedLength.push(row);
          break;
        }
        case 'DRAFTS': {
          draftLength.push(row);
          break;
        }
        case 'ON-HOLD': {
          onHoldLength.push(row);
          break;
        }
        default:
          break;
      }
    });
    this.setState({
      inProgressLength: inProgressLength.length,
      approvedLength: approvedLength.length,
      rejectedLength: rejectedLength.length,
      draftLength: draftLength.length,
      onHoldLength: onHoldLength.length,
    });
  };

  renderEmptyTableContent = (tab) => {
    switch (tab) {
      case 1:
        return (
          <>
            You have not applied for any Leave requests. <br />
            Submitted Casual, Sick & Compoff requests will be displayed here.
          </>
        );
      case 2:
        return (
          <>
            You have not applied for any Special Leave requests.
            <br />
            Submitted Restricted Holiday, Bereavement, Marriage & Maternity/ Paternity leave
            requests will be displayed here.
          </>
        );
      case 3:
        return <>You have not applied for any LWP requests.</>;
      case 4:
        return <>You have not applied any request to Work from home or Client’s place.</>;
      case 5:
        return <>You have not submitted any requests to earn compensation leaves.</>;
      default:
        return '';
    }
  };

  render() {
    const {
      formatData,
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      onHoldLength,
      formatMainTabData,
    } = this.state;

    const { type = 0, tab = 0 } = this.props;

    const dataNumber = {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      onHoldLength,
    };

    const checkEmptyTable = formatMainTabData.length === 0;

    const emptyTableContent = this.renderEmptyTableContent(tab);

    return (
      <div className={styles.TimeOffRequestTab}>
        <FilterBar dataNumber={dataNumber} setSelectedFilterTab={this.setSelectedFilterTab} />
        <div className={styles.tableContainer}>
          {checkEmptyTable ? (
            <div className={styles.emptyTable}>
              <img src={EmptyIcon} alt="empty-table" />
              <p className={styles.describeTexts}>{emptyTableContent}</p>
            </div>
          ) : (
            <div>
              {type === 1 && (
                <>
                  <MyLeaveTable data={formatData} />
                </>
              )}
              {type === 2 && (
                <>
                  <MyCompoffTable data={formatData} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default TimeOffRequestTab;
