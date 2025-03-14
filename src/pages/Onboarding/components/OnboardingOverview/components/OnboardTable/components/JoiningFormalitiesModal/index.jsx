import { Button, Modal, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';

import styles from '../../index.less';
import DocSubmissionContent from './components/DocSubmissionContent';
import InitiateJoiningContent from './components/InitiateJoiningContent';
import PreJoiningDocContent from './components/PreJoiningDocContent';
import ReportingManagerContent from './components/ReportingStructureContent';
import UserNameContent from './components/UsernameContent';

const JoiningFormalitiesModal = (props) => {
  const {
    onClose = () => {},
    onOk = () => {},
    visible = false,
    candidate = {},
    listJoiningFormalities = [],
    loadingGetEmployeeId = false,
    dispatch,
    loadingCheckUserName = false,
    loadingCreateEmployee = false,
    loadingFetchRookie = false,
    loadingEmployeeList = false,
  } = props;

  const { dateOfJoining = '', _id = '', ticketID = '' } = candidate || {};

  const [checkList, setCheckList] = useState([]);
  const [docSubCheckList, setDocSubCheckList] = useState([]);
  const [preJoinCheckList, setPreJoinCheckList] = useState([]);
  const [callback, setCallback] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    dispatch({
      type: 'onboarding/getListJoiningFormalities',
    });
    // eslint-disable-next-line no-unused-expressions
    _id &&
      dispatch({
        type: 'newCandidateForm/fetchCandidateByRookie',
        payload: {
          rookieID: ticketID,
          tenantId: getCurrentTenant(),
        },
      });
    return () => {
      setCurrent(0);
      setCheckList([]);
      setDocSubCheckList([]);
      setPreJoinCheckList([]);
    };
  }, [_id]);

  // function
  const next = () => {
    setCurrent(current + 1);
    setCallback(undefined);
  };
  const prev = () => {
    setCurrent(current - 1);
    setCallback(undefined);
  };
  const onCloseModal = () => {
    onClose();
  };

  const renderHeaderModal = (title) => <div className={styles.headerText}>{title}</div>;
  const converToEmployee = async () => {
    const response = await dispatch({
      type: 'onboarding/getEmployeeId',
      payload: {
        candidateId: _id,
      },
    });
    const { statusCode = '' } = response;
    if (statusCode === 200) next();
  };

  const emptyModal = (date) => (
    <div className={styles.headerContent}>
      The date of joining <span className={styles}>{date}</span> of this candidate has not arrived
      yet. Please try again!
    </div>
  );

  const getDayJoin = moment(dateOfJoining);
  const isTodayDateJoin = moment().isAfter(getDayJoin);

  const steps = [
    {
      title: 'Documents Submission',
      description: null,
      content: isTodayDateJoin ? (
        <Spin spinning={loadingFetchRookie}>
          <DocSubmissionContent
            docSubCheckList={docSubCheckList}
            setDocSubCheckList={setDocSubCheckList}
            setCallback={(value) => setCallback(value)}
          />
        </Spin>
      ) : (
        emptyModal(dateOfJoining)
      ),
      footer: isTodayDateJoin ? (
        <Button
          className={styles.btnSubmit}
          type="primary"
          disabled={docSubCheckList.length !== callback}
          onClick={next}
          loading={loadingFetchRookie}
        >
          Next
        </Button>
      ) : (
        <Button onClick={onCloseModal} className={styles.btnCancel}>
          Cancel
        </Button>
      ),
    },
    {
      title: 'Pre Joining Documents',
      description:
        'Please ensure all the documents have been submitted before converting the candidate to an employee. If in case there is any document not possible to submit, please remind the candidate submit later.',
      content: (
        <PreJoiningDocContent
          candidateId={_id}
          setCallback={(value) => setCallback(value)}
          preJoinCheckList={preJoinCheckList}
          setPreJoinCheckList={setPreJoinCheckList}
        />
      ),
      footer: [
        <Button onClick={prev} className={styles.btnCancel}>
          Previous
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          onClick={next}
          disabled={preJoinCheckList.length !== callback}
        >
          Next
        </Button>,
      ],
    },
    {
      title: 'Initiate Joining Formalities',
      description:
        'Please ensure that the joining formalities checklist have been completed before converting the candidate to an employee.',
      content: (
        <InitiateJoiningContent
          listJoiningFormalities={listJoiningFormalities}
          checkList={checkList}
          setCheckList={setCheckList}
          setCallback={(value) => setCallback(value)}
        />
      ),

      footer: [
        <Button onClick={prev} className={styles.btnCancel}>
          Previous
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          disabled={checkList.length !== listJoiningFormalities.length && !callback}
          loading={loadingGetEmployeeId}
          onClick={() => converToEmployee()}
        >
          Convert to Employee
        </Button>,
      ],
    },
    {
      title: 'Candidate Username',
      description:
        'The following is the username that is generated for the candidate, you can make any changes to the username if you would like',
      content: <UserNameContent next={next} />,
      footer: [
        <Button onClick={prev} className={styles.btnCancel}>
          Previous
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          form="usernameForm"
          key="submit"
          htmlType="submit"
          loading={loadingCheckUserName || loadingCreateEmployee}
        >
          Next
        </Button>,
      ],
    },
    {
      title: 'Reporting Structure',
      description: 'Please select the reporting manager and reportees to proceed further',
      content: <ReportingManagerContent />,
      footer: [
        <Button onClick={prev} className={styles.btnCancel}>
          Previous
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          form="reportingForm"
          key="submit"
          htmlType="submit"
          onClick={() => onOk()}
          loading={loadingFetchRookie || loadingEmployeeList}
        >
          Next
        </Button>,
      ],
    },
  ];

  return (
    <Modal
      className={styles.joiningFormalitiesModal}
      onCancel={onCloseModal}
      footer={steps[current].footer}
      title={renderHeaderModal(steps[current].title)}
      destroyOnClose
      centered
      visible={visible}
    >
      {!!steps[current].description && (
        <div className={styles.headerContent}>{steps[current].description}</div>
      )}
      {steps[current].content}
    </Modal>
  );
};

export default connect(
  ({ loading, onboarding: { joiningFormalities: { listJoiningFormalities = [] } } = {} }) => ({
    listJoiningFormalities,
    loadingGetEmployeeId: loading.effects['onboarding/getEmployeeId'],
    loadingCheckUserName: loading.effects['onboarding/checkExistedUserName'],
    loadingCreateEmployee: loading.effects['onboarding/createEmployee'],
    loadingFetchRookie: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)(JoiningFormalitiesModal);
