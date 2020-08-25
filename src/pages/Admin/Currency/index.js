import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { Card, Button, Icon, Modal, Row, Col } from 'antd';
import styles from './index.less';
import CurrencyCard from './CurrencyCard';
import CurrencyForm from './CurrencyForm';

@connect(({ currency: { list }, loading }) => ({
  list,
  loading: loading.effects['currency/fetch'],
}))
class CurrencyPage extends Component {
  state = { visible: false };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'currency/fetch' });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleClickUpdate = ({ _id }) => {
    this.setState({ visible: _id });
  };

  handleSuccess = () => {
    this.setState({ visible: false });
    const { dispatch } = this.props;
    dispatch({ type: 'currency/fetch' });
  };

  render() {
    const { list = [], loading } = this.props;
    const { visible } = this.state;
    let newList = list;
    if (loading && list.length === 0)
      newList = Array.from(Array(5), (_, index) => ({ _id: index }));
    newList = [{ _id: 'add' }, ...newList];
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <FormattedMessage id="currency.description" />
        </div>
        <Row gutter={16} type="flex" className={styles.content} justify="start">
          {newList.map((item, index) => (
            <Col key={item._id} xs={24} sm={12} lg={8} className={styles.item}>
              <Card loading={loading} className={styles.card} bodyStyle={{ height: '100%' }}>
                {index === 0 ? (
                  <Button type="dashed" className={styles['btn-add']} onClick={this.showModal}>
                    <Icon type="plus" />{' '}
                    <FormattedMessage id="currency.add" defaultMessage="Add currency" />
                  </Button>
                ) : (
                  <CurrencyCard item={item} onClickUpdate={this.handleClickUpdate} />
                )}
              </Card>
            </Col>
          ))}
        </Row>
        {visible && (
          <Modal
            title={formatMessage(
              typeof visible === 'string'
                ? { id: 'currency.update', defaultMessage: 'Update currency' }
                : { id: 'currency.add', defaultMessage: 'Add currency' }
            )}
            visible={!!visible}
            footer={false}
            onCancel={this.handleCancel}
          >
            <CurrencyForm onSuccess={this.handleSuccess} id={visible} />
          </Modal>
        )}
      </div>
    );
  }
}

export default CurrencyPage;
