import React, { PureComponent } from 'react';
import { Typography, Radio, Row, Col } from 'antd';
import { connect, formatMessage } from 'umi';

import NoteComponent from '@/pages/FormTeamMember/components/NoteComponent';
import SalaryAcceptanceContent from '../SalaryAcceptanceContent';

import styles from './index.less';

@connect(({ candidateInfo: { data: { processStatus = '' } } = {} }) => ({
  processStatus,
}))
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
          processStatus: 'ACCEPT-PROVISIONAL-OFFER',
        },
        {
          title: 'I would like to re-negotiate the salary structure.',
          note:
            'You have gone through all the contents of the table. However, I would like to renegotiate.',
          processStatus: 'RENEGOTIATE-PROVISONAL-OFFER',
        },
        {
          title: 'I would like to reject this offer.',
          note:
            'You have gone through all the contents of the table and do not accept the offer given to me.',
          processStatus: 'DISCARDED-PROVISONAL-OFFER',
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

  _renderSelect = () => {
    const { select } = this.state;
    return (
      <div className={styles.salaryAcceptanceWrapper_select}>
        <div className={styles.title}>Acceptance of salary structure</div>
        <Radio.Group onChange={this.onChange}>
          {select.map((data) => {
            return (
              <div className={styles.select}>
                <Row>
                  <Col span={3}>
                    <Radio checked value={data.processStatus} />
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
    const Note = {
      title: 'Note',
      data: (
        <Typography.Text>
          The Salary structure has been sent as a provisional offer. The candidate must acknowledge
          the salary structure as a part of final negotiation in order to proceed.
        </Typography.Text>
      ),
    };
    return (
      <div className={styles.salaryAcceptance}>
        <NoteComponent note={Note} />
        <div className={styles.salaryAcceptanceWrapper}>{this._renderSelect()}</div>
      </div>
    );
  }
}

export default SalaryAcceptance;
