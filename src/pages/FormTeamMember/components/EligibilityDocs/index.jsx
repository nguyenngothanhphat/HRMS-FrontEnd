import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Warning from './components/Warning';
import Title from './components/Title';
import CollapseFields from './components/CollapseFields';
import SendEmail from './components/SendEmail';
import styles from './styles.less';

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
      { key: '1', name: 'Offer letter' },
      { key: '2', name: 'Appraisal letter' },
      { key: '3', name: 'Paystubs' },
      { key: '4', name: 'Form 16' },
      { key: '5', name: 'Relieving Letter' },
    ],
  },
];

export default class EligibilityDocs extends PureComponent {
  render() {
    return (
      <>
        <Row gutter={[24, 0]}>
          <Col span={16}>
            <div className={styles.EligibilityDocs}>
              {/* Warning will be shown as user is HR and disappear if user is candidate */}
              <Warning />
              <Title />
              {listCollapse.map((item) => {
                return <CollapseFields key={item.id} item={item} />;
              })}
            </div>
          </Col>
          <Col span={8}>
            <SendEmail />
          </Col>
        </Row>
      </>
    );
  }
}
