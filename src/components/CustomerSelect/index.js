import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Input, Icon, Modal, List, Form, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ customer: { listCustomer }, loading }) => ({
  listCustomer,
  loading: loading.models.customer,
}))
class CustomerSelect extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    return { value: nextProps.value } || null;
  }

  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      ...value,
      visible: false,
      showForm: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customer/fetch' });
  }

  showModal = () => {
    this.setState({
      visible: true,
      value: '',
    });
    this.trigger();
  };

  handleCancel = () => {
    const { form } = this.props;
    this.setState({
      visible: false,
      showForm: false,
      value: '',
      name: undefined,
    });
    form.resetFields();
  };

  handleChooseGr = ({ _id }) => {
    this.setState({
      visible: false,
      name: undefined,
    });
    this.trigger(_id);
  };

  searchOnChange = ({ target: { value = '' } }) => {
    const { listCustomer } = this.props;
    const { _id } =
      listCustomer.find(gr => gr.name.toLowerCase().indexOf(value.toLowerCase()) > -1) || {};
    this.setState({ name: value }, this.trigger(_id));
  };

  trigger = value => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
  };

  render() {
    const {
      form: { getFieldDecorator },
      listCustomer = [],
      loading,
      disabled,
    } = this.props;
    const { visible, value, showForm, name: nameState } = this.state;
    const cus = listCustomer.find(c => c._id === value);
    const { name } = cus || {};
    const list = listCustomer.filter(
      gr => !nameState || gr.name.toLowerCase().indexOf(nameState.toLowerCase()) > -1
    );

    const titleModal = (
      <span className={styles.titleModal}>
        <FormattedMessage id="common.add-customer" />
      </span>
    );
    const contentModal = (
      <Form layout="horizontal">
        {!showForm && (
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: '',
            })(
              <Input
                onChange={this.searchOnChange}
                className={styles.txtSearch}
                placeholder={formatMessage({ id: 'common.enter-customer' })}
              />
            )}
          </FormItem>
        )}
        <List
          loading={loading}
          header={<div className={styles.titleList}>Recently</div>}
          dataSource={list}
          className={styles.contentList}
          renderItem={item => (
            <List.Item onClick={() => this.handleChooseGr(item)} style={{ cursor: 'pointer' }}>
              {item.name}
            </List.Item>
          )}
        />
      </Form>
    );
    const footerModal = (
      <Row style={{ borderTop: '1px solid #B7B7B7' }}>
        <Col span={24}>
          <Button onClick={this.handleCancel} className={styles.btnFooter}>
            <FormattedMessage id="common.cancel" />
          </Button>
        </Col>
      </Row>
    );
    return (
      <div>
        <Modal
          title={titleModal}
          className={styles.modalGr}
          visible={visible}
          width={440}
          onCancel={this.handleCancel}
          footer={footerModal}
        >
          {contentModal}
        </Modal>
        {disabled ? (
          <Input
            value={name || 'None Customer'}
            placeholder={formatMessage({ id: 'customer.placeholder.please-choose-customer' })}
            className={styles.input}
            readOnly
            suffix={<Icon type="right" />}
          />
        ) : (
          <div onClick={() => this.showModal()}>
            <Input
              value={name || 'None Customer'}
              placeholder={formatMessage({ id: 'customer.placeholder.please-choose-customer' })}
              className={styles.input}
              readOnly
              suffix={<Icon type="right" />}
            />
          </div>
        )}
      </div>
    );
  }
}

export default CustomerSelect;
