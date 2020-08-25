import React from 'react';
import { Form, Modal, Input } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import UserRemoteSelect from '@/components/UserRemoteSelect';

@Form.create()
@connect(({ reimbursement: { action, item, errors }, loading }) => ({
  loading: loading.models.reimbursement,
  action,
  errors,
  item,
}))
class AssignBox extends React.Component {
  static getDerivedStateFromProps({ visible }) {
    return { visible };
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      visible,
    };
  }

  handleSubmit = e => {
    const { hideAssign } = this;
    const {
      form,
      dispatch,
      item: { id },
    } = this.props;
    e.preventDefault();
    Modal.confirm({
      title: formatMessage({ id: 'reimbursement.assign.email.confirm' }),
      onOk: () => {
        form.validateFieldsAndScroll((err, { email, message }) => {
          if (!err) {
            dispatch({
              type: 'reimbursement/review',
              payload: { action: 'assign', reId: id, email, message },
            }).then(({ errors }) => {
              if (!errors) hideAssign();
            });
          }
        });
      },
    });
  };

  hideAssign = () => {
    const { hideAssign } = this.props;
    if (typeof hideAssign === 'function') hideAssign();
    else this.setState({ visible: false });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible } = this.state;

    return (
      <Modal
        title={formatMessage({ id: 'reimbursement.assign.request.confirm' })}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.hideAssign}
        okText={formatMessage({ id: 'common.assign' })}
        cancelText={formatMessage({ id: 'common.cancel' })}
      >
        <Form.Item
          label={formatMessage({ id: 'creditCard.form.assign' })}
          style={{ marginBottom: 0 }}
        >
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'reimbursement.required.email' }),
              },
              {
                type: 'email',
                message: formatMessage({ id: 'reimbursement.isEmail.email' }),
              },
            ],
            initialValue: '',
          })(<UserRemoteSelect />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'reimbursement.message' })}>
          {getFieldDecorator('message', {
            rules: [
              { required: true, message: formatMessage({ id: 'reimbursement.required.message' }) },
            ],
          })(<Input.TextArea />)}
        </Form.Item>
      </Modal>
    );
  }
}

export default AssignBox;
