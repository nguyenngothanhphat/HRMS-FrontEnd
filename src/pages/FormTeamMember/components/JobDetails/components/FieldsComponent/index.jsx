import React, { PureComponent } from 'react';
import CandidateFieldsComponent from './CandidateFieldsComponent';
import FirstFieldsComponent from './FirstFieldsComponent';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const { dropdownField, handleSelect, candidateField, jobDetail } = this.props;
    return (
      <div className={styles.FieldsComponent}>
        <FirstFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          handleSelect={handleSelect}
          jobDetail={jobDetail}
        />
        <CandidateFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          handleSelect={handleSelect}
          candidateField={candidateField}
          jobDetail={jobDetail}
        />
      </div>
    );
  }
}

export default FieldsComponent;
