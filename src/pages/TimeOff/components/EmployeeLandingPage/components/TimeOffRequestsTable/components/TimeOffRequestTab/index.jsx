import React, { PureComponent } from 'react';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { connect } from 'umi';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import MyLeaveTable from '../MyLeaveTable';
import MyCompoffTable from '../MyCompoffTable';
import FilterBar from '../FilterBar';
import styles from './index.less';

@connect(
  ({
    timeOff,
    loading,
    user,
    timeOff: { currentUserRole = '', filter = {}, timeOffTypesByCountry, paging } = {},
  }) => ({
    timeOff,
    paging,
    user,
    filter,
    timeOffTypesByCountry,
    currentUserRole,
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
      formatData: [],
      formatMainTabData: [],
      inProgressLength: 0,
      approvedLength: 0,
      rejectedLength: 0,
      draftLength: 0,
      onHoldLength: 0,
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
      const { data: { items = [], total = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        const newData = items;

        this.countTotal(total);
        const formatMainTabData = newData;
        this.setState({
          formatMainTabData,
          formatData: newData,
        });
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
    let onHoldLength = 0;

    newData.forEach((item) => {
      const { status = '' } = item;
      switch (status) {
        case TIMEOFF_STATUS.inProgress: {
          inProgressLength = item.count;
          break;
        }
        case TIMEOFF_STATUS.accepted: {
          approvedLength = item.count;
          break;
        }
        case TIMEOFF_STATUS.rejected: {
          rejectedLength = item.count;
          break;
        }
        case TIMEOFF_STATUS.drafts: {
          draftLength = item.count;
          break;
        }
        case TIMEOFF_STATUS.onHold: {
          onHoldLength = item.count;
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
