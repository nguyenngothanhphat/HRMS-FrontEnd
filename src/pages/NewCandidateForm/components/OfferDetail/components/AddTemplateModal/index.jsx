import { Button, Modal, notification } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import TemplateForm from './components/TemplateForm';
import styles from './index.less';

@connect(({ loading, employeeSetting: { currentTemplate = {} } }) => ({
  currentTemplate,
  loadingAddTemplate: loading.effects['employeeSetting/addCustomTemplate'],
}))
class AddTemplateModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
    };
  }

  componentDidMount = async () => {};

  renderHeaderModal = () => {
    const { titleModal = 'Add Template' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  onFinish = async () => {
    const { content } = this.state;
    const {
      currentTemplate: { title, settings = [] } = {},
      type = '',
      dispatch,
      refreshTemplateList = () => {},
    } = this.props;
    const tenantId = getCurrentTenant();
    dispatch({
      type: 'employeeSetting/addCustomTemplate',
      payload: {
        html: content,
        settings,
        type: type || 'ON_BOARDING',
        title,
        tenantId,
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        notification.success({
          message: 'Create new template successfully',
        });
        this.handleCancel();
        refreshTemplateList(title, res.data._id);
      }
    });
  };

  handleCancel = () => {
    const { handleModalVisible = () => {} } = this.props;
    handleModalVisible(false);
  };

  handlePayload = (content) => {
    this.setState({
      content,
    });
  };

  render() {
    const { visible = false, loadingAddTemplate = false } = this.props;
    const { content } = this.state;

    return (
      <>
        <Modal
          className={styles.AddTemplateModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              disabled={!content}
              onClick={this.onFinish}
              loading={loadingAddTemplate}
            >
              Add
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
          width="600"
        >
          <TemplateForm handlePayload={this.handlePayload} />
        </Modal>
      </>
    );
  }
}

export default AddTemplateModal;
