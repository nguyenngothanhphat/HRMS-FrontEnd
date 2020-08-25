import React, { PureComponent } from 'react';
import { Timeline, Icon, List, Spin, Row, Col, Button, Dropdown, Menu, Drawer } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
// import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'umi/link';
import { red, gold, green, cyan, blue, grey } from '@ant-design/colors';
import ExportPDF from '../ExportPDF';
import ExportExcel from '../ExportExcel';
import styles from './index.less';
import HistorySearch from './components/HistorySearch';

@connect(
  ({
    reportHistory: { listSearch, item },
    loading,
    user: { list, currentUser },
    setting: {
      item: { appearance, name: companyName },
    },
  }) => ({
    listSearch,
    item,
    loading: loading.models.reportHistory,
    searching: loading.effects['reportHistory/search'],
    list,
    currentUser,
    appearance,
    companyName,
  })
)
class History extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      searchVisble: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reportHistory/search', payload: { method: 'list' } });
    dispatch({ type: 'project/fetch' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reportHistory/save', payload: { list: [] } });
    dispatch({ type: 'project/save', payload: { listProject: [], item: {} } });
  }

  // handleInfiniteOnLoad = () => {
  //   const { dispatch, listSearch } = this.props;
  //   const { q, status, after } = this.state;
  //   if (listSearch.length > 0) {
  //     dispatch({
  //       type: 'reportHistory/search',
  //       payload: {
  //         method: 'list',
  //         before: listSearch[listSearch.length - 1].updatedAt,
  //         status,
  //         q,
  //         after,
  //       },
  //     });
  //   }
  // };

  showSearch = () => {
    this.setState({ searchVisble: true });
  };

  hideSearch = () => {
    this.setState({ searchVisble: false });
  };

  onChangeCreator = text => {
    this.search(text);
  };

  getReportAction = action => {
    const statusLabels = {
      approved: {
        color: green.primary,
        icon: 'check',
      },
      rejected: {
        color: red[5],
        icon: 'close',
      },
      commented: {
        color: gold.primary,
        icon: 'question',
      },
      updated: {
        color: blue.primary,
        icon: 'info',
      },
      assigned: {
        color: cyan.primary,
        icon: 'edit',
      },
      deleted: {
        color: grey.primary,
        icon: 'delete',
      },
      draft: {
        color: grey[3],
        icon: 'snippets',
      },
      created: {
        color: blue.primary,
        icon: 'plus',
      },
      submitted: {
        color: blue.primary,
        icon: 'to-top',
      },
    };
    const { color, icon } = statusLabels[action] || {};
    return { status: formatMessage({ id: `reimbursement.action.${action}` }), color, icon };
  };

  getReportStatus = status => {
    let state = {
      color: grey.primary,
      status,
    };
    switch (status) {
      case 'REJECT':
        state = {
          ...state,
          color: red[5],
        };
        break;
      case 'COMPLETE':
        state = {
          ...state,
          color: green.primary,
        };
        break;
      case 'DRAFT':
        state = {
          ...state,
          color: grey[3],
        };
        break;
      case 'DELETED':
        state = {
          ...state,
          color: grey[6],
        };
        break;
      default:
        state = {
          color: blue.primary,
          status: 'PENDING',
        };
        break;
    }

    return state;
  };

  renderHistoryItem = activity => {
    const { id, action = '', createdAt = '', performer = {} } = activity;
    const { email = '', fullName = '' } = performer || {};
    const { color, status, icon } = this.getReportAction(action);

    return (
      <Timeline.Item key={id} dot={<Icon type={icon} style={{ fontSize: '16px', color }} />}>
        <span>{moment(createdAt).calendar()}</span>
        <p>
          {`${fullName.trim() || email}`}
          {<span style={{ color }}>{` ${status} `}</span>}
          {formatMessage({ id: 'reimbursement.this-report' })}
        </p>
      </Timeline.Item>
    );
  };

  renderReportItem = item => {
    const { status, color } = this.getReportStatus(item.status);
    const { currentUser, docLogo, companyName } = this.props;
    return (
      <List.Item key={item.id}>
        <Row style={{ width: '100%' }} type="flex" justify="space-between">
          <Col span={16}>
            <Link
              to={`/report/view/${item.id}`}
              onClick={() => {
                const { dispatch } = this.props;
                dispatch({ type: 'reimbursement/fetchItem', payload: { reId: item.id } });
              }}
            >
              <h3>
                <span
                  style={{
                    fontWeight: 'bold',
                    color,
                  }}
                >
                  {formatMessage({ id: `reimbursement.status.${status.toLowerCase()}` })}
                </span>
                {` - ${item.title}`}
              </h3>
            </Link>
            <Timeline>{item.histories.map(this.renderHistoryItem)}</Timeline>
          </Col>
          <Col>
            <Dropdown overlay={() => this.menuItem([item], currentUser, docLogo, companyName)}>
              <Button type="primary">
                <Icon type="upload" /> {formatMessage({ id: 'common.button.export' })}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </List.Item>
    );
  };

  menuItem = ([item], docLogo, companyName) => {
    const billData = this.getBillData([item]);
    return (
      <Menu>
        <Menu.Item
          key="pdf"
          onClick={() => {
            ExportPDF([item], docLogo, companyName);
          }}
        >
          <div>
            <Icon type="file-pdf" />
            <span className={styles.ml10}>PDF</span>
          </div>
        </Menu.Item>
        <Menu.Item key="excel">
          <ExportExcel data={[item]} billData={billData} />
        </Menu.Item>
      </Menu>
    );
  };

  menu = (listSearch, docLogo, companyName) => {
    const billData = this.getBillData(listSearch);
    return (
      <Menu>
        <Menu.Item
          key="pdf"
          onClick={() => {
            ExportPDF(listSearch, docLogo, companyName);
          }}
        >
          <div>
            <Icon type="file-pdf" />
            <span className={styles.ml10}>PDF</span>
          </div>
        </Menu.Item>
        <Menu.Item key="excel">
          <ExportExcel data={listSearch} billData={billData} />
        </Menu.Item>
      </Menu>
    );
  };

  getBillData = data => {
    const billData = [];
    data.forEach(report => {
      billData.push(
        ...[{ reportId: report.id, amount: report.amount }, ...report.bills, { space: true }]
      );
    });
    return billData;
  };

  render() {
    const { listSearch, searching, appearance = {}, companyName } = this.props;
    const { searchVisble } = this.state;
    const { docLogo = '' } = appearance;
    // const amount = listSearch.length || 0;
    const { hasMore } = this.state;
    return (
      <div className={styles.history}>
        <div>
          <div className={styles.controlBtn}>
            <Dropdown overlay={() => this.menu(listSearch, docLogo, companyName)}>
              <Button type="primary">
                <Icon type="upload" /> {formatMessage({ id: 'common.exportAll' })}{' '}
                <Icon type="down" />
              </Button>
            </Dropdown>
            <Button onClick={this.showSearch}>
              {formatMessage({ id: 'common.searchReport' })} <Icon type="search" />
            </Button>
          </div>
          <span className={styles.textStatus}>
            {`Report: ${listSearch ? listSearch.length : 0}`}
          </span>
        </div>
        {/* <InfiniteScroll
          style={{ paddingLeft: '3' }}
          dataLength={listSearch.length}
          next={this.handleInfiniteOnLoad}
          hasMore
        >
          <List
            className={styles.history}
            dataSource={listSearch}
            renderItem={this.renderReportItem}
          >
            {searching && hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll> */}
        <List className={styles.history} dataSource={listSearch} renderItem={this.renderReportItem}>
          {searching && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
        <Drawer
          title={formatMessage({ id: 'common.searchReport' })}
          visible={searchVisble}
          // destroyOnClose
          onClose={this.hideSearch}
          width={600}
          bodyStyle={{ height: '100%' }}
          // afterVisibleChange={this.onVisibleDetailChange}
          // closable={false}
        >
          <HistorySearch onClose={this.hideSearch} />
        </Drawer>
      </div>
    );
  }
}

export default History;
