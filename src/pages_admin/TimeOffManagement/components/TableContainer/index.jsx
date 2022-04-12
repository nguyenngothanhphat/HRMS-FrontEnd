// import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import { getFilter, removeCurrentPage, removeFilter } from '@/utils/timeoffManagement';
import OptionsHeader from '../OptionsHeader';
import TableTimeOff from '../TableTimeOff';
import styles from './index.less';

@connect(
  ({
    loading,
    timeOffManagement,
    user: { companiesOfUser = [] } = {},
    locationSelection: { companyLocationList = [] } = {},
  }) => ({
    loadingList: loading.effects['timeOffManagement/fetchListTimeOff'],
    loading: loading.effects['timeOffManagement/fetchListTimeOff'],
    loadingActiveList: loading.effects['timeOffManagement/fetchEmployeeList'],
    loadingDetail: loading.effects['timeOffManagement/fetchRequestById'],
    timeOffManagement,
    companiesOfUser,
    companyLocationList,
  }),
)
class TableContainer extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   if (window.performance) {
  //     if (performance.navigation.type === 1) {
  //       localStorage.removeItem('timeOffManagementState');
  //     }
  //   }
  // }

  componentDidMount() {
    const { timeOffManagement: { listTimeOff = [] } = {} } = this.props;
    const preState = getFilter();
    if (listTimeOff.length === 0) this.getDataTable(preState || {});
    this.fetchEmployees();
  }

  // componentDidUpdate = (prevProps) => {
  //   const { companyLocationList  = [] } = this.props;
  //   if (
  //     JSON.stringify(companyLocationList ) !== JSON.stringify(prevProps.companyLocationList )
  //   ) {
  //     this.fetchEmployees();
  //     this.fetchListTimeOff();
  //   }
  // };
  componentWillUnmount = () => {
    window.addEventListener('beforeunload', () => {
      removeFilter();
    });
  };

  getCompanyAndLocation = () => {
    const { companiesOfUser, companyLocationList } = this.props;
    const companyId = getCurrentCompany();

    let getCurrentFirm = companiesOfUser.map((item) => (item._id === companyId ? item : null));
    getCurrentFirm = getCurrentFirm.filter((item) => item !== null);

    const getLocation = companyLocationList.map((item) => {
      const { headQuarterAddress: { country: { _id = '' } = {}, state = '' } = {} } = item;
      return {
        country: _id,
        state: [state],
      };
    });

    return {
      getCurrentFirm,
      getLocation,
    };
  };

  fetchListTimeOff = () => {
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const data = this.getCompanyAndLocation();

    dispatch({
      type: 'timeOffManagement/fetchListTimeOff',
      payload: {
        company: data.getCurrentFirm,
        tenantId,
        location: data.getLocation,
      },
    });
  };

  fetchEmployees = () => {
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const data = this.getCompanyAndLocation();

    dispatch({
      type: 'timeOffManagement/fetchEmployeeList',
      payload: {
        company: data.getCurrentFirm,
        tenantId,
        department: [],
        employeeType: [],
        name: '',
        location: data.getLocation,
      },
    });
  };

  handleRequestDetail = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOffManagement/fetchRequestById',
      payload: {
        id,
      },
    });
  };

  getDataTable = (values) => {
    removeCurrentPage();
    const { dispatch } = this.props;
    const { status = [] } = values;
    let newStatus = [...status];
    if (status.includes(TIMEOFF_STATUS.IN_PROGRESS)) {
      newStatus = [...newStatus, TIMEOFF_STATUS.IN_PROGRESS_NEXT];
    }
    dispatch({
      type: 'timeOffManagement/fetchListTimeOff',
      payload: {
        employee: values.userIdName || '',
        from: values.durationFrom,
        to: values.durationTo,
        status: newStatus,
        tenantId: getCurrentTenant(),
      },
    });
    // this.setState({
    //   employeeId: values.userIdName,
    //   duration: {
    //     from: values.durationFrom,
    //     to: values.durationTo,
    //   },
    //   status: values.status,
    // });
  };

  render() {
    const {
      // loadingList,
      loading,
      timeOffManagement: { listEmployee = [], listTimeOff, requestDetail },
    } = this.props;

    return (
      <div className={styles.TimeOffTableContainer}>
        <div className={styles.optionsHeader}>
          <OptionsHeader
            reloadData={this.getDataTable}
            listEmployee={listEmployee}
            listTimeOff={listTimeOff}
          />
        </div>
        <div className={styles.contentContainer}>
          <TableTimeOff
            listTimeOff={listTimeOff}
            loading={loading}
            handleRequestDetail={this.handleRequestDetail}
            requestDetail={requestDetail}
          />
        </div>
      </div>
    );
  }
}

TableContainer.propTypes = {};

export default TableContainer;
