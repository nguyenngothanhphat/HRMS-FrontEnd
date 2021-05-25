import React, { PureComponent } from 'react';
import { Button, Input } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent';
import filterIcon from './assets/filterIcon.png';
import styles from './index.less';

@connect(({ loading, offboarding: { inQueuesList = {} } }) => ({
  loadingList: loading.effects['offboarding/getListRelieving'],
  loadingSearchList: loading.effects['offboarding/searchListRelieving'],
  inQueuesList,
}))
class InQueueTable extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/searchListRelieving',
      payload: {
        relievingStatus: 'IN-QUEUES',
      },
    });
  };

  onChange = (e) => {
    const { dispatch } = this.props;
    const { target } = e;
    const { value } = target;
    dispatch({
      type: 'offboarding/searchListRelieving',
      payload: {
        employeeID: value,
        requesteeName: value,
        ticketID: value,
        relievingStatus: 'IN-QUEUES',
      },
    });
  };

  render() {
    const { inQueuesList, loadingList, loadingSearchList } = this.props;

    return (
      <div className={styles.inQueueTable}>
        <TableComponent
          loadingSearchList={loadingSearchList}
          loading={loadingList}
          data={inQueuesList}
        />
      </div>
    );
  }
}

export default InQueueTable;
