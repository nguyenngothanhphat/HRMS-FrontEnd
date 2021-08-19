import React, { PureComponent } from 'react';
import { Typography, Radio, Row, Col, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import CustomModal from '@/components/CustomModal';
import NoteComponent from '@/pages/FormTeamMember/components/NoteComponent';
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
      select: [
        {
          title: 'I hereby accept this salary structure.',
          note: 'You have gone through all the contents of the table and accept the salary as terms of your employment.',
          processStatus: 'ACCEPT-PROVISIONAL-OFFER',
          options: 1,
        },
        {
          title: 'I would like to re-negotiate the salary structure.',
          note: 'You have gone through all the contents of the table. However, I would like to renegotiate.',
          processStatus: 'RENEGOTIATE-PROVISONAL-OFFER',
          options: 2,
        },
        // {
        //   title: 'I would like to reject this offer.',
        //   note: 'You have gone through all the contents of the table and do not accept the offer given to me.',
        //   processStatus: 'DISCARDED-PROVISONAL-OFFER',
        //   options: 3,
        // },
      ],
    };
  }

  componentDidMount = () => {
    const { select } = this.state;
    const { processStatusProp = '', dispatch } = this.props;
    const selectValue = select.find((d) => d.processStatus === processStatusProp);

    if (selectValue && selectValue.options) {
      dispatch({
        type: 'candidatePortal/saveTemp',
        payload: {
          options: selectValue.options,
        },
      });
    }
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  onFinish = (values) => {
    // console.log(values);
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

  _renderSelect = () => {
    const { select } = this.state;
    const { processStatusProp = '' } = this.props;
    const selectValue = select.find((d) => d.processStatus === processStatusProp);

    return (
      <div className={styles.salaryAcceptanceWrapper_select}>
        <div className={styles.title}>
          {formatMessage({ id: 'component.salaryAcceptance.acceptanceTitle' })}
        </div>
        <Radio.Group
          defaultValue={selectValue && selectValue.options ? selectValue.options : 1}
          onChange={this.onChangeSelect}
        >
          {select.map((data) => {
            return (
              <div className={styles.select}>
                <Row>
                  <Col span={3}>
                    <Radio value={data.options} />
                  </Col>
                  <Col span={21}>
                    <p className="radio__title">{data.title}</p>
                  </Col>
                  <Col span={3} />
                  <Col span={21}>
                    <p className="salaryAcceptance__note">{data.note}</p>
                  </Col>
                </Row>
                {/* <Row /> */}
              </div>
            );
          })}
        </Radio.Group>
      </div>
    );
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
        //   type: 'candidateInfo/redirectToOnboardList',
        // });
      }
    });
  };

  _renderSubmitForm = () => {
    const { email, loadingSendEmail } = this.props;
    return (
      <div className={styles.salaryAcceptanceWrapper_select}>
        <div className={styles.title}>
          {' '}
          {formatMessage({ id: 'component.salaryAcceptance.submitForm' })}
        </div>
        <Input value={email} className={styles.formInput} name="email" disabled />
        <Button loading={loadingSendEmail} type="primary" onClick={this.submitForm}>
          {formatMessage({ id: 'component.salaryAcceptance.sendEmail' })}
        </Button>
      </div>
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

  render() {
    const { openModal } = this.state;
    const { options, salaryNote = '' } = this.props;
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          {formatMessage({ id: 'component.salaryAcceptance.note' })}
        </Typography.Text>
      ),
    };
    return (
      <div className={styles.salaryAcceptance}>
        <NoteComponent note={Note} />
        {salaryNote && <SalaryNote />}
        <div className={styles.salaryAcceptanceWrapper}>{this._renderSelect()}</div>
        {options !== 1 && (
          <div className={styles.salaryAcceptanceWrapper}>{this._renderSubmitForm()}</div>
        )}
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
