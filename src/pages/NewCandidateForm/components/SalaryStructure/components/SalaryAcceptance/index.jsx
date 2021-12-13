import React, { PureComponent } from 'react';
import { notification, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import CustomModal from '@/components/CustomModal';
import { getCurrentTenant } from '@/utils/authority';
import ScheduleModal from '../ScheduleModal';
import pendingIcon from './assets/pendingIcon.png';
import SalaryAcceptanceContent from '../SalaryAcceptanceContent';
import ModalContentComponent from '../ModalContentComponent';

import SendEmail from '../SendEmail';

import styles from './index.less';

@connect(
  ({
    loading,
    newCandidateForm: {
      data: {
        _id = '',
        firstName = '',
        middleName = '',
        lastName = '',
        processStatus = '',
        privateEmail = '',
        salaryStructure: { status: salaryAcceptanceStatus = '', settings = [] },
      },
    } = {},
  }) => ({
    processStatus,
    privateEmail,
    _id,
    firstName,
    middleName,
    lastName,
    settings,
    salaryAcceptanceStatus,
    loadingCloseCandidate: loading.effects['newCandidateForm/closeCandidate'],
    loadingSendFormAgain: loading.effects['newCandidateForm/editSalaryStructure'],
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

  // onFinish = (values) => {};

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
      type: 'newCandidateForm/closeCandidate',
      payload: {
        candidate: _id,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        notification.success({
          message: 'Candidate closed!',
        });
        dispatch({
          type: 'newCandidateForm/redirectToOnboardList',
        });
      }
    });
  };

  onSendFormAgain = () => {
    const { dispatch, _id, settings } = this.props;
    dispatch({
      type: 'newCandidateForm/editSalaryStructure',
      payload: {
        tenantId: getCurrentTenant(),
        candidate: _id,
        settings,
      },
    });
  };

  handleSendEmail = () => {
    const { dispatch, _id, settings } = this.props;
    dispatch({
      type: 'newCandidateForm/editSalaryStructure',
      payload: {
        tenantId: getCurrentTenant(),
        candidate: _id,
        settings,
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
    const { salaryAcceptanceStatus, firstName, middleName, lastName, loadingSendFormAgain } =
      this.props;
    const fullName = `${firstName} ${lastName} ${middleName}`;
    if (salaryAcceptanceStatus === 'ACCEPTED') {
      return (
        <SalaryAcceptanceContent
          radioTitle={formatMessage({ id: 'component.salaryAcceptance.title1' })}
          note={formatMessage({ id: 'component.salaryAcceptance.note1' })}
          accept
        />
      );
    }
    if (salaryAcceptanceStatus === 'RENEGOTIATE') {
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

    return (
      <div className={styles.pending}>
        <div className={styles.pendingIcon}>
          <img src={pendingIcon} alt="icon" />
        </div>
        <p>
          We are waiting for Mr / Mrs. {fullName} to mark the acceptance of the shared salary
          structure
        </p>
        <Button type="primary" loading={loadingSendFormAgain} onClick={this.onSendFormAgain}>
          {formatMessage({ id: 'component.salaryAcceptance.sendFormAgain' })}
        </Button>
      </div>
    );
    // }
    // return null;
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  render() {
    const { openModal } = this.state;

    return (
      <div className={styles.salaryAcceptance}>
        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={<ModalContentComponent closeModal={this.closeModal} />}
        />
        <div className={styles.salaryAcceptanceWrapper}>{this._renderStatus()}</div>
      </div>
    );
  }
}

export default SalaryAcceptance;
