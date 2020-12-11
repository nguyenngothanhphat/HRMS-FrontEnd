import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import MyRequestTable from './MyRequestTable';
import Summary from './Summary';
// import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['offboarding/fetchList'],
}))
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
      case '6':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'WITHDRAW',
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
    const { data = [], countdata = [], loading } = this.props;

    return (
      <Fragment>
        <Summary setSelectedTab={this.setSelectedTab} countdata={countdata} />
        <MyRequestTable data={data} loading={loading} />
      </Fragment>
    );
  }
}

export default RenderRequest;
