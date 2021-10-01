import React, { Component } from 'react';
import { Modal, Form, Button, Checkbox, Tooltip } from 'antd';
import { connect } from 'umi';
import TooltipIcon from '@/assets/tooltip.svg';

import styles from './index.less';

class JoiningFormalitiesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderHeaderModal = () => <div className={styles.headerText}>Initiate Joining Formalities</div>;

  contentTooltip = () => (
    <div className={styles.contentTooltip}>
      Ensure that all the documents have been verified beforehand
    </div>
  );

  onFinish = (value) => {
    console.log(value);
  };

  render() {
    const { handleOpenJoiningFormalitiesModal = () => {}, visible } = this.props;

    return (
      <Modal
        className={styles.joiningFormalitiesModal}
        onCancel={() => handleOpenJoiningFormalitiesModal(false)}
        destroyOnClose
        footer={[
          <Button
            onClick={() => handleOpenJoiningFormalitiesModal(false)}
            className={styles.btnCancel}
          >
            Cancel
          </Button>,
          <Button
            className={styles.btnSubmit}
            type="primary"
            form="myForm"
            key="submit"
            htmlType="submit"
            //   loading={loadingReassign}
          >
            Convert to Employee
          </Button>,
        ]}
        title={this.renderHeaderModal()}
        centered
        visible={visible}
      >
        <div className={styles.headerContent}>
          Please ensure that the joining formalities checklist have been completed before converting
          the candidate to an employee.
        </div>
        <Form name="basic" id="myForm" onFinish={this.onFinish}>
          <div className={styles.documentVerification}>
            <Form.Item name="documentVerification">
              <Checkbox>
                <div className={styles.labelCheckbox}>Documents Verification</div>
              </Checkbox>
            </Form.Item>
            <Tooltip
              title={this.contentTooltip}
              color="#fff"
              placement="right"
              overlayClassName={styles.tooltipOverlay}
            >
              <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
            </Tooltip>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default JoiningFormalitiesModal;
