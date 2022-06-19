import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { connect, history } from 'umi';
import classNames from 'classnames';
import imgDone from '@/assets/candidatePortal/imgDone.png';
import styles from '../../index.less';

const ConfirmModal = (props) => {
  const {
    onCancel = () => {},
    onOk = () => {},
    onClose = () => {},
    visible,
    employeeData: {
      generalInfoInfo: { workEmail = '', employeeId = '', userId = '' } = {},
      titleInfo: { name: jobTitle = '' } = {},
      password = '',
    },
  } = props;
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  // const prev = () => {
  //   setCurrent(current - 1);
  // };

  const steps = [
    {
      title: 'Almost There!',
      description: "Here's a summary of the candidate's profile",
      content: (
        <div className={classNames(styles.pageBottom, styles.pageBottom__showMore)}>
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
          <div className={styles.pageBottom__text}>
            Reporting Manager: <strong>hihi</strong>
          </div>
          <div className={styles.pageBottom__text}>
            Reporter: <strong>hihi</strong>
          </div>
          <div className={styles.pageBottom__text}>+5 More</div>
        </div>
      ),
      footer: [
        <Button type="link" onClick={() => onClose()} className={styles.btnLater}>
          Cancel
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          key="submit"
          htmlType="submit"
          onClick={() => {
            next();
          }}
        >
          Next
        </Button>,
      ],
    },
    {
      title: 'Employee Profile created',
      description: "The candidate's employee profile has been created.",
      content: (
        <div className={styles.footer}>
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
          </Button>
          <Button type="link" onClick={() => onCancel()} className={styles.btnLater}>
            Maybe later
          </Button>
        </div>
      ),
      footer: null,
    },
  ];

  return (
    <Modal
      className={`${styles.joiningFormalitiesModal} ${styles.joiningFormalitiesModal__custom}`}
      onCancel={() => onCancel()}
      destroyOnClose
      // footer={[
      //   <Button type="link" onClick={() => onCancel()} className={styles.btnLater}>
      //     Maybe later
      //   </Button>,
      //   <Button
      //     className={styles.btnSubmit}
      //     type="primary"
      //     key="submit"
      //     htmlType="submit"
      //     onClick={() => {
      //       onOk();
      //       history.push(`/directory/employee-profile/${userId}/general-info`);
      //     }}
      //   >
      //     Go to Profile
      //   </Button>,
      // ]}
      footer={steps[current].footer}
      centered
      maskClosable={false}
      visible={visible}
    >
      <>
        <div className={styles.pageTop}>
          <img src={imgDone} alt="img done" />
          <div className={styles.pageTop__title}>{steps[current].title}</div>
          <div className={styles.pageTop__description}>{steps[current].description}</div>
        </div>
        {steps[current].content}
        {/* <div className={styles.pageBottom}>
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
        </div> */}
      </>
    </Modal>
  );
};

export default connect(({ onboard: { joiningFormalities: { employeeData = {} } = {} } }) => ({
  employeeData,
}))(ConfirmModal);
