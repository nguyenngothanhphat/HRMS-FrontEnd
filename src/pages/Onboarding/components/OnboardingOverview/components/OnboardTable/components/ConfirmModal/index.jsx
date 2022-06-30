import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { connect, history } from 'umi';
import classNames from 'classnames';
import { DownOutlined } from '@ant-design/icons';
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
    manager = 'jogi',
    reportees = [
      'Nguyen Phan Tan Det',
      'Tinh Tang Tung',
      'Nguyen Phan Tan Det',
      'Tinh Tang Tung',
      'Nguyen Phan Tan Det',
      'Tinh Tang Tung',
      'Nguyen Phan Tan Det',
      'Tinh Tang Tung',
    ],
  } = props;
  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const next = () => {
    setCurrent(current + 1);
  };

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
            Reporting Manager: <strong>{manager}</strong>
          </div>
          <div className={styles.pageBottom__text}>
            Reportees:{' '}
            {reportees.slice(0, 4).map((t) => (
              <>
                <strong>{t}</strong> ,{' '}
              </>
            ))}
            {reportees.length > 4 && !showMore ? (
              <Button type="text" className={styles.showBtn} onClick={() => setShowMore(true)}>
                +{reportees.length - 4} More <DownOutlined />
              </Button>
            ) : (
              reportees.slice(4, reportees.length).map((t) => (
                <>
                  <strong>{t}</strong> ,{' '}
                </>
              ))
            )}
          </div>
        </div>
      ),
      footer: [
        <Button type="link" onClick={() => onClose()} className={styles.btnLater}>
          Go back
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
          Convert to Employee
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
      </>
    </Modal>
  );
};

export default connect(({ onboard: { joiningFormalities: { employeeData = {} } = {} } }) => ({
  employeeData,
}))(ConfirmModal);
