import React, { useEffect, useState } from 'react';
import { Modal, Button, Checkbox, Tooltip } from 'antd';
import moment from 'moment';
import TooltipIcon from '@/assets/tooltip.svg';

import { connect } from 'umi';
import styles from '../../index.less';

const JoiningFormalitiesModal = (props) => {
  const {
    onCancel = () => {},
    onOk = () => {},
    visible,
    candidate: { dateOfJoining = '', candidateId = '' },
    listJoiningFormalities,
    loadingGetEmployeeId,
    dispatch,
  } = props;
  const [checkList, setCheckList] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'onboard/getListJoiningFormalities',
    });
    setCheckList([]);
  }, [candidateId]);

  const renderHeaderModal = () => (
    <div className={styles.headerText}>Initiate Joining Formalities</div>
  );

  const converToEmployee = async () => {
    const response = await dispatch({
      type: 'onboard/getEmployeeId',
      payload: {
        candidateId,
      },
    });
    const { statusCode = '' } = response;
    if (statusCode === 200) onOk();
  };

  const convertToEmployee = () => (
    <>
      <div className={styles.headerContent}>
        Please ensure that the joining formalities checklist have been completed before converting
        the candidate to an employee.
      </div>
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={(value) => setCheckList(value)}
        value={checkList}
      >
        {listJoiningFormalities.map((item) => (
          <div key={item.name}>
            <Checkbox value={item._id}>
              <div className={styles.labelCheckbox}>{item.name}</div>
            </Checkbox>
            <Tooltip
              title={<div className={styles.contentTooltip}>{item.description}</div>}
              color="#fff"
              placement="right"
              overlayClassName={styles.tooltipOverlay}
            >
              <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
            </Tooltip>
          </div>
        ))}
      </Checkbox.Group>
    </>
  );

  const emptyModal = (date) => (
    <div className={styles.headerContent}>
      The date of joining <span className={styles}>{date}</span> of this candidate has not arrived
      yet. Please try again!
    </div>
  );
  const onCloseModal = () => {
    setCheckList([]);
    onCancel();
  };
  const renderFooter = (isTodayDateJoin) => {
    if (isTodayDateJoin) {
      return [
        <Button onClick={onCloseModal} className={styles.btnCancel}>
          Cancel
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
    }

    return [
      <Button onClick={onCloseModal} className={styles.btnCancel}>
        Cancel
      </Button>,
    ];
  };
  const getDayJoin = moment(dateOfJoining);
  const isTodayDateJoin = moment().isAfter(getDayJoin);
  return (
    <Modal
      className={styles.joiningFormalitiesModal}
      onCancel={onCloseModal}
      footer={renderFooter(isTodayDateJoin)}
      title={renderHeaderModal()}
      destroyOnClose
      centered
      visible={visible}
    >
      {isTodayDateJoin ? convertToEmployee() : emptyModal(dateOfJoining)}
    </Modal>
  );
};

export default connect(
  ({ loading, onboard: { joiningFormalities: { listJoiningFormalities = [] } } = {} }) => ({
    listJoiningFormalities,
    loadingGetEmployeeId: loading.effects['onboard/getEmployeeId'],
  }),
)(JoiningFormalitiesModal);
