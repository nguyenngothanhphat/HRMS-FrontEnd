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
    value: 'typeA',
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.passport' }),
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.drivingLicense' }),
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.voterCard' }),
      },
    ],
    defaultItems: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.aadharCard' }),
        title: 'aaharCard',
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.pan' }),
        title: 'pan',
      },
    ],
  },
  {
    id: '2',
    value: 'typeB',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeB' }),
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.rentalAgreement' }),
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.electricityUtilityBills' }),
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.telephoneBills' }),
      },
    ],
    defaultItems: [],
  },
  {
    id: '3',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeC' }),
    value: 'typeC',
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.postGraduate' }),
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.phdDoctorate' }),
      },
    ],
    defaultItems: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.sslc' }),
        title: 'sslc',
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.intermediateDiploma' }),
        title: 'intermediateDiploma',
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.graduation' }),
        title: 'graduation',
      },
    ],
  },
  {
    id: '4',
    title: formatMessage({ id: 'component.eligibilityDocs.TypeD' }),
    value: 'typeD',
    items: [
      {
        key: '1',
        name: formatMessage({ id: 'component.eligibilityDocs.offerLetter' }),
      },
      {
        key: '2',
        name: formatMessage({ id: 'component.eligibilityDocs.appraisalLetter' }),
      },
      {
        key: '3',
        name: formatMessage({ id: 'component.eligibilityDocs.paystubs' }),
      },
      {
        key: '4',
        name: formatMessage({ id: 'component.eligibilityDocs.form16' }),
      },
      {
        key: '5',
        name: formatMessage({ id: 'component.eligibilityDocs.relievingCard' }),
      },
    ],
    defaultItems: [],
  },
];

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
  static getDerivedStateFromProps(props) {
    if ('eligibilityDocs' in props) {
      return { eligibilityDocs: props.eligibilityDocs || {} };
    }
    return null;
  }

  handleSendEmail = (user) => {
    const { dispatch } = this.props;
    const { eligibilityDocs = {} } = this.state;
    const { isSentEmail } = eligibilityDocs;
    dispatch({
      type: 'info/saveEligibilityRequirement',
      payload: {
        eligibilityDocs: {
          ...eligibilityDocs,
          email: user.email,
          isSentEmail: !isSentEmail,
        },
      },
    });
  };

  handleSendFormAgain = () => {
    const { dispatch } = this.props;
    const { eligibilityDocs = {} } = this.state;
    const { isSentEmail } = eligibilityDocs;
    dispatch({
      type: 'info/saveEligibilityRequirement',
      payload: {
        eligibilityDocs: {
          ...eligibilityDocs,
          isSentEmail: !isSentEmail,
        },
      },
    });
  };

  handleChange = (checkedList, arr, value) => {
    const { dispatch } = this.props;
    const { eligibilityDocs } = this.state;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;
    if (value === 'typeA') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            identityProof: {
              ...identityProof,
              listSelected: checkedList,
              isChecked: checkedList.length === arr.length,
            },
          },
        },
      });
    } else if (value === 'typeB') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            addressProof: {
              ...addressProof,
              listSelected: checkedList,
              isChecked: checkedList.length === arr.length,
            },
          },
        },
      });
    } else if (value === 'typeC') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            educational: {
              ...educational,
              listSelected: checkedList,
              isChecked: checkedList.length === arr.length,
            },
          },
        },
      });
    } else if (value === 'typeD') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            technicalCertification: {
              ...technicalCertification,
              poe: {
                ...poe,
                listSelected: checkedList,
                isChecked: checkedList.length === arr.length,
              },
            },
          },
        },
      });
    }
  };

  handleCheckAll = (e, arr, value) => {
    const { eligibilityDocs } = this.state;
    const { dispatch } = this.props;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;
    if (value === 'typeA') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            identityProof: {
              ...identityProof,
              listSelected: e.target.checked ? arr.map((data) => data.name) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (value === 'typeB') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            addressProof: {
              ...addressProof,
              listSelected: e.target.checked ? arr.map((data) => data.name) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (value === 'typeC') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            educational: {
              ...educational,
              listSelected: e.target.checked ? arr.map((data) => data.name) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (value === 'typeD') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            technicalCertification: {
              ...technicalCertification,
              poe: {
                ...poe,
                listSelected: e.target.checked ? arr.map((data) => data.name) : [],
                isChecked: e.target.checked,
              },
            },
          },
        },
      });
    }
  };

  render() {
    const {
      eligibilityDocs,
      eligibilityDocs: { email, isSentEmail },
    } = this.state;
    return (
      <>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              <Warning formatMessage={formatMessage} />
              <Title formatMessage={formatMessage} />
              {listCollapse.map((item) => {
                return (
                  <CollapseFields
                    key={item.id}
                    item={item}
                    handleChange={this.handleChange}
                    handleCheckAll={this.handleCheckAll}
                    eligibilityDocs={eligibilityDocs}
                  />
                );
              })}
            </div>
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={note} />
            <SendEmail
              formatMessage={formatMessage}
              handleSendEmail={this.handleSendEmail}
              handleChangeEmail={this.handleChangeEmail}
              handleSendFormAgain={this.handleSendFormAgain}
              email={email}
              isSentEmail={isSentEmail}
            />
          </Col>
        </Row>
      </>
    );
  }
}
export default EligibilityDocs;
