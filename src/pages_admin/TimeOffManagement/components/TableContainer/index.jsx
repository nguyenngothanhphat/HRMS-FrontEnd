import React, { PureComponent } from 'react';
import { connect } from 'umi';
// import moment from 'moment';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import OptionsHeader from '../OptionsHeader';
import TableTimeOff from '../TableTimeOff';
import styles from './index.less';

@connect(({ loading, timeOffManagement }) => ({
  loadingList: loading.effects['timeOffManagement/fetchListTimeOff'],
  loadingActiveList: loading.effects['timeOffManagement/fetchEmployeeList'],
  loadingDetail: loading.effects['timeOffManagement/fetchRequestById'],
  timeOffManagement,
}))
class TableContainer extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const company = getCurrentCompany();
    const tenantId = getCurrentTenant();
    dispatch({
      type: 'timeOffManagement/fetchEmployeeList',
      payload: {
        company,
        tenantId,
      },
    });
    // dispatch({
    //   type: 'timeOffManagement/fetchListTimeOff',
    //   payload: {
    //     employeeId: '',
    //     duration: {
    //       from: '',
    //       to: '',
    //     },
    //     status: '',
    //   },
    // });
  }

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
        employeeId: values.userIName,
        duration: {
          // from: moment(values.durationFrom).format('MM-DD-YYYY'),
          from: values.durationFrom,
          to: values.durationTo,
          // to: moment(values.durationTo).format('MM-DD-YYYY'),
        },
        status: values.status,
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
      timeOffManagement: { listEmployee, listTimeOff, requestDetail },
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
