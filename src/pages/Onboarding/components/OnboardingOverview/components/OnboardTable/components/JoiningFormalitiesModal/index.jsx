import React, { Component } from 'react';
import { Modal, Form, Button, Checkbox, Tooltip } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
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

  convertToEmployee = () => (
    <>
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
    </>
  );

  emptyModal = (dateJoinCandidate) => (
    <div className={styles.headerContent}>
      The date of joining <span className={styles}>{dateJoinCandidate}</span> of this candidate has
      not arrived yet. Please try again!
    </div>
  );

  onFinish = (value) => {
    console.log(value);
  };

  renderFooter = (isTodayDateJoin) => {
    const { handleOpenJoiningFormalitiesModal = () => {} } = this.props;

    if (isTodayDateJoin) {
      return [
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
      ];
    }

    return [
      <Button onClick={() => handleOpenJoiningFormalitiesModal(false)} className={styles.btnCancel}>
        Cancel
      </Button>,
    ];
  };

  render() {
    const {
      handleOpenJoiningFormalitiesModal = () => {},
      visible,
      dateJoinCandidate = '',
    } = this.props;
    const getDayJoin = moment(dateJoinCandidate);
    const isTodayDateJoin = moment().isSame(getDayJoin, 'd');
    return (
      <Modal
        className={styles.joiningFormalitiesModal}
        onCancel={() => handleOpenJoiningFormalitiesModal(false)}
        destroyOnClose
        footer={this.renderFooter(isTodayDateJoin)}
        title={this.renderHeaderModal()}
        centered
        visible={visible}
      >
        {isTodayDateJoin ? this.convertToEmployee() : this.emptyModal(dateJoinCandidate)}
      </Modal>
    );
  }
}

export default JoiningFormalitiesModal;
