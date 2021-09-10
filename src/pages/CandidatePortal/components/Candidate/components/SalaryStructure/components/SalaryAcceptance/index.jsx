import React, { PureComponent } from 'react';
import { Typography, Radio, Row, Col, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import CustomModal from '@/components/CustomModal';
import NoteComponent from '@/pages/NewCandidateForm/components/NoteComponent';
import { getCurrentTenant } from '@/utils/authority';
import ModalContentComponent from '../ModalContentComponent';
import SalaryNote from '../SalaryNote';
import styles from './index.less';

@connect(
  ({
    loading,
    candidatePortal: {
      tempData: { options = 1 },
      assignTo: { generalInfo: { workEmail: email = '' } = {} } = {},
      salaryNote = '',
      data: { processStatus: processStatusProp = '' } = {},
    },
  }) => ({
    processStatusProp,
    options,
    email,
    salaryNote,
    loadingSendEmail: loading.effects['candidatePortal/sendEmailByCandidate'],
  }),
)
class SalaryAcceptance extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      visible: false,
    };
  }

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  onChangeSelect = (e) => {
    const { value } = e.target;
    const { dispatch } = this.props;

    dispatch({
      type: 'candidatePortal/saveTemp',
      payload: {
        options: value,
      },
    });
  };

  submitForm = () => {
    const { dispatch, email, options } = this.props;

    dispatch({
      type: 'candidatePortal/sendEmailByCandidate',
      payload: {
        options,
        hrEmail: email,
        tenantId: getCurrentTenant(),
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({
          openModal: true,
        });
        // dispatch({
        //   type: 'newCandidateForm/redirectToOnboardList',
        // });
      }
    });
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

  render() {
    const { openModal } = this.state;
    const {
      // options,
      salaryNote = '',
    } = this.props;
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          The Salary structure will be sent as a <span>provisional offer</span>. The candidate must
          accept the and acknowledge the salary structure as a part of final negotiation.
          <br />
          <br />
          <span style={{ fontWeight: 'bold', color: '#707177' }}>
            Post acceptance of salary structure, the final offer letter will be sent.
          </span>
        </Typography.Text>
      ),
    };
    return (
      <div className={styles.salaryAcceptance}>
        <NoteComponent note={Note} />
        {salaryNote && <SalaryNote />}
        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={<ModalContentComponent closeModal={this.closeModal} />}
        />
      </div>
    );
  }
}

export default SalaryAcceptance;
