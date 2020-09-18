import React from 'react';
import { formatMessage } from 'umi';
import styles from './styles.less';

export default function DependentTabs(props) {
  const { data, index } = props;
  const name = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.legalName',
  });
  const gender = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.gender',
  });
  const relationship = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.relationship',
  });
  const dob = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.dob',
  });
  return (
    <div className={styles.tab}>
      <div className={styles.dependent}>
        {formatMessage({
          id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.dependent',
        })}{' '}
        {index}
      </div>
      <div className={styles.info}>
        {[name, gender, relationship, dob].map((item) => {
          let foo = '';
          switch (item) {
            case name:
              foo = data.name;
              break;
            case gender:
              foo = data.gender;
              break;
            case relationship:
              foo = data.relationship;
              break;
            case dob:
              foo = data.dob;
              break;
            default:
              return foo;
          }
          return (
            <div className={styles.items}>
              <div style={{ fontWeight: '500', width: '50%' }}>{item}</div>
              <div style={{ color: '#707177', width: '50%' }}>
                <p>{foo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
