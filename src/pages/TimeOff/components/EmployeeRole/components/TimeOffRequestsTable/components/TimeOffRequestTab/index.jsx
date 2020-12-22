import React, { PureComponent } from 'react';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { connect } from 'umi';
import DataTable from '../DataTable';
import CompoffTable from '../CompoffTable';
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
      inProgressLength: 0,
      approvedLength: 0,
      rejectedLength: 0,
      draftLength: 0,
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
    const { dispatch, tab = 0, type = 0 } = this.props;
    const { user: { currentUser: { employee: { _id = '' } = {} } = {} } = {} } = this.props;

    let status = '';
    if (filterTab === '1') {
      status = 'IN-PROGRESS';
    }
    if (filterTab === '2') {
      status = 'APPROVED';
    }
    if (filterTab === '3') {
      status = 'REJECTED';
    }
    if (filterTab === '4') {
      status = 'DRAFTS';
    }

    if (type === 1)
      dispatch({
        type: 'timeOff/fetchLeaveRequestOfEmployee',
        employee: _id,
        status,
      }).then((res) => {
        const { data: { items = [] } = {}, statusCode } = res;
        if (statusCode === 200) {
          const newData = this.getDataByType(items, tab);
          this.setState({
            formatData: newData,
          });
        }
      });

    if (type === 2)
      dispatch({
        type: 'timeOff/fetchMyCompoffRequests',
        employee: _id,
        status,
      }).then((res) => {
        const { data: { items = [] } = {}, statusCode } = res;
        if (statusCode === 200) {
          const newData = this.getDataByType(items, tab);
          this.setState({
            formatData: newData,
          });
        }
      });
  };

  fetchAllData = () => {
    const { dispatch, tab = 0, type = 0 } = this.props;
    if (type === 1) {
      dispatch({
        type: 'timeOff/fetchLeaveRequestOfEmployee',
      }).then((res) => {
        const { data: { items = [] } = {}, statusCode } = res;
        if (statusCode === 200) {
          const newData = this.getDataByType(items, tab);
          this.countTotal(newData);
        }
      });
    } else {
      dispatch({
        type: 'timeOff/fetchMyCompoffRequests',
      }).then((res) => {
        const { data: { items = [] } = {}, statusCode } = res;
        if (statusCode === 200) {
          const newData = this.getDataByType(items, tab);
          this.countTotal(newData);
        }
      });
    }
  };

  componentDidMount = () => {
    this.fetchAllData();
    this.fetchFilteredDataFromServer('1');
  };

  setSelectedFilterTab = (id) => {
    this.fetchAllData();
    this.fetchFilteredDataFromServer(id);
  };

  countTotal = (newData) => {
    const inProgressLength = [];
    const approvedLength = [];
    const rejectedLength = [];
    const draftLength = [];

    newData.forEach((row) => {
      const { status = '' } = row;
      switch (status) {
        case 'IN-PROGRESS': {
          inProgressLength.push(row);
          break;
        }
        case 'APPROVED': {
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
        default:
          break;
      }
    });
    this.setState({
      inProgressLength: inProgressLength.length,
      approvedLength: approvedLength.length,
      rejectedLength: rejectedLength.length,
      draftLength: draftLength.length,
    });
  };

  render() {
    const {
      formatData,
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
    } = this.state;
    const { type = 0 } = this.props;

    const dataNumber = {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
    };

    return (
      <div className={styles.TimeOffRequestTab}>
        <FilterBar dataNumber={dataNumber} setSelectedFilterTab={this.setSelectedFilterTab} />
        <div className={styles.tableContainer}>
          {
            //     formatData.length === 0 ? (
            //   <div className={styles.emptyTable}>
            //     <img src={EmptyIcon} alt="empty-table" />
            //     <p className={styles.describeTexts}>
            //       You have not applied for any Leave requests. <br />
            //       Submitted Casual, Sick & Compoff requests will be displayed here.
            //     </p>
            //   </div>
            // ) : (
          }
          <div>
            {type === 1 && (
              <>
                <DataTable data={formatData} />
              </>
            )}
            {type === 2 && (
              <>
                <CompoffTable data={formatData} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default TimeOffRequestTab;
