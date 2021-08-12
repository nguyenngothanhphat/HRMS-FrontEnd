import React, { PureComponent } from 'react';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { connect } from 'umi';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
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
        return type === 'A';
      });

    if (key === 2)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'C';
      });

    if (key === 3)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'B';
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
        status = TIMEOFF_STATUS.inProgress;
      }
      if (filterTab === '2') {
        status = TIMEOFF_STATUS.accepted;
      }
      if (filterTab === '3') {
        status = TIMEOFF_STATUS.rejected;
      }
      if (filterTab === '4') {
        status = TIMEOFF_STATUS.drafts;
      }
      if (filterTab === '5') {
        status = TIMEOFF_STATUS.onHold;
      }
    } else if (tabType === 2) {
      // compoff
      if (filterTab === '1') {
        status = [TIMEOFF_STATUS.inProgressNext, TIMEOFF_STATUS.inProgress];
      }
      if (filterTab === '2') {
        status = [TIMEOFF_STATUS.accepted];
      }
      if (filterTab === '3') {
        status = [TIMEOFF_STATUS.rejected];
      }
      if (filterTab === '4') {
        status = [TIMEOFF_STATUS.drafts];
      }
      if (filterTab === '5') {
        status = [TIMEOFF_STATUS.onHold];
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
        const formatMainTabData = newData.filter((data) => data.status !== TIMEOFF_STATUS.deleted);
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
    let inProgressLength = 0;
    let approvedLength = 0;
    let rejectedLength = 0;
    let draftLength = 0;
    let onHoldLength = 0;

    newData.forEach((row) => {
      const { status = '' } = row;
      switch (status) {
        case TIMEOFF_STATUS.inProgress: {
          inProgressLength += 1;
          break;
        }
        case TIMEOFF_STATUS.accepted: {
          approvedLength += 1;
          break;
        }
        case TIMEOFF_STATUS.rejected: {
          rejectedLength += 1;
          break;
        }
        case TIMEOFF_STATUS.drafts: {
          draftLength += 1;
          break;
        }
        case TIMEOFF_STATUS.onHold: {
          onHoldLength += 1;
          break;
        }
        default:
          break;
      }
    });
    this.setState({
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      onHoldLength,
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

    const {
      type = 0,
      tab = 0,
      loadingFetchLeaveRequests,
      loadingFetchMyCompoffRequests,
    } = this.props;

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
          {checkEmptyTable && !loadingFetchLeaveRequests && !loadingFetchMyCompoffRequests ? (
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
