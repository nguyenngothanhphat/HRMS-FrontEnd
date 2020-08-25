import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Row, Col, Drawer } from 'antd';
import ExpenseTable from '@/components/ExpenseTable';
import { connect } from 'dva';
import { ReactComponent as FilterIcon } from '@/assets/svg/filter.svg';
import ExFilter from '../../ViewReport/components/ExFilter';
import styles from './index.less';

@connect(
  ({
    bill = {},
    bill: { filter },
    group: { listGroup },
    type: { list: listOfType },
    project: { listProject },
    appSetting,
  }) => ({
    bill,
    listOfType,
    listGroup,
    listProject,
    appSetting,
    filter,
  })
)
class ExpenseList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      key: 'all',
      visibleFilter: false,
    };
  }

  handleFilter = key => {
    this.setState({ key });
    let option = 1;
    const { list = [] } = this.props;
    switch (key) {
      case 'thisMonth':
        option = 1;
        break;
      case 'lastMonth':
        option = 0;
        break;
      case 'all':
        this.setState({
          currentList: list,
        });
        return;
      default:
        option = 1;
        break;
    }
    const today = new Date();
    today.setDate(option);
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const arr = list.filter(item => {
      const day = new Date(item.date);
      return (
        (day > firstDay.getTime() && day < lastDay.getTime()) ||
        day === firstDay.getTime() ||
        day === lastDay.getTime()
      );
    });
    this.setState({
      currentList: arr,
    });
  };

  closeFilter = () => {
    this.setState({ visibleFilter: false });
  };

  openFilter = () => {
    const { bill: { filterTab } = {} } = this.props;
    if (['unreported'].indexOf(filterTab) > -1) {
      this.setState({ visibleFilter: true });
    }
  };

  render() {
    const { list = [], selectedList, isExpBtnDisabled = false } = this.props;
    const { key, visibleFilter, currentList = false } = this.state;
    const boldTextAll = key === 'all' ? 800 : 400;
    const boldTextThisMonth = key === 'thisMonth' ? 800 : 400;
    const boldTextLasMonth = key === 'lastMonth' ? 800 : 400;
    return (
      <div>
        <Row type="flex" justify="space-between" style={{ paddingBottom: '28px' }}>
          <Col span={12}>
            <span className={styles.title}>{formatMessage({ id: 'report.expenses' })}</span>
          </Col>
          <Col style={{ fontSize: '14px', color: '#000', display: 'flex', alignItems: 'center' }}>
            <FilterIcon style={{ fill: 'black', width: 18 }} onClick={this.openFilter} />
            <span
              onClick={() => this.handleFilter('all')}
              className={styles.filterText}
              style={{ fontWeight: boldTextAll }}
            >
              <FormattedMessage id="reimbursement.filter.all" />
            </span>
            |
            <span
              onClick={() => this.handleFilter('thisMonth')}
              className={styles.filterText}
              style={{ fontWeight: boldTextThisMonth }}
            >
              <FormattedMessage id="reimbursement.filter.thisMonth" />
            </span>
            |
            <span
              onClick={() => this.handleFilter('lastMonth')}
              className={styles.filterText}
              style={{ fontWeight: boldTextLasMonth }}
            >
              <FormattedMessage id="reimbursement.filter.lastMonth" />
            </span>
          </Col>
        </Row>
        <ExpenseTable
          selectedList={selectedList}
          {...this.props}
          list={!currentList ? list : currentList}
          isExpBtnDisabled={isExpBtnDisabled}
        />
        <Drawer
          className={styles.filterDrawer}
          title={
            <span className={styles.filterDrawerTitle}>
              {formatMessage({ id: 'common.filter' })}
            </span>
          }
          placement="right"
          destroyOnClose
          visible={visibleFilter}
          onClose={this.closeFilter}
          width={450}
          headerStyle={{ padding: '41px 24px 0 49px', border: 'none' }}
          bodyStyle={{ borderRadius: 4, padding: '26px 50px 28px 50px' }}
        >
          <ExFilter
            list={list}
            closeFilter={this.closeFilter}
            setFirstPage={this.setFirstPage}
            onReset={() => this.handleFilter('all')}
            onFilter={arr => {
              this.setState({
                currentList: arr,
              });
            }}
          />
        </Drawer>
      </div>
    );
  }
}

export default ExpenseList;
