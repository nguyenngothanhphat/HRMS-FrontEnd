import React, { PureComponent } from 'react';
import FilledByCandidate from './FilledByCandidate';
import FilledByHR from './FilledByHR';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const { Tab, HRField, candidateField, _handleSelect, data } = this.props;
    return (
      <div className={styles.FieldsComponent}>
        <FilledByHR styles={styles.Input} Tab={Tab} HRField={HRField} data={data} />
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
