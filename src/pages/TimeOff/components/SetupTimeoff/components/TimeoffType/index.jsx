import React, { Component } from 'react';
import RuleFrom from './RuleFrom';
import Configure from './Configure';
import styles from './index.less';

class TimeoffType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: 'ruleForm',
    };
  }

  onChangeCasualLeave = () => {
    this.setState({ viewType: 'casualLeave' });
  };

  render() {
    const { viewType } = this.state;
    return (
      <div className={styles.TimeoffType}>
        <div className={styles.TimeoffContain}>
          <div className={styles.TimeoffFrom}>
            {viewType === 'ruleForm' ? (
              <div className={styles.Content}> Select & Configure timeoff types</div>
            ) : (
              <div className={styles.Content}> Configure Casual leave policy </div>
            )}
            {viewType === 'ruleForm' ? (
              <div className={styles.SubContent}>
                You will find below a list of generic timeoffs which every company provides.
                Configue the rules for each timeoff as per your company norms. Also you can add
                timeoffs under each category as per your company requirements. This step will take
                about 80 minutes to complete.
              </div>
            ) : (
              <div className={styles.SubContent}>
                Casual Leave or CL is granted to an eligible employee if they cannot report to work
                due to an unforeseen situation. Casual leave can also be utilised if an eligible
                employee wants to take leave for a couple of days for personal reasons.
              </div>
            )}
          </div>
          {viewType === 'ruleForm' ? (
            <RuleFrom onChangeCasualLeave={this.onChangeCasualLeave} />
          ) : (
            <Configure tabKey={viewType} />
          )}
        </div>
      </div>
    );
  }
}

export default TimeoffType;
