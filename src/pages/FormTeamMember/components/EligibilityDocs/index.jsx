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
    title: formatMessage({ id: 'component.eligibilityDocs.TypeA' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.aadharCard' }),
        isRequired: true,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.pan' }),
        isRequired: true,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.passport' }),
        isRequired: false,
      },
      {
        key: '4',
        name: formatMessage({ id: 'component.eligibilityDocs.drivingLicense' }),
        isRequired: false,
      },
      {
        key: '5',
        name: formatMessage({ id: 'component.eligibilityDocs.voterCard' }),
        isRequired: false,
      },
    ],
  },
  {
    id: '2',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeB' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.rentalAgreement' }),
        isRequired: false,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.electricityUtilityBills' }),
        isRequired: false,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.telephoneBills' }),
        isRequired: false,
      },
    ],
  },
  {
    id: '3',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeC' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.sslc' }),
        isRequired: true,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.intermediateDiploma' }),
        isRequired: true,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.graduation' }),
        isRequired: true,
      },
      {
        key: '4',
        name: formatMessage({ id: 'component.eligibilityDocs.postGraduate' }),
        isRequired: false,
      },
      {
        key: '5',
        name: formatMessage({ id: 'component.eligibilityDocs.phdDoctorate' }),
        isRequired: false,
      },
    ],
  },
  {
    id: '4',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeD' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.offerLetter' }),
        isRequired: false,
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.appraisalLetter' }),
        isRequired: false,
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.paystubs' }),
        isRequired: false,
      },
      {
        key: '4',
        name: formatMessage({ id: 'component.eligibilityDocs.form16' }),
        isRequired: false,
      },
      {
        key: '5',
        name: formatMessage({ id: 'component.eligibilityDocs.relievingCard' }),
        isRequired: false,
      },
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
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;

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
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              {/* Warning will be shown as user is HR and disappear if user is candidate */}
              <Warning formatMessage={formatMessage} />
              <Title formatMessage={formatMessage} />
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
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={note} />
            <SendEmail formatMessage={formatMessage} />
          </Col>
        </Row>
      </>
    );
  }
}
export default EligibilityDocs;
