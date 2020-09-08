import React, { PureComponent } from 'react';
import Warning from './components/Warning';
import Title from './components/Title';
import CollapseFields from './components/CollapseFields';
import styles from './styles.less';

// eslint-disable-next-line no-unused-vars
const listCollapse = [
  {
    id: '1',
    title: 'Type A: Identity Proof',
    items: [
      { key: '1', name: 'Aadhar Card*' },
      { key: '2', name: 'PAN*' },
      { key: '3', name: 'Passport' },
      { key: '4', name: 'Driving License' },
      { key: '5', name: 'Voter Card' },
    ],
  },
  {
    id: '2',
    title: 'Type B: Address Proof ',
    items: [
      { key: '1', name: 'Rental Agreement' },
      { key: '2', name: 'Electricity & Utility Bills' },
      { key: '3', name: 'Telephone Bills' },
    ],
  },
  {
    id: '3',
    title: 'Type C: Educational ',
    items: [
      { key: '1', name: 'SSLC*' },
      { key: '2', name: 'Intermediate/Diploma*' },
      { key: '3', name: 'Graduation*' },
      { key: '4', name: 'Post Graduate' },
      { key: '5', name: 'PHD/Doctorate' },
    ],
  },
  {
    id: '4',
    title: 'Type D: Technical Certifications',
    items: [
      { key: '1', name: 'Aadhar Card*' },
      { key: '2', name: 'PAN*' },
      { key: '3', name: 'Passport' },
      { key: '4', name: 'Driving License' },
      { key: '5', name: 'Voter Card' },
    ],
  },
];

export default class EligibilityDocs extends PureComponent {
  render() {
    return (
      <div className={styles.EligibilityDocs}>
        {/* Warning will be shown as user is HR and disappear if user is candidate */}
        <Warning />
        <Title />
        <CollapseFields />
      </div>
    );
  }
}
