import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Icon, Button, Drawer, Dropdown, Menu } from 'antd';
import ListFeedbacks from './components/ListFeedbacks';
import Filter from './components/Filter';
import Detail from './components/Detail';
import SummaryBox from './components/SummaryBox';
import styles from './index.less';
import ExportExcel from './ExportExcel';

@connect(({ loading, feedback: { listFeedback, filter }, feedback }) => ({
  loading: loading.effects['project/saveProject'],
  listFeedback,
  filter,
  feedback,
}))
class Feedbacks extends PureComponent {
  state = { visibleFilter: false, visibleDetail: false, itemDetail: {} };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'feedback/fetch', payload: { limit: 10 } });
  }

  showFilter = () => {
    this.setState({ visibleFilter: true });
  };

  onCloseFilter = () => {
    this.setState({ visibleFilter: false });
  };

  showDetail = row => {
    this.setState({ visibleDetail: true, itemDetail: row });
  };

  onCloseDetail = () => {
    this.setState({ visibleDetail: false });
  };

  menu = currentSelectedList => {
    return (
      <Menu>
        <Menu.Item key="excel">
          <ExportExcel data={currentSelectedList} />
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const {
      listFeedback = [],
      feedback: { more: { pending = 0, reject = 0, complete = 0 } = {} } = {},
    } = this.props;
    const { visibleFilter, visibleDetail, itemDetail } = this.state;
    const customListFeedback = listFeedback;

    const summaryData = [
      {
        id: 'summary1',
        title: formatMessage({ id: 'feedback.feedbacks' }),
        number: pending + complete + reject,
      },
      {
        id: 'summary2',
        title: formatMessage({ id: 'feedback.pending' }),
        number: pending,
      },
      {
        id: 'summary3',
        title: formatMessage({ id: 'feedback.resolved' }),
        number: complete,
      },
      {
        id: 'summary4',
        title: formatMessage({ id: 'feedback.rejected' }),
        number: reject,
      },
    ];

    return (
      <div className={styles.content}>
        <div className={styles.actionBtn}>
          <Dropdown overlay={this.menu(customListFeedback)}>
            <Button className={styles.btnExport} type="primary">
              <Icon type="upload" />
              <FormattedMessage id="bill.list.btn.export" /> <Icon type="down" />
            </Button>
          </Dropdown>
          <Button className={styles.btnSearch} type="default" onClick={this.showFilter}>
            {formatMessage({ id: 'feedback.search-feedback' })}
            <Icon type="search" />
          </Button>
        </div>

        <Row className={styles.summaryBox} gutter={12}>
          {summaryData.map(item => {
            const { title, number, id } = item;
            return (
              <Col key={id} span={6}>
                <SummaryBox title={title} number={number} />
              </Col>
            );
          })}
        </Row>

        <ListFeedbacks
          list={customListFeedback.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt))}
          onRowClick={this.showDetail}
          pagination={{
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              const { dispatch, filter } = this.props;
              if (dispatch) {
                dispatch({ type: 'feedback/fetch', payload: { limit: pageSize, page, ...filter } });
              }
            },
            onShowSizeChange: (current, size) => {
              const { dispatch, filter } = this.props;
              if (dispatch) {
                dispatch({
                  type: 'feedback/fetch',
                  payload: { limit: size, page: current, ...filter },
                });
              }
            },
          }}
        />
        <Drawer
          title={formatMessage({ id: 'feedback.filter-feedback' })}
          placement="right"
          closable={false}
          onClose={this.onCloseFilter}
          visible={visibleFilter}
          width={600}
        >
          <Filter onSearch={this.onCloseFilter} />
        </Drawer>
        <Drawer
          title={formatMessage({ id: 'feedback.detail' })}
          placement="right"
          closable={false}
          onClose={this.onCloseDetail}
          visible={visibleDetail}
          width={400}
        >
          <Detail itemDetail={itemDetail} onCancelDetail={this.onCloseDetail} />
        </Drawer>
      </div>
    );
  }
}

export default Feedbacks;
