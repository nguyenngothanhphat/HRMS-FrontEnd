import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ loading }) => ({
  loadingDelete: loading.effects['policiesRegulations/deleteCategory'],
}))

class DeleteCategoriesModal extends Component {
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
    const { dispatch, onClose = () => {}, item:{_id:id=''}={} } = this.props;
     dispatch({
       type: 'policiesRegulations/deleteCategory',
       payload: {
         id
       },
     }).then((response) => {
       const { statusCode } = response;
       if (statusCode === 200) {
         onClose();
       }
     });
  };

  render() {
    const { visible, loadingDelete  , item:{name=''}={}} = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Delete Policies Categories</p>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.DeleteTaskModal} ${styles.noPadding}`}
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
                onClick={this.handleFinish}
                htmlType="submit"
                loading={loadingDelete}
              >
                Yes, Delete
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          Are you sure you want to delete the item <strong>{name}</strong>?
        </Modal>
      </>
    );
  }
}

export default DeleteCategoriesModal;
