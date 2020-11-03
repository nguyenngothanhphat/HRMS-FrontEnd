import React, { PureComponent } from 'react';
import { connect } from 'umi';
import OptionsHeader from '../OptionsHeader';
import TableDocuments from '../TableDocuments';
import styles from './index.less';

@connect(({ loading, documentsManagement }) => ({
  loadingList: loading.effects['documentsManagement/fetchListDocuments'],
  documentsManagement,
}))
class TableContainer extends PureComponent {
  componentDidMount() {
    this.initDataTable();
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/fetchListDocuments',
    });
  };

  getDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/fetchListDocuments',
    });
  };

  renderListDocuments = () => {
    const {
      documentsManagement: { listDocuments = [] },
    } = this.props;
    return listDocuments;
  };

  render() {
    const { loadingList } = this.props;

    return (
      <div className={styles.TimeOffTableContainer}>
        <div className={styles.optionsHeader}>
          <OptionsHeader />
        </div>
        <div className={styles.contentContainer}>
          <TableDocuments loading={loadingList} data={this.renderListDocuments()} />
        </div>
      </div>
    );
  }
}

TableContainer.propTypes = {};

export default TableContainer;
