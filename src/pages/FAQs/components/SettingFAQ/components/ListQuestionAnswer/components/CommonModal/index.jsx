import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';

class AddQuestionAnswer extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  render() {
    const {
      loading,
      visible,
      headerName = '',
      acctionName = '',
      modalContent = () => {},
    } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>{headerName}</p>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.CommonModalFAQ} ${styles.noPadding}`}
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
                loading={loading}
              >
                {acctionName}
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {modalContent}
        </Modal>
      </>
    );
  }
}

export default AddQuestionAnswer;
