import React, { PureComponent } from 'react';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { connect } from 'umi';
import DataTable from '../DataTable';
import CompoffTable from '../CompoffTable';
import FilterBar from '../FilterBar';

import styles from './index.less';

@connect(({ timeOff, user }) => ({
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

  getTypeToDispatch = (tabType, category) => {
    let type = '';
    if (tabType === 1) {
      if (category === 'MY') type = 'timeOff/fetchLeaveRequestOfEmployee';
      else if (category === 'TEAM') type = 'timeOff/fetchTeamLeaveRequests';
      else type = 'timeOff/fetchTeamLeaveRequests';
    }
    if (tabType === 2) {
      if (category === 'MY') type = 'timeOff/fetchMyCompoffRequests';
      else if (category === 'TEAM') type = 'timeOff/fetchTeamCompoffRequests';
      else type = 'timeOff/fetchTeamCompoffRequests';
    }
    return type;
  };

  fetchFilteredDataFromServer = (filterTab) => {
    const { dispatch, tab = 0, type: tabType = 0, category = '' } = this.props;
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

    const commonFunction = (res = {}) => {
      const { data: { items = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        const newData = this.getDataByType(items, tab);
        this.setState({
          formatData: newData,
        });
      }
    };

    const type = this.getTypeToDispatch(tabType, category);

    dispatch({
      type,
      employee: _id,
      status,
    }).then((res) => {
      commonFunction(res);
    });
  };

  fetchAllData = () => {
    const { dispatch, tab = 0, type: tabType = 0, category = '' } = this.props;
    const type = this.getTypeToDispatch(tabType, category);

    dispatch({
      type,
    }).then((res) => {
      const { data: { items = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        const newData = this.getDataByType(items, tab);
        this.countTotal(newData);
      }
    });
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
    const { type = 0, category = '' } = this.props;

    const {
      formatData,
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
    } = this.state;

    const dataNumber = {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
    };

    return (
      <div className={styles.TimeOffRequestTab}>
        <FilterBar
          dataNumber={dataNumber}
          setSelectedFilterTab={this.setSelectedFilterTab}
          category={category}
        />
        <div className={styles.tableContainer}>
          {
            //     data.length === 0 ? (
            //   <div className={styles.emptyTable}>
            //     <img src={EmptyIcon} alt="empty-table" />
            //     <p className={styles.describeTexts}>
            //       {category === 'MY' && (
            //         <>
            //           You have not applied for any Leave requests. <br />
            //           Submitted Casual, Sick & Compoff requests will be displayed here.
            //         </>
            //       )}
            //       {category === 'TEAM' && (
            //         <>
            //           No Leave requests received. <br />
            //           Submitted Casual, Sick & Compoff requests will be displayed here.
            //         </>
            //       )}
            //     </p>
            //   </div>
            // ) : (
          }
          <div>
            {type === 1 && <DataTable data={formatData} category={category} />}
            {type === 2 && <CompoffTable data={formatData} category={category} />}
          </div>
        </div>
      </div>
    );
  }
}
export default TimeOffRequestTab;
