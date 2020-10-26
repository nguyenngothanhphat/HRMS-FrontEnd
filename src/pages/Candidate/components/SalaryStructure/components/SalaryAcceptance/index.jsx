import React, { PureComponent } from 'react';
import { Typography, Radio, Row, Col, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import NoteComponent from '@/pages/FormTeamMember/components/NoteComponent';

import styles from './index.less';

@connect(
  ({
    candidateProfile: {
      tempData: { options = 1 },
      generatedBy: { user: { email = '' } = {} } = {},
    },
    candidateInfo: { data: { processStatus = '' } } = {},
  }) => ({
    processStatus,
    options,
    email,
  }),
)
class SalaryAcceptance extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      select: [
        {
          title: 'I hereby accept this salary structure.',
          note:
            'You have gone through all the contents of the table and accept the salary as terms of your employment.',
          // processStatus: 'ACCEPT-PROVISIONAL-OFFER',
          options: 1,
        },
        {
          title: 'I would like to re-negotiate the salary structure.',
          note:
            'You have gone through all the contents of the table. However, I would like to renegotiate.',
          // processStatus: 'RENEGOTIATE-PROVISONAL-OFFER',
          options: 2,
        },
        {
          title: 'I would like to reject this offer.',
          note:
            'You have gone through all the contents of the table and do not accept the offer given to me.',
          // processStatus: 'DISCARDED-PROVISONAL-OFFER',
          options: 3,
        },
      ],
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

  onChangeSelect = (e) => {
    const { value } = e.target;
    const { dispatch } = this.props;

    dispatch({
      type: 'candidateProfile/save',
      payload: {
        tempData: {
          options: value,
        },
      },
    });
  };

  _renderSelect = () => {
    const { select } = this.state;
    return (
      <div className={styles.salaryAcceptanceWrapper_select}>
        <div className={styles.title}>
          {formatMessage({ id: 'component.salaryAcceptance.acceptanceTitle' })}
        </div>
        <Radio.Group defaultValue={1} onChange={this.onChangeSelect}>
          {select.map((data) => {
            return (
              <div className={styles.select}>
                <Row>
                  <Col span={3}>
                    <Radio checked value={data.options} />
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
      type: 'candidateProfile/updateByCandidateModel',
      payload: {
        options,
        hrEmail: email,
      },
    });
  };

  _renderSubmitForm = () => {
    const { email } = this.props;
    console.log(email);
    return (
      <div className={styles.salaryAcceptanceWrapper_select}>
        <div className={styles.title}>
          {' '}
          {formatMessage({ id: 'component.salaryAcceptance.submitForm' })}
        </div>
        <Input value={email} className={styles.formInput} name="email" disabled />
        <Button type="primary" onClick={this.submitForm}>
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
    const { options } = this.props;
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
        <div className={styles.salaryAcceptanceWrapper}>{this._renderSelect()}</div>

        {options !== 1 && (
          <div className={styles.salaryAcceptanceWrapper}>{this._renderSubmitForm()}</div>
        )}
      </div>
    );
  }
}

export default SalaryAcceptance;
