import React, { Component } from 'react';
import RuleFrom from './RuleFrom';
import styles from './index.less';

class TimeoffType extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.TimeoffType}>
        <div className={styles.TimeoffContain}>
          <div className={styles.TimeoffFrom}>
            <div className={styles.Content}> Select & Configure timeoff types</div>
            <div className={styles.SubContent}>
              You will find below a list of generic timeoffs which every company provides. Configue
              the rules for each timeoff as per your company norms. Also you can add timeoffs under
              each category as per your company requirements. This step will take about 80 minutes
              to complete.
            </div>
          </div>
          <RuleFrom />
        </div>
      </div>
    );
  }
}

export default TimeoffType;
