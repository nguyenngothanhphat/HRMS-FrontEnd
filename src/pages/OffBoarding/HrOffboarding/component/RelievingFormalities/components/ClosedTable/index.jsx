import React, { PureComponent } from 'react';
import { Button, Input } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent';
import filterIcon from './assets/filterIcon.png';
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
              onChange={this.onChange}
              placeholder="Search for ticket ID, resignee, requests …"
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
        <TableComponent loading={loadingList} data={closeRecordsList} isClosedTable />
      </div>
    );
  }
}

export default ClosedTable;
