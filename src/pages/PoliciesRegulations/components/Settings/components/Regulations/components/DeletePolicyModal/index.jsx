import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ loading, policiesRegulations: { originData: { selectedCountry = '' } } = {} }) => ({
  selectedCountry,
  loadingDelete: loading.effects['policesRegulations/deletepolicy'],
}))
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

  handleFinish = () => {
    const {
      dispatch,
      item: { _id: id = '' } = {},
      onClose = () => {},
      onRefresh = () => {},
      selectedCountry,
    } = this.props;
    dispatch({
      type: 'policiesRegulations/deletePolicy',
      payload: {
        id,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onRefresh(selectedCountry);
        onClose();
      }
    });
  };

  render() {
    const { visible, loadingDelte, item: { namePolicy = '' } = {} } = this.props;
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
                onClick={this.handleFinish}
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
          Are you sure you want to delete the item <strong>{namePolicy}</strong>?
        </Modal>
      </>
    );
  }
}

export default DeletePolicyModal;
