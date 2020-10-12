/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Typography, Row, Col } from 'antd';
import { connect } from 'umi';
import Warning from './components/Warning';
import Title from './components/Title';
import CollapseFields from './components/CollapseFields';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import SendEmail from './components/SendEmail';
import styles from './index.less';

const Note = {
  title: 'Note',
  data: (
    <Typography.Text>
      Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
      working days for entire process to complete
    </Typography.Text>
  ),
};

const DummyItem = [
  {
    type: 'A',
    name: 'Identity Proof',
    data: [
      {
        name: 'Aahar Card',
        uploaded: false,
      },
      {
        name: 'PAN Card',
        uploaded: false,
      },
      {
        name: 'Passport',
        uploaded: false,
      },
      {
        name: 'Driving License',
        uploaded: false,
      },
      {
        name: 'Voter Card',
        uploaded: false,
      },
    ],
  },
  {
    type: 'B',
    name: 'Address Proof',
    data: [
      {
        name: 'Rental Agreement',
        uploaded: false,
      },
      {
        name: 'Electricity & Utility Bills',
        uploaded: false,
      },
      {
        name: 'Telephone Bills',
        uploaded: false,
      },
    ],
  },
  {
    type: 'C',
    name: 'Educational',
    data: [
      {
        name: 'SSLC',
        uploaded: false,
      },
      {
        name: 'Intermediate/Diploma',
        uploaded: false,
      },
      {
        name: 'Graduation',
        uploaded: false,
      },
      {
        name: 'Post Graduate',
        uploaded: false,
      },
      {
        name: 'PHP/Doctorate',
        uploaded: false,
      },
    ],
  },
  {
    type: 'D',
    name: 'Technical Certifications',
    data: [
      {
        name: 'Offer letter',
        uploaded: false,
      },
      {
        name: 'Appraisal letter',
        uploaded: false,
      },
      {
        name: 'Paystubs',
        uploaded: false,
      },
      {
        name: 'Form 16',
        uploaded: false,
      },
      {
        name: 'Relieving Letter',
        uploaded: false,
      },
    ],
  },
];

@connect(({ candidateProfile: { eliDocs } = {} }) => ({
  eliDocs,
}))
class EligibilityDocs extends PureComponent {
  render() {
    const { eliDocs } = this.props;
    return (
      <div className={styles.EligibilityDocs}>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              <Title />
              {eliDocs.length > 0 &&
                eliDocs.map((item) => {
                  return (
                    <CollapseFields
                      item={item && item}
                      eliDocs={eliDocs}
                      // handleChange={this.handleChange}
                      // handleCheckAll={this.handleCheckAll}
                      // testEligibility={testEligibility}
                      // eligibilityDocs={eligibilityDocs}
                    />
                  );
                })}
            </div>
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={Note} />
            <StepsComponent />

            {/* <SendEmail
              formatMessage={formatMessage}
              handleSendEmail={this.handleSendEmail}
              handleChangeEmail={this.handleChangeEmail}
              handleSendFormAgain={this.handleSendFormAgain}
              email={email}
              isSentEmail={isSentEmail}
              generateLink={generateLink}
              handleMarkAsDone={this.handleMarkAsDone}
              fullName={fullName}
            /> */}
          </Col>
        </Row>
        {/* )} */}
      </div>
    );
  }
}

export default EligibilityDocs;
