import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import TableComponent from '../TableComponent';
import styles from './index.less';

@connect(({ loading, offboarding: { inQueuesList = {} } }) => ({
  loadingSearchList: loading.effects['offboarding/searchListRelieving'],
  inQueuesList,
}))
class InQueueTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataQueuesList: [],
      loadingFilter: false,
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        dataQueuesList: query,
        loadingFilter: false,
      });
    }, 1000);
  }

  componentDidMount = () => {
    const { dispatch, inQueuesList = [] } = this.props;
    dispatch({
      type: 'offboarding/searchListRelieving',
      payload: {
        relievingStatus: 'IN-QUEUES',
      },
    });

    if (inQueuesList.length > 0) this.updateData(inQueuesList);
  };

  componentDidUpdate(prevProps) {
    const { inQueuesList = [], dataSearch = '' } = this.props;
    if (JSON.stringify(inQueuesList) !== JSON.stringify(prevProps.inQueuesList)) {
      this.updateData(inQueuesList);
    }

    if (JSON.stringify(dataSearch) !== JSON.stringify(prevProps.dataSearch)) {
      this.onSearch(dataSearch);
    }
  }

  onSearch = (value) => {
    const { inQueuesList = [] } = this.props;
    const formatValue = value.toLowerCase();

    const filterData = inQueuesList.filter((item) => {
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

  updateData = (inQueuesList) => {
    this.setState({
      dataQueuesList: inQueuesList,
    });
  };

  render() {
    const { loadingSearchList } = this.props;
    const { dataQueuesList, loadingFilter } = this.state;

    return (
      <div className={styles.inQueueTable}>
        <TableComponent
          loadingSearchList={loadingSearchList || loadingFilter}
          data={dataQueuesList}
        />
      </div>
    );
  }
}

export default InQueueTable;
