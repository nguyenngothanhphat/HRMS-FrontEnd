import React, { Component } from 'react';
import { connect } from 'umi';
import TableEmployee from './ManagerMyTable';
import RejectTable from './RenderTableTab';
import styles from './index.less';

@connect()
class RenderRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
    };
  }

  componentDidMount() {
    this.initDataTable('1');
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedFilterTab } = this.state;
    const { selectedFilterTab: nextTabId } = nextState;
    if (selectedFilterTab !== nextTabId) {
      this.initDataTable(nextTabId);
    }
    return true;
  }

  initDataTable = (tabId) => {
    const { dispatch } = this.props;
    switch (tabId) {
      case '1':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'IN-PROGRESS',
          },
        });
        break;
      case '2':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'ON-HOLD',
          },
        });
        break;
      case '3':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'ACCEPTED',
          },
        });
        break;
      case '4':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'REJECTED',
          },
        });
        break;
      case '5':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'DRAFT',
          },
        });
        break;

      default:
        break;
    }
  };

  setSelectedTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  render() {
    const { selectedFilterTab } = this.state;
    const { data = [] } = this.props;
    const length = data.length || 0;

    return (
      <div>
        <RejectTable setSelectedTab={this.setSelectedTab} lengthData={length} />
        <div className={styles.tableContainer}>
          {selectedFilterTab === '1' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '2' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '3' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '4' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '5' ? <TableEmployee data={data} /> : ''}
        </div>
      </div>
    );
  }
}

export default RenderRequest;
