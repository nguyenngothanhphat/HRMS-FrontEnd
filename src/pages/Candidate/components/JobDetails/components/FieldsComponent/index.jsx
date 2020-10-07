import React, { PureComponent } from 'react';
import FilledByCandidate from './FilledByCandidate';
import FilledByHR from './FilledByHR';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const { Tab, jobDetails } = this.props;
    return (
      <div className={styles.FieldsComponent}>
        <FilledByHR styles={styles.Input} Tab={Tab} jobDetails={jobDetails} />
        <FilledByCandidate styles={styles.Input} />
      </div>
    );
  }
}

export default FieldsComponent;
