import React, { Component } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import styles from './index.less';

class AddCategoriesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>Add Policies Categories</p>
      </div>
    );
  };

  renderModalContent = () => {};

  render() {
    const { visible } = this.props;
    return (
      <>
        <Modal
          //   className={`${styles.AddTaskModal} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={650}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                form="myForm"
                key="submit"
                htmlType="submit"
                // loading={loadingAddTask}
              >
                Submit
              </Button>
            </>
          }
          title={this.renderModalHeader()}
          centered
          visible={visible}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default AddCategoriesModal;
