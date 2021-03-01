import React, { PureComponent } from 'react';
import { connect } from 'umi';
// import moment from 'moment';
import OptionsHeader from '../OptionsHeader';
import TableTimeOff from '../TableTimeOff';
import styles from './index.less';

@connect(
  ({
    loading,
    timeOffManagement,
    user: { currentUser: { company: { _id: company } = {} } = {} } = {},
  }) => ({
    loadingList: loading.effects['timeOffManagement/fetchListTimeOff'],
    loadingActiveList: loading.effects['timeOffManagement/fetchEmployeeList'],
    loadingDetail: loading.effects['timeOffManagement/fetchRequestById'],
    timeOffManagement,
    company,
  }),
)
class TableContainer extends PureComponent {
  componentDidMount() {
    const { dispatch, company } = this.props;
    dispatch({
      type: 'timeOffManagement/fetchEmployeeList',
      payload: {
        company,
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
    console.log('test', id);
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
        employeeId: '5f57544e899f4743e8fdb3f2',
        duration: {
          // from: moment(values.durationFrom).format('MM-DD-YYYY'),
          from: '01-01-2020',
          to: '12-31-2020',
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
          <OptionsHeader reloadData={this.getDataTable} listEmployee={listEmployee} />
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
