import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import MyRequestTable from './MyRequestTable';
import Summary from './Summary';
// import styles from './index.less';

@connect(({ loading, offboarding: { total = '' } = {} }) => ({
  loading: loading.effects['offboarding/fetchList'],
  total,
}))
class RenderRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
    };
  }

  componentDidMount() {
    this.initDataTable('1');
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedFilterTab, pageSelected, size } = this.state;
    const { selectedFilterTab: nextTabId, pageSelected: nextPage, size: nextSize } = nextState;
    if (selectedFilterTab !== nextTabId || nextSize !== size || nextPage !== pageSelected) {
      this.initDataTable(nextTabId);
    }
    return true;
  }

  initDataTable = (tabId) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;
    switch (tabId) {
      case '1':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'IN-PROGRESS',
            page: pageSelected,
            limit: size,
          },
        });
        break;
      case '2':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'ON-HOLD',
            page: pageSelected,
            limit: size,
          },
        });
        break;
      case '3':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'ACCEPTED',
            page: pageSelected,
            limit: size,
          },
        });
        break;
      case '4':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'REJECTED',
            page: pageSelected,
            limit: size,
          },
        });
        break;
      case '5':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'DRAFT',
            page: pageSelected,
            limit: size,
          },
        });
        break;
      case '6':
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'WITHDRAW',
            page: pageSelected,
            limit: size,
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

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  render() {
    const { data = [], countdata = [], loading, hrManager = {}, total } = this.props;
    const { pageSelected, size } = this.state;

    return (
      <>
        <Summary setSelectedTab={this.setSelectedTab} countdata={countdata} />
        <MyRequestTable
          data={data}
          loading={loading}
          hrManager={hrManager}
          pageSelected={pageSelected}
          size={size}
          total={total}
          getPageAndSize={this.getPageAndSize}
        />
      </>
    );
  }
}

export default RenderRequest;
