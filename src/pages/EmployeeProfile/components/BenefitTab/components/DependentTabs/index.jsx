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
      <div style={{ fontWeight: '600' }}>
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
            <div
              style={{
                height: '64px',
                width: item === 'Legal Name' ? '220px' : '150px',
                fontSize: '16px',
                marginBottom: '30px',
              }}
            >
              <div style={{ fontWeight: '600', marginTop: '30px', marginBottom: '20px' }}>
                {item}
              </div>
              <div>{foo}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
