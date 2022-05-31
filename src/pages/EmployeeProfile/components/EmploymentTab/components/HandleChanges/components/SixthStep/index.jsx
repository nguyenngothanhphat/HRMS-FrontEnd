import React from 'react';
import styles from './styles.less';

export default function SixthStep(props) {
  const { changeData, currentData } = props;

  const {
    newTitle = '',
    newLocation = '',
    newDepartment = '',
    newEmploymentType = '',
    newManager = '',
    newReportees = [],
    stepTwo: { wLocation = '', employment = '', department = '' } = {},
    stepThree: { title = '', reportTo = '', reportees = [] } = {},
    stepFour: { currentAnnualCTC: annualCTC = '', compensationType = '' } = {},
  } = changeData;

  const {
    title: currentTitle = '',
    compensationType: currentCompensationType = '',
    location: currentLocation = '',
    department: currentDepartment = '',
    manager: currentManager = '',
    reportees: currentReportees = [],
    employeeType: currentEmployeeType = '',
    currentAnnualCTC = '',
  } = currentData;

  const renderChangedValue = (oldVal, newVal, label, alternativeVal) => {
    if (oldVal !== newVal && JSON.stringify(oldVal) !== JSON.stringify(newVal) && newVal)
      return (
        <div className={styles.item}>
          <div>{label}:</div>
          <div>
            <div>{alternativeVal || newVal}</div>
          </div>
        </div>
      );
    return '';
  };

  const checkIfChanged = (arr) => {
    return arr.every(
      (x) =>
        x.oldVal !== x.newVal && JSON.stringify(x.oldVal) !== JSON.stringify(x.newVal) && x.newVal,
    );
  };

  const getItems = () => {
    return [
      {
        label: 'Work Location',
        oldVal: currentLocation,
        newVal: wLocation,
        alternativeVal: newLocation,
      },
      {
        label: 'Department',
        oldVal: currentDepartment,
        newVal: department,
        alternativeVal: newDepartment,
      },
      {
        label: 'Title',
        oldVal: currentTitle,
        newVal: title,
        alternativeVal: newTitle,
      },
      {
        label: 'Employee Type',
        oldVal: currentEmployeeType,
        newVal: employment,
        alternativeVal: newEmploymentType,
      },
      {
        label: 'Manager',
        oldVal: currentManager,
        newVal: reportTo,
        alternativeVal: newManager,
      },
      {
        label: 'Reportees',
        oldVal: currentReportees,
        newVal: reportees,
        alternativeVal: newReportees.map((x, i) => (i + 1 !== newReportees.length ? `${x}, ` : x)),
      },
      {
        label: 'Annual CTC',
        oldVal: currentAnnualCTC,
        newVal: annualCTC,
      },
      {
        label: 'Compensation Type',
        oldVal: currentCompensationType,
        newVal: compensationType,
      },
    ];
  };
  return (
    <div>
      <div className={styles.headings}>Please review all the changes below</div>
      {checkIfChanged(getItems())
        ? getItems().map((val) =>
            renderChangedValue(val.oldVal, val.newVal, val.label, val.alternativeVal),
          )
        : 'No changes made'}
    </div>
  );
}
