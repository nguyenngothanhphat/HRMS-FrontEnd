import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { connect, formatMessage } from 'umi';

import SalaryAcceptanceContent from '../SalaryAcceptanceContent';
import SendEmail from '../../../BackgroundCheck/components/SendEmail';

import styles from './index.less';

@connect(({ candidateInfo: { data: { processStatus = '' } } = {} }) => ({
  processStatus,
}))
class SalaryAcceptance extends PureComponent {
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

  _renderStatus = () => {
    const { processStatus } = this.props;
    console.log(processStatus);
    if (processStatus === 'ACCEPT-PROVISIONAL-OFFER') {
      return (
        <SalaryAcceptanceContent
          radioTitle={formatMessage({ id: 'component.salaryAcceptance.title1' })}
          note={formatMessage({ id: 'component.salaryAcceptance.note1' })}
        />
      );
    }
    if (processStatus === 'RENEGOTIATE-PROVISONAL-OFFER') {
      return (
        <>
          <SalaryAcceptanceContent
            radioTitle={formatMessage({ id: 'component.salaryAcceptance.title2' })}
            note={formatMessage({ id: 'component.salaryAcceptance.note2' })}
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
          />
          <Button type="primary" htmlType="submit">
            {formatMessage({ id: 'component.salaryAcceptance.closeCandidature' })}
          </Button>
        </>
      );
    }
    return null;
  };

  _renderNegotiationForm = () => {
    return (
      <>
        <div className={styles.salaryAcceptanceWrapper}>
          <div className={styles.title}>Step forward</div>
          <div className={styles.content}>
            <a href="#">Schedule a 1-on-1</a> to negotiate the CTC and update the same here.
            <br />
            <br />
            Send the salary structure to the candidate to mark acceptance or
            <br />
            <br />
            <p className={styles.redText}>Close Candidature</p>
          </div>
        </div>
        <SendEmail formatMessage={formatMessage} />
      </>
    );
  };

  render() {
    const { processStatus } = this.props;
    return (
      <div className={styles.salaryAcceptance}>
        <div className={styles.salaryAcceptanceWrapper}>{this._renderStatus()}</div>
        {processStatus === 'RENEGOTIATE-PROVISONAL-OFFER' ? this._renderNegotiationForm() : ''}
      </div>
    );
  }
}

export default SalaryAcceptance;
