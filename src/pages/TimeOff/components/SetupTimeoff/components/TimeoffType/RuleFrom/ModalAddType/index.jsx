import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Space, Button } from 'antd';
import styles from './index.less';

export default class ModalAddType extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isDisable: true,
    };
  }

  onCancel = () => {
    this.formRef.current.resetFields();
    const { closeModal } = this.props;
    closeModal();
  };

  onSubmit = (values) => {
    const { onFinish, closeModal, loadingAddType } = this.props;
    onFinish(values);
    if (!loadingAddType) {
      closeModal();
      this.formRef.current.resetFields();
    }
  };

  onFieldsChange = (field) => {
    const { name = [], value = '' } = field[0] || {};
    if (name.indexOf('accrualMethod') > -1) {
      if (value === 'Unlimited') {
        this.setState({
          isDisable: true,
        });
      } else {
        this.setState({
          isDisable: false,
        });
      }
    }
  };

  render() {
    const { isVisible, loadingAddType } = this.props;
    const { isDisable = false } = this.state;
    return (
      <>
        <Modal
          title="Create a new type of leave"
          onCancel={this.onCancel}
          visible={isVisible}
          className={styles.modal__add}
          footer={false}
        >
          <Form
            onFinish={this.onSubmit}
            className={styles.modal__form}
            onFieldsChange={this.onFieldsChange}
            ref={this.formRef}
            layout="vertical"
          >
            <Form.Item className={styles.nameField} label="Name of the leave" name="name">
              <Input placeholder="Input name of the leave" />
            </Form.Item>
            <Form.Item className={styles.noOfDay} label="No of Day" name="noOfDay">
              <Input placeholder="Input name of the leave" />
            </Form.Item>
            <div className={styles.accrualSetting}>
              <p>Accrual Settings</p>
            </div>
            <Form.Item className={styles.nameField} label="Accrual Method" name="accrualMethod">
              <Radio.Group defaultValue="Unlimited">
                <Space direction="vertical">
                  <Radio value="Unlimited">Unlimited</Radio>
                  <Radio value="Days Per Year">Days Per Year </Radio>
                  <Radio value="Hours per hours worked">Hours per week</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item className={styles.noOfDay} label="Vacation Accrual Rate" name="accrualRate">
              <Input disabled={isDisable} addonAfter="Days per year" placeholder="0" />
            </Form.Item>
            <Form.Item className={styles.lastFormItem}>
              <Button className={styles.btnCancel} htmlType="reset" onClick={this.onCancel}>
                Cancel
              </Button>
              <Button loading={loadingAddType} className={styles.btnSubmit} htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
