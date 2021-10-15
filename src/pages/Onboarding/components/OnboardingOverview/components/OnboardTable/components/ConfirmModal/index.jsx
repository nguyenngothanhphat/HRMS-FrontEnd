import React from 'react';
import { Modal, Button } from 'antd';
import imgDone from '@/assets/candidatePortal/imgDone.png';
import { connect, history } from 'umi';
import styles from '../../index.less';

const ConfirmModal = (props) => {
  const {
    onCancel = () => {},
    onOk = () => {},
    visible,
    employeeData: {
      generalInfoInfo: { workEmail = '', employeeId = '', userId = '' } = {},
      titleInfo: { name: jobTitle = '' } = {},
      password = '',
    },
  } = props;

  return (
    <Modal
      className={`${styles.joiningFormalitiesModal} ${styles.joiningFormalitiesModal__custom}`}
      onCancel={() => onCancel()}
      destroyOnClose
      footer={[
        <Button type="link" onClick={() => onCancel()} className={styles.btnLater}>
          Maybe later
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          key="submit"
          htmlType="submit"
          onClick={() => {
            onOk();
            history.push(`/directory/employee-profile/${userId}/general-info`);
          }}
        >
          Go to Profile
        </Button>,
      ]}
      centered
      visible={visible}
    >
      <>
        <div className={styles.pageTop}>
          <img src={imgDone} alt="img done" />
          <div className={styles.pageTop__title}>Employee Profile created</div>
          <div className={styles.pageTop__description}>
            The candidate’s employee profile has been created.
          </div>
        </div>
        <div className={styles.pageBottom}>
          <div className={styles.pageBottom__text}>
            User name: <strong>{workEmail}</strong>
          </div>
          <div className={styles.pageBottom__text}>
            Password: <strong>{password}</strong>
          </div>
          <div className={styles.pageBottom__text}>
            Employee ID: <strong>{employeeId}</strong>
          </div>
          <div className={styles.pageBottom__text}>
            Job Title: <strong>{jobTitle}</strong>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default connect(({ onboard: { joiningFormalities: { employeeData = {} } = {} } }) => ({
  employeeData,
}))(ConfirmModal);
