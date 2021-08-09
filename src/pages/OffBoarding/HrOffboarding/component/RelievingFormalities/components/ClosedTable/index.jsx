import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import TableComponent from '../TableComponent';
import styles from './index.less';

@connect(({ loading, offboarding: { closeRecordsList = {} } }) => ({
  loadingSearchList: loading.effects['offboarding/searchListRelieving'],
  closeRecordsList,
}))
class ClosedTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataCloseList: [],
      loadingFilter: false,
      isClosedTable: true,
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        dataCloseList: query,
        loadingFilter: false,
      });
    }, 1000);
  }

  componentDidMount = () => {
    const { dispatch, closeRecordsList = [] } = this.props;
    dispatch({
      type: 'offboarding/searchListRelieving',
      payload: {
        relievingStatus: 'CLOSE-RECORDS',
      },
    });
    if (closeRecordsList.length > 0) this.updateData(closeRecordsList);
  };

  componentDidUpdate(prevProps) {
    const { closeRecordsList = [], dataSearch = '' } = this.props;
    if (JSON.stringify(closeRecordsList) !== JSON.stringify(prevProps.closeRecordsList)) {
      this.updateData(closeRecordsList);
    }

    if (JSON.stringify(dataSearch) !== JSON.stringify(prevProps.dataSearch)) {
      this.onSearch(dataSearch);
    }
  }

  onSearch = (value) => {
    const { closeRecordsList = [] } = this.props;
    const formatValue = value.toLowerCase();

    const filterData = closeRecordsList.filter((item) => {
      const {
        ticketID = '',
        employee: { generalInfo: { employeeId = '', legalName = '' } = {} } = {},
        department: { name: departmentName = '' } = {},
      } = item;
      const formatTicketId = ticketID.toLowerCase();
      const fortmatEmployeeID = employeeId.toLowerCase();
      const formatLegalName = legalName.toLowerCase();
      const formatDepartmentName = departmentName.toLowerCase();

      if (
        formatTicketId.includes(formatValue) ||
        fortmatEmployeeID.includes(formatValue) ||
        formatLegalName.includes(formatValue) ||
        formatDepartmentName.includes(formatValue)
      )
        return item;
      return 0;
    });
    this.setState({ loadingFilter: true });

    this.setDebounce(filterData);
  };

  updateData = (closeRecordsList) => {
    this.setState({
      dataCloseList: closeRecordsList,
    });
  };

  render() {
    const { loadingSearchList } = this.props;
    const { dataCloseList, loadingFilter, isClosedTable } = this.state;

    return (
      <div className={styles.closedTable}>
        <TableComponent
          loadingSearchList={loadingSearchList || loadingFilter}
          data={dataCloseList}
          isClosedTable={isClosedTable}
        />
      </div>
    );
  }
}

export default ClosedTable;
