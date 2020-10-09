import React, { PureComponent } from 'react';
import FilledByCandidate from './FilledByCandidate';
import FilledByHR from './FilledByHR';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const { Tab, jobDetails, HRField, candidateField, _handleSelect } = this.props;
    return (
      <div className={styles.FieldsComponent}>
        <FilledByHR styles={styles.Input} Tab={Tab} jobDetails={jobDetails} HRField={HRField} />
        <FilledByCandidate
          styles={styles.Input}
          candidateField={candidateField}
          _handleSelect={_handleSelect}
        />
      </div>
    );
  }
}

export default FieldsComponent;
