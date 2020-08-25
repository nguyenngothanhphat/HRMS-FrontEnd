import React, { Fragment, Component } from 'react';
import { List, Divider, Row, Col, Tag, Button, Menu, Dropdown, Icon, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Currency from '@/components/Currency';
import styles from './CurrencyCard.less';

@connect()
class CurrencyCard extends Component {
  showConfirm = () => {
    const {
      dispatch,
      item: { _id },
    } = this.props;

    Modal.confirm({
      title: formatMessage({
        id: 'currency.remove.confirm',
        defaultMessage: 'Do you want to remove this currency?',
      }),
      onOk() {
        dispatch({ type: 'currency/remove', payload: _id });
      },
    });
  };

  render() {
    const {
      item,
      item: { status, exchanges = [] },
      onClickUpdate,
    } = this.props;
    const menu = (
      <Menu>
        <Menu.Item
          onClick={() => {
            if (typeof onClickUpdate === 'function') onClickUpdate(item);
          }}
        >
          <Icon type="edit" style={{ color: '#1890ff' }} />
          <FormattedMessage id="currency.update" defaultMessage="Update" />
        </Menu.Item>
        <Menu.Item onClick={this.showConfirm}>
          <Icon type="close" style={{ color: '#f5222d' }} />
          <FormattedMessage id="currency.remove" defaultMessage="Remove" />
        </Menu.Item>
      </Menu>
    );

    return (
      item &&
      status && (
        <Fragment>
          <Row gutter={16} type="flex" justify="space-between" align="middle">
            <Col xs={16}>
              <Currency className={styles.name} currency={item} />
            </Col>
            <Col xs={8} style={{ textAlign: 'right' }}>
              <Tag className={styles.status} color={status === 'ACTIVE' ? 'green' : undefined}>
                <FormattedMessage id={status} defaultMessage={status} />
              </Tag>
            </Col>
            <Col xs={24} className={styles['action-col']}>
              <Dropdown overlay={menu} placement="bottomRight">
                <Button type="primary" size="small">
                  {formatMessage({ id: 'common.action' })} <Icon type="down" />
                </Button>
              </Dropdown>
            </Col>
            <Col xs={24}>
              <Divider orientation="left">
                <h4>
                  <FormattedMessage id="exchange.rate" defaultMessage="Exchange rates" />
                </h4>
              </Divider>
            </Col>
          </Row>
          <List
            itemLayout="vertical"
            dataSource={exchanges}
            renderItem={exchange => (
              <List.Item>
                <Row type="flex" justify="space-between">
                  <Col sm={4}>{exchange.to}</Col>
                  <Col sm={12}>{exchange.val}</Col>
                  <Col>{moment(exchange.createdAt).format('DD/MM/YYYY')}</Col>
                </Row>
              </List.Item>
            )}
          />
        </Fragment>
      )
    );
  }
}

export default CurrencyCard;
