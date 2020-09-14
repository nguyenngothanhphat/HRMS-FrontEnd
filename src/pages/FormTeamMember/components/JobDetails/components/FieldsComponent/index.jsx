import React, { Component } from 'react';
import CandidateFieldsComponent from './CandidateFieldsComponent';
import FirstFieldsComponent from './FirstFieldsComponent';
import styles from './index.less';
class FieldsComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dropdownField, handleSelect, candidateField } = this.props;
    return (
      <div className={styles.FieldsComponent}>
        <FirstFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          handleSelect={handleSelect}
        />
        <CandidateFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          handleSelect={handleSelect}
          candidateField={candidateField}
        />
      </div>
    );
  }
}

export default FieldsComponent;
