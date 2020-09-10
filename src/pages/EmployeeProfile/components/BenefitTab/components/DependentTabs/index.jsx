import React from 'react';
import styles from './styles.less';

export default function DependentTabs(props) {
  const { data, index } = props;
  return (
    <div className={styles.tab}>
      <div style={{ fontWeight: '600' }}>Dependent {index}</div>
      <div className={styles.info}>
        {['Legal Name', 'Gender', 'Relationship', 'Date of Birth'].map((item) => {
          let foo = '';
          switch (item) {
            case 'Legal Name':
              foo = data.name;
              break;
            case 'Gender':
              foo = data.gender;
              break;
            case 'Relationship':
              foo = data.relationship;
              break;
            case 'Date of Birth':
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
