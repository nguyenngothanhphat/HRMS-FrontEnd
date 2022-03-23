import React, { PureComponent } from 'react';
import { connect } from 'umi';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import MyLeaveTable from '../MyLeaveTable';
import MyCompoffTable from '../MyCompoffTable';
import FilterBar from '../FilterBar';
import styles from './index.less';

const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, ON_HOLD, REJECTED, DRAFTS, WITHDRAWN } =
  TIMEOFF_STATUS;
@connect(
  ({
    timeOff,
    loading,
    user,
    timeOff: {
      filter = {},
      timeOffTypesByCountry,
      paging,
      compoffRequests = [],
      leaveRequests = [],
    } = {},
  }) => ({
    timeOff,
    paging,
    user,
    filter,
    timeOffTypesByCountry,

    compoffRequests,
    leaveRequests,
    loading1: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
    loading2: loading.effects['timeOff/fetchTeamLeaveRequests'],
    loading3: loading.effects['timeOff/fetchMyCompoffRequests'],
    loading4: loading.effects['timeOff/fetchTeamCompoffRequests'],
  }),
)
class TimeOffRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inProgressLength: 0,
      approvedLength: 0,
      rejectedLength: 0,
      draftLength: 0,
      withdrawnLength: 0,
      selectedTabNumber: '0',
    };
  }

  componentDidMount = () => {
    const {
      dispatch,
      timeOff: { currentFilterTab, currentLeaveTypeTab, timeOffTypesByCountry } = {},
    } = this.props;
    if (currentLeaveTypeTab === '1') {
      let arr = timeOffTypesByCountry.filter((timeOffType) => timeOffType.type === 'A');
      arr = arr.map((item) => item._id);
      dispatch({
        type: 'timeOff/saveFilter',
        payload: {
          type: arr,
          isSearch: true,
        },
      });
    }
    this.setState({ selectedTabNumber: '1' });
    // this.fetchFilteredDataFromServer('1');
    this.setSelectedFilterTab(currentFilterTab);
  };

  componentDidUpdate(prevProps, prevState) {
    const { selectedTabNumber } = this.state;
    const {
      filter: { isSearch },
      dispatch,
      paging: { page },
    } = this.props;

    if (
      isSearch ||
      selectedTabNumber !== prevState.selectedTabNumber ||
      page !== prevProps.paging.page
    ) {
      this.fetchFilteredDataFromServer(selectedTabNumber);
      this.saveCurrentTab(selectedTabNumber);
      dispatch({
        type: 'timeOff/saveFilter',
        payload: { isSearch: false },
      });
    }
  }

  fetchFilteredDataFromServer = (filterTab) => {
    const {
      dispatch,
      type: tabType = 0,
      filter: { search, fromDate, toDate, type: timeOffTypes },
      paging: { page, limit },
    } = this.props;
    // const { user: { currentUser: { employee: { _id = '' } = {} } = {} } = {} } = this.props;

    let status = '';

    if (tabType === 1) {
      if (filterTab === '1') {
        status = [IN_PROGRESS, ON_HOLD];
      }
      if (filterTab === '2') {
        status = [ACCEPTED];
      }
      if (filterTab === '3') {
        status = [REJECTED];
      }
      if (filterTab === '4') {
        status = [DRAFTS];
      }
      if (filterTab === '5') {
        status = [WITHDRAWN];
      }
    } else if (tabType === 2) {
      // compoff
      if (filterTab === '1') {
        status = [IN_PROGRESS_NEXT, IN_PROGRESS];
      }
      if (filterTab === '2') {
        status = [ACCEPTED];
      }
      if (filterTab === '3') {
        status = [REJECTED];
      }
      if (filterTab === '4') {
        status = [DRAFTS];
      }
      if (filterTab === '5') {
        status = [ON_HOLD];
      }
    }
    const commonFunction = (res = {}) => {
      const { data: { total = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        this.countTotal(total);
      }
    };

    let types = '';
    if (tabType === 1) {
      types = 'timeOff/fetchLeaveRequestOfEmployee';
    } else types = 'timeOff/fetchMyCompoffRequests';

    dispatch({
      type: types,
      payload: {
        status,
        type: timeOffTypes,
        search,
        fromDate,
        toDate,
        page,
        limit,
      },
    }).then((res) => {
      commonFunction(res);
    });
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
    this.saveCurrentTab(id);
    this.setState({
      selectedTabNumber: id,
    });
  };

  countTotal = (newData) => {
    let inProgressLength = 0;
    let approvedLength = 0;
    let rejectedLength = 0;
    let draftLength = 0;
    let withdrawnLength = 0;

    newData.forEach((item) => {
      const { _id: status = '' } = item;
      switch (status) {
        case IN_PROGRESS:
        case ON_HOLD: {
          inProgressLength += item.count;
          break;
        }
        case ACCEPTED: {
          approvedLength += item.count;
          break;
        }
        case REJECTED: {
          rejectedLength += item.count;
          break;
        }
        case DRAFTS: {
          draftLength += item.count;
          break;
        }
        case WITHDRAWN: {
          withdrawnLength += item.count;
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
      withdrawnLength,
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
    const { inProgressLength, approvedLength, rejectedLength, draftLength, withdrawnLength } =
      this.state;

    const {
      type = 0,
      tab = 0,
      loadingFetchLeaveRequests,
      loadingFetchMyCompoffRequests,
      compoffRequests = [],
      leaveRequests = [],
    } = this.props;

    const dataNumber = {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      withdrawnLength,
    };

    const checkEmptyTable = false;
    // (type === 2 && compoffRequests.length === 0) || (type === 1 && leaveRequests.length === 0);

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
                  <MyLeaveTable data={leaveRequests} />
                </>
              )}
              {type === 2 && (
                <>
                  <MyCompoffTable data={compoffRequests} />
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
