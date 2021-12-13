import React, { PureComponent } from 'react';
import CandidateFieldsComponent from './CandidateFieldsComponent';
import FirstFieldsComponent from './FirstFieldsComponent';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const {
      tempData = {},
      data,
      dropdownField,
      candidateField,
      _handleSelect,
      disabled,
    } = this.props;

    const { dateOfJoining } = data;
    const { candidatesNoticePeriod } = tempData;

    return (
      <div className={styles.FieldsComponent}>
        <FirstFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          _handleSelect={_handleSelect}
          data={data}
          tempData={tempData}
          disabled={disabled}
        />
        <CandidateFieldsComponent
          _handleSelect={_handleSelect}
          styles={styles.Input}
          candidateField={candidateField}
          candidatesNoticePeriod={candidatesNoticePeriod}
          prefferedDateOfJoining={dateOfJoining}
        />
      </div>
    );
  }
}

export default FieldsComponent;
