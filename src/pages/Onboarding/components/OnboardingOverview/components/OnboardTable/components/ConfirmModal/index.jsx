import { DownOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import imgDone from '@/assets/candidatePortal/imgDone.png';
import styles from '../../index.less';

const ConfirmModal = (props) => {
  const {
    dispatch,
    onCancel = () => {},
    onOk = () => {},
    onClose = () => {},
    visible,
    employeeData: {
      generalInfoInfo: { workEmail = '', employeeId = '', userId = '' } = {},
      titleInfo: { name: jobTitle = '' } = {},
      password = '',
    },
    userName,
    domain,
    reportingManager,
    title,
    reportees,
    candidate,
    loadingCreateEmployee,
    settingId: { idGenerate = {} },
  } = props;
  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const next = () => {
    setCurrent(current + 1);
  };

  const covertToEmployee = async () => {
    const response = await dispatch({
      type: 'onboard/createEmployee',
      payload: { userName, candidateId: candidate, domain },
    });
    const { statusCode = '' } = response;

    if (statusCode === 200) next();
  };

  const steps = [
    {
      title: 'Almost There!',
      description: "Here's a summary of the candidate's profile",
      content: (
        <div className={classNames(styles.pageBottom, styles.pageBottom__showMore)}>
          <div className={styles.pageBottom__text}>
            User name:{' '}
            <strong>
              {userName}@{domain}
            </strong>
          </div>
          <div className={styles.pageBottom__text}>
            Password: <strong>12345678@Tc</strong>
          </div>
          {/* <div className={styles.pageBottom__text}>
            Employee ID:{' '}
            <strong>
              {idGenerate.prefix}
              {idGenerate.start}
            </strong>
          </div> */}
          <div className={styles.pageBottom__text}>
            Job Title: <strong>{title?.name}</strong>
          </div>
          <div className={styles.pageBottom__text}>
            Reporting Manager: <strong>{reportingManager?.generalInfoInfo.legalName}</strong>
          </div>
          <div className={styles.pageBottom__text}>
            Reportees:{' '}
            {reportees.slice(0, 4).map((t, i) => (
              <>
                <strong>{t?.generalInfoInfo?.legalName}</strong> {i < 3 && ', '}
              </>
            ))}
            {reportees.length > 4 && !showMore ? (
              <Button type="text" className={styles.showBtn} onClick={() => setShowMore(true)}>
                +{reportees.length - 4} More <DownOutlined />
              </Button>
            ) : (
              reportees.slice(4, reportees.length).map((t, i) => (
                <>
                  {reportees.length > i && ', '}
                  <strong>{t?.generalInfoInfo?.legalName}</strong>
                </>
              ))
            )}
          </div>
        </div>
      ),
      footer: [
        <Button type="link" onClick={() => onCancel()} className={styles.btnLater}>
          Go back
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          key="submit"
          htmlType="submit"
          loading={loadingCreateEmployee}
          onClick={covertToEmployee}
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
          <Button type="link" onClick={() => onClose()} className={styles.btnLater}>
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
      onCancel={() => onClose()}
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

export default connect(
  ({
    loading,
    newCandidateForm: {
      tempData: { reportingManager = {}, reportees = [], title = {}, candidate },
    },
    onboard: {
      joiningFormalities: { employeeData = {}, userName = '', domain = '', settingId = {} } = {},
    },
  }) => ({
    employeeData,
    userName,
    domain,
    reportingManager,
    reportees,
    settingId,
    title,
    candidate,
    loadingCreateEmployee: loading.effects['onboard/createEmployee'],
  }),
)(ConfirmModal);
