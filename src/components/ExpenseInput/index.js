import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Row, Col, Button, Icon, Drawer } from 'antd';
import BillTable from '@/components/BillTable';
import styles from './index.less';
import ExpenseFilter from '../ExpenseFilter';

class ExpenseInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      const { value: extraList } = nextProps;
      return { extraList };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { value = [] } = props;
    this.state = {
      extraList: value,
      visibleFilter: false,
    };
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(changedValue);
    } else this.setState({ extraList: changedValue });
  };

  closeFilter = () => {
    this.setState({ visibleFilter: false });
  };

  showFilter = () => {
    this.setState({ visibleFilter: true });
  };

  render() {
    const { onRowClick } = this.props;
    const { extraList, visibleFilter } = this.state;
    return (
      <Row>
        <Row type="flex" justify="space-between">
          <Col>
            <FormattedMessage id="reimbursement.expenseList">
              {txt => <span className={styles.title}>{txt}</span>}
            </FormattedMessage>
          </Col>
          <Col>
            <Button className={styles.btnSearch} type="default" onClick={this.showFilter}>
              <FormattedMessage id="bill.table.btn.search" />
              <Icon type="search" />
            </Button>
          </Col>
        </Row>

        <BillTable
          type="input"
          extraList={extraList}
          onSelect={this.triggerChange}
          onRowClick={onRowClick}
        />
        <Drawer
          title={formatMessage({ id: 'common.filter' })}
          placement="right"
          destroyOnClose
          onClose={this.closeFilter}
          visible={visibleFilter}
          width={600}
          bodyStyle={{ height: '100%' }}
        >
          <ExpenseFilter onSearch={this.closeFilter} />
        </Drawer>
      </Row>
    );
  }
}

export default ExpenseInput;
