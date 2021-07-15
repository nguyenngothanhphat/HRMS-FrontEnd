import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import TableComponent from '../TableComponent';
import styles from './index.less';

@connect(({ loading, offboarding: { listRelievingFormalities = {} } }) => ({
  loadingSearchList: loading.effects['offboarding/searchListRelieving'],
  listRelievingFormalities,
}))
class AllTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataListAll: [],
      loadingFilter: false,
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        dataListAll: query,
        loadingFilter: false,
      });
    }, 1000);
  }

  componentDidMount = () => {
    const { dispatch, listRelievingFormalities = [] } = this.props;
    dispatch({
      type: 'offboarding/searchListRelieving',
    });

    if (listRelievingFormalities.length > 0) this.updateData(listRelievingFormalities);
  };

  componentDidUpdate(prevProps) {
    const { listRelievingFormalities = [], dataSearch = '' } = this.props;
    if (
      JSON.stringify(listRelievingFormalities) !==
      JSON.stringify(prevProps.listRelievingFormalities)
    ) {
      this.updateData(listRelievingFormalities);
    }

    if (JSON.stringify(dataSearch) !== JSON.stringify(prevProps.dataSearch)) {
      this.onSearch(dataSearch);
    }
  }

  onSearch = (value) => {
    const { listRelievingFormalities = [] } = this.props;
    const formatValue = value.toLowerCase();

    const filterData = listRelievingFormalities.filter((item) => {
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

  updateData = (listRelievingFormalities) => {
    this.setState({
      dataListAll: listRelievingFormalities,
    });
  };

  render() {
    const { loadingSearchList, timezoneList } = this.props;
    const { dataListAll, loadingFilter } = this.state;

    return (
      <div className={styles.allTable}>
        <TableComponent
          timezoneList={timezoneList}
          loadingSearchList={loadingSearchList || loadingFilter}
          data={dataListAll}
        />
      </div>
    );
  }
}

export default AllTable;
