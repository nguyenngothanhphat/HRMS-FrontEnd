import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

connect(({ loading }) => ({
  loadingDelete: loading.effects['policesRegulations/deletepolicy'],
}));

class DeletePolicyModal extends Component {
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
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'policesRegulations/deletepolicy',
    //   payload: value,
    // });
  };

  render() {
    const { visible, loadingDelte } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Delete Policy</p>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.DeletePolicyModal} ${styles.noPadding}`}
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
                loading={loadingDelte}
              >
                Yes, Delete
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          Are you sure you want to delete the item <strong>Policy</strong>?
        </Modal>
      </>
    );
  }
}

export default DeletePolicyModal;
