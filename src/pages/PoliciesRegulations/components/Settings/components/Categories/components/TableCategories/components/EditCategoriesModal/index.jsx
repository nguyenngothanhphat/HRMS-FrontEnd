import React, { Component } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

connect(({ loading }) => ({
  loadingUpdate: loading.effects['policiesregulations/updateCategory'],
}));

class EditCategoriesModal extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  handleFinish = (value) => {
    const { dispatch, onClose = () => {} } = this.props;
    // dispatch({
    //   type: 'policiesRegulations/updateCategory',
    //   payload: value,
    // }).then((response) => {
    //   const { statusCode } = response;
    //   if (statusCode === 200) {
    //     onClose();
    //   }
    // });
  };

  render() {
    const { visible, loadingUpdate = false } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Edit Policies Categories</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form name="basic" id="addForm" ref={this.formRef} onFinish={this.handleFinish}>
            <Row>
              <Col>
                <Form.Item
                  label="Categories Name"
                  name="key"
                  labelCol={{ span: 24 }}
                  rules={[{ required: true, message: 'Please enter the categories name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.EditTaskModal} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={696}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                form="addForm"
                key="submit"
                htmlType="submit"
                loading={loadingUpdate}
              >
                Save Change
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default EditCategoriesModal;
