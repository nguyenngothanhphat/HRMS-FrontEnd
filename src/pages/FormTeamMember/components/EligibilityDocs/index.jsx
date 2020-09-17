import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';

import Warning from './components/Warning';
import Title from './components/Title';
import CollapseFields from './components/CollapseFields';
import NoteComponent from '../NoteComponent';
import SendEmail from './components/SendEmail';
import styles from './styles.less';

const listCollapse = [
  {
    id: '1',
    title: 'Type A: Identity Proof',
    items: [
      { key: '1', name: 'Aadhar Card', isRequired: true },
      { key: '2', name: 'PAN', isRequired: true },
      { key: '3', name: 'Passport', isRequired: false },
      { key: '4', name: 'Driving License', isRequired: false },
      { key: '5', name: 'Voter Card', isRequired: false },
    ],
  },
  {
    id: '2',
    title: 'Type B: Address Proof ',
    items: [
      { key: '1', name: 'Rental Agreement', isRequired: false },
      { key: '2', name: 'Electricity & Utility Bills', isRequired: false },
      { key: '3', name: 'Telephone Bills', isRequired: false },
    ],
  },
  {
    id: '3',
    title: 'Type C: Educational ',
    items: [
      { key: '1', name: 'SSLC', isRequired: true },
      { key: '2', name: 'Intermediate/Diploma', isRequired: true },
      { key: '3', name: 'Graduation', isRequired: true },
      { key: '4', name: 'Post Graduate', isRequired: false },
      { key: '5', name: 'PHD/Doctorate', isRequired: false },
    ],
  },
  {
    id: '4',
    title: 'Type D: Technical Certifications',
    items: [
      { key: '1', name: 'Offer letter', isRequired: false },
      { key: '2', name: 'Appraisal letter', isRequired: false },
      { key: '3', name: 'Paystubs', isRequired: false },
      { key: '4', name: 'Form 16', isRequired: false },
      { key: '5', name: 'Relieving Letter', isRequired: false },
    ],
  },
];

const defaultCheckListContainer = listCollapse.map((obj) =>
  obj.items.filter((item) => item.isRequired),
);
console.log(defaultCheckListContainer[0].map((item) => item.isRequired));

const note = {
  title: 'Note',
  data: (
    <>
      <Typography.Text>
        The candidate must upload all required documents. And, the<span> HR must approve </span>the
        documents and mark candidate as eligible.
      </Typography.Text>
      <br />
      <Typography.Paragraph className={styles.boldText}>
        Post this approval, the remaining processes will open for onboarding.
      </Typography.Paragraph>
    </>
  ),
};

@connect(({ info: { eligibilityDocs } = {} }) => ({
  eligibilityDocs,
}))
class EligibilityDocs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if ('eligibilityDocs' in props) {
      return { eligibilityDocs: props.eligibilityDocs || {} };
    }
    return null;
  }

  handleCheckBox = (value) => {
    const { dispatch } = this.props;
    const { eligibilityDocs = {} } = this.state;

    console.log(value);
    // console.log(defaultCheckList);
    dispatch({
      type: 'info/eligibilityDocs',
      payload: {
        eligibilityDocs,
      },
    });
  };

  render() {
    return (
      <>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              {/* Warning will be shown as user is HR and disappear if user is candidate */}
              <Warning />
              <Title />
              {listCollapse.map((item) => {
                const checkHeader = item.items.find((obj) => obj.isRequired);
                return (
                  <CollapseFields
                    key={item.id}
                    item={item}
                    handleCheckBox={this.handleCheckBox}
                    defaultCheckListContainer={defaultCheckListContainer}
                    checkHeader={checkHeader}
                  />
                );
              })}
            </div>
          </Col>
          <Col span={8} className={styles.rightWrapper}>
            <NoteComponent note={note} />
            <SendEmail />
          </Col>
        </Row>
      </>
    );
  }
}
export default EligibilityDocs;
