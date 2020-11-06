import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import CustomModal from '@/components/CustomModal';
import ScheduleModal from '../ScheduleModal';
import pendingIcon from './assets/pendingIcon.png';
import SalaryAcceptanceContent from '../SalaryAcceptanceContent';
import ModalContentComponent from '../ModalContentComponent';

import SendEmail from '../SendEmail';

import styles from './index.less';

@connect(
  ({
    candidateInfo: { tableData = [], data: { _id = '', fullName = '', processStatus = '' } } = {},
  }) => ({
    processStatus,
    _id,
    fullName,
    tableData,
  }),
)
class SalaryAcceptance extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      openModal: false,
    };
  }

  onFinish = (values) => {
    console.log(values);
  };

  // static getDerivedStateFromProps(props) {
  //   if ('salaryStructure' in props) {
  //     return { salaryStructure: props.salaryStructure || {} };
  //   }
  //   return null;
  // }

  // handleChange = (e) => {
  //   const { target } = e;
  //   const { name, value } = target;
  //   const { dispatch } = this.props;

  //   const { salaryStructure = {} } = this.state;
  //   salaryStructure[name] = value;

  //   dispatch({
  //     type: 'info/save',
  //     payload: {
  //       salaryStructure,
  //     },
  //   });
  // };

  onCloseCandidate = () => {
    const { dispatch, _id } = this.props;
    dispatch({
      type: 'candidateInfo/closeCandidate',
      payload: {
        candidate: _id,
      },
    });
  };

  onSendFormAgain = () => {
    const { dispatch, _id, tableData } = this.props;
    dispatch({
      type: 'candidateInfo/editSalaryStructure',
      payload: {
        candidate: _id,
        setting: tableData,
      },
    });
  };

  handleSendEmail = () => {
    const { dispatch, _id, tableData } = this.props;
    dispatch({
      type: 'candidateInfo/editSalaryStructure',
      payload: {
        candidate: _id,
        settings: tableData,
      },
    }).then((res) => {
      if (res?.statusCode === 200) {
        this.setState({
          openModal: true,
        });
      }
    });
  };

  _renderStatus = () => {
    const { processStatus, fullName } = this.props;
    console.log(processStatus);
    if (processStatus === 'ACCEPT-PROVISIONAL-OFFER') {
      return (
        <SalaryAcceptanceContent
          radioTitle={formatMessage({ id: 'component.salaryAcceptance.title1' })}
          note={formatMessage({ id: 'component.salaryAcceptance.note1' })}
          accept
        />
      );
    }
    if (processStatus === 'RENEGOTIATE-PROVISONAL-OFFER') {
      return (
        <>
          <SalaryAcceptanceContent
            radioTitle={formatMessage({ id: 'component.salaryAcceptance.title2' })}
            note={formatMessage({ id: 'component.salaryAcceptance.note2' })}
            accept={false}
          />
        </>
      );
    }
    if (processStatus === 'DISCARDED-PROVISONAL-OFFER') {
      return (
        <>
          <SalaryAcceptanceContent
            radioTitle={formatMessage({ id: 'component.salaryAcceptance.title3' })}
            note={formatMessage({ id: 'component.salaryAcceptance.note3' })}
            accept={false}
          />
          <Button type="primary" onClick={this.onCloseCandidate}>
            {formatMessage({ id: 'component.salaryAcceptance.closeCandidature' })}
          </Button>
        </>
      );
    }
    // if (
    //   processStatus === 'SENT-PROVISIONAL-OFFER' ||
    //   processStatus === 'PENDING-BACKGROUND-CHECK'
    // ) {
    return (
      <div className={styles.pending}>
        <div className={styles.pendingIcon}>
          <img src={pendingIcon} alt="icon" />
        </div>
        <p>
          We are waiting for Mr / Mrs. {fullName} to mark the acceptance of the shared salary
          structure
        </p>
        <Button type="primary" onClick={this.onSendFormAgain}>
          {formatMessage({ id: 'component.salaryAcceptance.sendFormAgain' })}
        </Button>
      </div>
    );
    // }
    // return null;
  };

  _renderNegotiationForm = () => {
    return (
      <>
        <div className={styles.salaryAcceptanceWrapper}>
          <div className={styles.title}>Step forward</div>
          <div className={styles.content}>
            <span className={styles.blueText} onClick={this.handleOpenSchedule}>
              Schedule a 1-on-1
            </span>
            to negotiate the CTC and update the same here.
            <br />
            <br />
            Send the salary structure to the candidate to mark acceptance or
            <br />
            <br />
            <p className={styles.redText} onClick={this.onCloseCandidate}>
              Close Candidature
            </p>
          </div>
        </div>
        <SendEmail formatMessage={formatMessage} handleSendEmail={this.handleSendEmail} />
      </>
    );
  };

  handleOpenSchedule = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  handleCandelSchedule = () => {
    this.setState({
      visible: false,
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  render() {
    const { processStatus } = this.props;
    const { visible, openModal } = this.state;

    return (
      <div className={styles.salaryAcceptance}>
        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={<ModalContentComponent closeModal={this.closeModal} />}
        />
        <ScheduleModal
          visible={visible}
          modalContent="Schedule 1-on-1"
          handleCancel={this.handleCandelSchedule}
        />
        <div className={styles.salaryAcceptanceWrapper}>{this._renderStatus()}</div>
        {processStatus === 'RENEGOTIATE-PROVISONAL-OFFER' ? this._renderNegotiationForm() : ''}
      </div>
    );
  }
}

export default SalaryAcceptance;
