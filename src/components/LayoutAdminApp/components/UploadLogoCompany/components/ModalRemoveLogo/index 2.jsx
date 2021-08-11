/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';

import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['companiesManagement/updateCompany'],
}))
class ModalRemoveLogo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  renderHeaderModal = () => {
    const { titleModal = 'Remove Logo' } = this.props;

    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  handleRemoveLogo = () => {
    const { dispatch, companyId = '', handleCancel = () => {} } = this.props;
    const tenantId = getCurrentTenant();

    dispatch({
      type: 'companiesManagement/updateCompany',
      payload: { logoUrl: '', id: companyId, tenantId },
      dataTempKept: {},
      isAccountSetup: true,
    }).then((resp) => {
      const { statusCode = 0, data = {} } = resp;
      if (statusCode === 200) {
        dispatch({
          type: 'companiesManagement/saveOrigin',
          payload: { companyDetails: { company: data } },
        });
        handleCancel();
      }
    });
  };

  render() {
    const { visible = false, loading } = this.props;
    return (
      <Modal
        className={styles.modalUpload}
        visible={visible}
        title={this.renderHeaderModal()}
        onOk={this.handleRemoveLogo}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <Button key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={styles.btnSubmit}
            onClick={this.handleRemoveLogo}
          >
            Save
          </Button>,
        ]}
      >
        <div>Are you sure?</div>
      </Modal>
    );
  }
}

export default ModalRemoveLogo;
