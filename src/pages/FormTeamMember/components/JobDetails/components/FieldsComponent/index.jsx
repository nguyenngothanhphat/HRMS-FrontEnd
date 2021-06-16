import React, { PureComponent } from 'react';
import CandidateFieldsComponent from './CandidateFieldsComponent';
import FirstFieldsComponent from './FirstFieldsComponent';
import styles from './index.less';

class FieldsComponent extends PureComponent {
  render() {
    const {
      dropdownField,
      candidateField,
      departmentList,
      locationList,
      titleList,
      managerList,
      _handleSelect,
      department,
      title,
      workLocation,
      reportingManager,
      candidatesNoticePeriod,
      prefferedDateOfJoining,
      loading1,
      loading2,
      loading3,
      data,
      tempData,
      processStatus,
      disabled,
    } = this.props;
    return (
      <div className={styles.FieldsComponent}>
        <FirstFieldsComponent
          styles={styles.Input}
          dropdownField={dropdownField}
          departmentList={departmentList}
          locationList={locationList}
          titleList={titleList}
          managerList={managerList}
          _handleSelect={_handleSelect}
          department={department}
          title={title}
          workLocation={workLocation}
          reportingManager={reportingManager}
          loading1={loading1}
          loading2={loading2}
          loading3={loading3}
          data={data}
          tempData={tempData}
          processStatus={processStatus}
          disabled={disabled}
        />
        <CandidateFieldsComponent
          _handleSelect={_handleSelect}
          styles={styles.Input}
          candidateField={candidateField}
          candidatesNoticePeriod={candidatesNoticePeriod}
          prefferedDateOfJoining={prefferedDateOfJoining}
        />
      </div>
    );
  }
}

export default FieldsComponent;
