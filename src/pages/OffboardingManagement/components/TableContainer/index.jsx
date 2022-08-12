import React, { PureComponent } from 'react';
import { connect } from 'umi';
import OptionsHeader from '../OptionsHeader';
import TableOffBoarding from '../TableOffBoarding';
import styles from './index.less';

@connect(({ loading, offBoardingManagement }) => ({
  loadingList: loading.effects['offBoardingManagement/fetchListOffBoarding'],
  offBoardingManagement,
}))
class TableContainer extends PureComponent {
  componentDidMount() {
    this.initDataTable();
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offBoardingManagement/fetchListOffBoarding',
      payload: {},
    });
  };

  getDataTable = (filterData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offBoardingManagement/fetchListOffBoarding',
      payload: filterData,
    });
  };

  renderListOffBoarding = () => {
    const {
      offBoardingManagement: { listOffBoarding = [] },
    } = this.props;
    return listOffBoarding;
  };

  render() {
    const { loadingList } = this.props;
    return (
      <div className={styles.OffBoardingTableContainer}>
        <div className={styles.optionsHeader}>
          <OptionsHeader reloadData={this.getDataTable} />
        </div>
        <div className={styles.contentContainer}>
          <TableOffBoarding loading={loadingList} data={this.renderListOffBoarding()} />
        </div>
      </div>
    );
  }
}

TableContainer.propTypes = {};

export default TableContainer;
