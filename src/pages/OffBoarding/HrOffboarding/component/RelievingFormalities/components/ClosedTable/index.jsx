import React, { PureComponent } from 'react';
import { connect } from 'umi';
import TableComponent from '../TableComponent';
import styles from './index.less';

@connect(({ loading, offboarding: { closeRecordsList = {} } }) => ({
  loadingList: loading.effects['offboarding/getListRelieving'],
  closeRecordsList,
}))
class ClosedTable extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/searchListRelieving',
      payload: {
        relievingStatus: 'CLOSE-RECORDS',
      },
    });
  };

  onChange = (e) => {
    const { dispatch } = this.props;
    const { target } = e;
    const { value } = target;
    console.log(value);
    dispatch({
      type: 'offboarding/searchListRelieving',
      payload: {
        employeeID: value,
        requesteeName: value,
        ticketID: value,
        relievingStatus: 'CLOSE-RECORDS',
      },
    });
  };

  render() {
    const { closeRecordsList, loadingList } = this.props;

    return (
      <div className={styles.closedTable}>
        <TableComponent loading={loadingList} data={closeRecordsList} isClosedTable />
      </div>
    );
  }
}

export default ClosedTable;
