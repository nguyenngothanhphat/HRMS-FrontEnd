import React, { PureComponent } from 'react';
import { connect } from 'umi';
// import moment from 'moment';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import OptionsHeader from '../OptionsHeader';
import TableTimeOff from '../TableTimeOff';
import styles from './index.less';

@connect(
  ({
    loading,
    timeOffManagement,
    user: { companiesOfUser = [] } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
  }) => ({
    loadingList: loading.effects['timeOffManagement/fetchListTimeOff'],
    loadingActiveList: loading.effects['timeOffManagement/fetchEmployeeList'],
    loadingDetail: loading.effects['timeOffManagement/fetchRequestById'],
    timeOffManagement,
    companiesOfUser,
    listLocationsByCompany,
  }),
)
class TableContainer extends PureComponent {
  componentDidUpdate = (prevProps) => {
    const { listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(listLocationsByCompany) !== JSON.stringify(prevProps.listLocationsByCompany)
    ) {
      this.fetchEmployees();
    }
  };

  fetchEmployees = () => {
    const { dispatch, companiesOfUser, listLocationsByCompany } = this.props;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();

    let getCurrentFirm = companiesOfUser.map((item) => (item._id === companyId ? item : null));
    getCurrentFirm = getCurrentFirm.filter((item) => item !== null);

    const getLocation = listLocationsByCompany.map((item) => {
      const { headQuarterAddress: { country: { _id = '' } = {}, state = '' } = {} } = item;
      return {
        country: _id,
        state: [state],
      };
    });

    dispatch({
      type: 'timeOffManagement/fetchEmployeeList',
      payload: {
        company: getCurrentFirm,
        tenantId,
        department: [],
        employeeType: [],
        name: '',
        location: getLocation,
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
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOffManagement/fetchListTimeOff',
      payload: {
        employee: values.userIdName,
        from: values.durationFrom,
        to: values.durationTo,
        status: values.status,
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
      timeOffManagement: { listEmployee = [], listTimeOff, requestDetail },
    } = this.props;
    // console.log(listTimeOff);
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
