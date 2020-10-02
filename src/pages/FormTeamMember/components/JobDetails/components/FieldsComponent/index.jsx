import React, { PureComponent } from 'react';
import CandidateFieldsComponent from './CandidateFieldsComponent';
import FirstFieldsComponent from './FirstFieldsComponent';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const {
      dropdownField,
      handleSelect,
      candidateField,
      jobDetail,
      departmentList,
      locationList,
      titleList,
      managerList,
      _handleSelect,
    } = this.props;
    return (
      <div className={styles.FieldsComponent}>
        <FirstFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          handleSelect={handleSelect}
          jobDetail={jobDetail}
          departmentList={departmentList}
          locationList={locationList}
          titleList={titleList}
          managerList={managerList}
          _handleSelect={_handleSelect}
        />
        <CandidateFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          handleSelect={handleSelect}
          candidateField={candidateField}
          jobDetail={jobDetail}
          _handleSelect={_handleSelect}
        />
      </div>
    );
  }
}

export default FieldsComponent;
