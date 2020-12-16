import React, { PureComponent } from 'react';
import FilledByCandidate from './FilledByCandidate';
import FilledByHR from './FilledByHR';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const { Tab, HRField, candidateField, _handleSelect, data } = this.props;
    const { dateOfJoining = '', noticePeriod = '' } = data;
    return (
      <div className={styles.FieldsComponent}>
        <FilledByHR styles={styles.Input} Tab={Tab} HRField={HRField} data={data} />
        <FilledByCandidate
          styles={styles.Input}
          candidateField={candidateField}
          _handleSelect={_handleSelect}
          dateOfJoining={dateOfJoining}
          noticePeriod={noticePeriod}
        />
      </div>
    );
  }
}

export default FieldsComponent;
