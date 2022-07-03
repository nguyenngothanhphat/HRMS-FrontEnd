import React, { useEffect, useState } from 'react';
import { Modal, Button, Checkbox, Tooltip, Form, Select, Input, Row, Col, Divider } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import classNames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import TooltipIcon from '@/assets/tooltip.svg';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import Check from '@/assets/changePasswordCheck.svg';
import Resubmit from '@/assets/resubmit.svg';

import styles from '../../index.less';
import ReportingManagerContent from './components/ReportingStructureContent';
import UserNameContent from './components/UsernameContent';
import DocSubmissionContent from './components/DocSubmissionContent';
import PreJoiningDocContent from './components/PreJoiningDocContent';
import InitiateJoiningContent from './components/InitiateJoiningContent';

const JoiningFormalitiesModal = (props) => {
  const {
    onClose = () => {},
    onOk = () => {},
    visible,
    candidate: { dateOfJoining = '', candidateId = '', rookieId = '' },
    listJoiningFormalities,
    loadingGetEmployeeId,
    dispatch,
    loadingCheckUserName,
    loadingCreateEmployee,
    userName,
  } = props;
  const [checkList, setCheckList] = useState([]);
  const [docSubCheckList, setDocSubCheckList] = useState([]);
  const [preJoinCheckList, setPreJoinCheckList] = useState([]);
  const [callback, setCallback] = useState();
  const [validate, setValidate] = useState({ validateStatus: 'success', errorMsg: null });
  const [initalValue, setInitalValue] = useState({});
  const [current, setCurrent] = useState(4);

  useEffect(() => {
    dispatch({
      type: 'onboard/getListJoiningFormalities',
    });
    candidateId &&
      dispatch({
        type: 'newCandidateForm/fetchCandidateByRookie',
        payload: {
          rookieID: rookieId,
          tenantId: getCurrentTenant(),
        },
      });
  }, [candidateId]);
  useEffect(() => {
    setInitalValue({ userName });
  }, [userName]);

  // function
  const next = () => {
    // if(current===0){

    // }
    setCurrent(current + 1);
    setCallback(undefined);
  };
  const prev = () => {
    setCurrent(current - 1);
    setCallback(undefined);
  };
  // const onFinish = async (value) => {
  //   const { userName: name = '' } = value;
  //   if (name) {
  //     const isExistingUserName = await dispatch({
  //       type: 'onboard/checkExistedUserName',
  //       payload: { userName: name },
  //     });
  //     if (isExistingUserName === false) {
  //       const response = await dispatch({
  //         type: 'onboard/createEmployee',
  //         payload: { userName: name, candidateId },
  //       });
  //       const { statusCode = '' } = response;

  //       if (statusCode === 200)
  //         // onOk(value);
  //         next();
  //     } else setValidate({ validateStatus: 'error', errorMsg: 'That username is already taken' });
  //   } else setValidate({ validateStatus: 'error', errorMsg: 'Please input user name' });
  // };
  const onCloseModal = () => {
    setCheckList([]);
    onClose();
  };

  const renderHeaderModal = (title) => <div className={styles.headerText}>{title}</div>;
  // const onSaveRedux = (result) => {
  //   dispatch({
  //     type: 'onboard/saveJoiningFormalities',
  //     payload: {
  //       domain: result,
  //     },
  //   });
  // };
  const converToEmployee = async () => {
    const response = await dispatch({
      type: 'onboard/getEmployeeId',
      payload: {
        candidateId,
      },
    });
    // onSaveRedux(result);
    const { statusCode = '' } = response;
    if (statusCode === 200) next();
    // onOk();
  };

  const emptyModal = (date) => (
    <div className={styles.headerContent}>
      The date of joining <span className={styles}>{date}</span> of this candidate has not arrived
      yet. Please try again!
    </div>
  );

  const renderFooter = (isTodayDateJoin) => {
    // if (isTodayDateJoin) {
    return [
      <Button onClick={prev} className={styles.btnCancel}>
        Previous
      </Button>,
      <Button
        className={styles.btnSubmit}
        type="primary"
        disabled={checkList.length !== listJoiningFormalities.length}
        loading={loadingGetEmployeeId}
        onClick={() => converToEmployee()}
      >
        Convert to Employee
      </Button>,
    ];
    // }

    // return [
    //   <Button onClick={prev} className={styles.btnCancel}>
    //     Cancel
    //   </Button>,
    // ];
  };
  const getDayJoin = moment(dateOfJoining);
  const isTodayDateJoin = moment().isAfter(getDayJoin);

  const steps = [
    {
      title: 'Documents Submission',
      description: null,
      content: isTodayDateJoin ? (
        <DocSubmissionContent
          docSubCheckList={docSubCheckList}
          setDocSubCheckList={setDocSubCheckList}
          setCallback={(value) => setCallback(value)}
        />
      ) : (
        emptyModal(dateOfJoining)
      ),
      footer: isTodayDateJoin ? (
        <Button
          className={styles.btnSubmit}
          type="primary"
          disabled={docSubCheckList.length !== callback}
          onClick={next}
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
          candidateId={candidateId}
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
          // loading={loadingGetEmployeeId}
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
          // isTodayDateJoin={isTodayDateJoin}
          // emptyModal={emptyModal}
          // dateOfJoining={dateOfJoining}
          listJoiningFormalities={listJoiningFormalities}
          checkList={checkList}
          setCheckList={setCheckList}
        />
      ),

      footer: renderFooter(isTodayDateJoin),
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
          form="usernameForm"
          key="submit"
          htmlType="submit"
          loading={loadingCheckUserName || loadingCreateEmployee}
          onClick={() => onOk()}
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
      {steps[current].description !== null && (
        <div className={styles.headerContent}>{steps[current].description}</div>
      )}
      {steps[current].content}
    </Modal>
  );
};

export default connect(
  ({
    loading,
    onboard: { joiningFormalities: { listJoiningFormalities = [], userName = '' } } = {},
  }) => ({
    listJoiningFormalities,
    userName,
    loadingGetEmployeeId: loading.effects['onboard/getEmployeeId'],
    loadingCheckUserName: loading.effects['onboard/checkExistedUserName'],
    loadingCreateEmployee: loading.effects['onboard/createEmployee'],
  }),
)(JoiningFormalitiesModal);
