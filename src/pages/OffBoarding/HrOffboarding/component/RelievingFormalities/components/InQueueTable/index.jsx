import React, { PureComponent } from 'react';
import { Button, Input } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent';
import filterIcon from './assets/filterIcon.png';
import styles from './index.less';

@connect(({ loading, offboarding: { inQueuesList = {} } }) => ({
  loadingList: loading.effects['offboarding/getListRelieving'],
  inQueuesList,
}))
class InQueueTable extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/getListRelieving',
      payload: {
        relievingStatus: 'IN-QUEUES',
      },
    });
  };

  render() {
    const { inQueuesList, loadingList } = this.props;

    return (
      <div className={styles.inQueueTable}>
        <div className={styles.toolbar}>
          <div className={styles.filter}>
            <Button
              type="link"
              shape="round"
              icon={<img src={filterIcon} alt="icon" />}
              size="small"
            >
              Filter
            </Button>
          </div>
          <div className={styles.searchBar}>
            <Input
              placeholder="Search for ticket ID, resignee, requests …"
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
        <TableComponent loading={loadingList} data={inQueuesList} />
      </div>
    );
  }
}

export default InQueueTable;
