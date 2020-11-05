import React, { PureComponent } from 'react';
import { connect } from 'umi';
import OptionsHeader from '../OptionsHeader';
import TableTimeOff from '../TableTimeOff';
import styles from './index.less';

@connect(({ loading, timeOffManagement }) => ({
  loadingList: loading.effects['timeOffManagement/fetchListTimeOff'],
  timeOffManagement,
}))
class TableContainer extends PureComponent {
  componentDidMount() {
    this.initDataTable();
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOffManagement/fetchListTimeOff',
    });
  };

  getDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOffManagement/fetchListTimeOff',
    });
  };

  renderListTimeOff = () => {
    const {
      timeOffManagement: { listTimeOff = [] },
    } = this.props;
    return listTimeOff;
  };

  render() {
    const { loadingList } = this.props;
    return (
      <div className={styles.TimeOffTableContainer}>
        <div className={styles.optionsHeader}>
          <OptionsHeader reloadData={this.getDataTable} />
        </div>
        <div className={styles.contentContainer}>
          <TableTimeOff loading={loadingList} data={this.renderListTimeOff()} />
        </div>
      </div>
    );
  }
}

TableContainer.propTypes = {};

export default TableContainer;
