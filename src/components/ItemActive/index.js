import React, { PureComponent } from 'react';
import { Row, Col, Icon } from 'antd';
import s from './index.less';

class ListAccounts extends PureComponent {
  render() {
    const { item, selectedItemId } = this.props;
    const isActive = selectedItemId === item;
    return (
      <Row
        className={isActive ? s.boxItemActive : s.boxItem}
        key={item}
        type="flex"
        justify="space-between"
      >
        <Col span={18}>{item}</Col>
        <Col>
          <Icon type="right" />
        </Col>
      </Row>
    );
  }
}

export default ListAccounts;
