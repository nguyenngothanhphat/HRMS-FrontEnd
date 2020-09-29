import React, { Component } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';
import CustomModal from '@/components/CustomModal';
import ModalContentComponent from './components/ModalContentComponent';
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

@connect(({ info: { eligibilityDocs, basicInformation, testEligibility } = {} }) => ({
  eligibilityDocs,
  basicInformation,
  testEligibility,
}))
class EligibilityDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      listTypeASelected: [],
      listTypeBSelected: [],
      listTypeCSelected: [],
      listTypeDSelected: [],
      typeAIsChecked: false,
      typeBIsChecked: false,
      typeCIsChecked: false,
      typeDIsChecked: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('eligibilityDocs' in props || 'basicInformation' in props) {
      return {
        eligibilityDocs: props.eligibilityDocs,
        basicInformation: props.basicInformation,
        testEligibility: props.testEligibility || {},
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { eligibilityDocs, testEligibility } = this.state;
    dispatch({
      type: 'info/fetchDocumentList',
      payload: {
        testEligibility,
      },
    });
  }

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  handleSendEmail = (user) => {
    const { dispatch } = this.props;
    const { eligibilityDocs = {} } = this.state;
    dispatch({
      type: 'info/saveEligibilityRequirement',
      payload: {
        eligibilityDocs: {
          ...eligibilityDocs,
          email: user.email,
          isSentEmail: true,
        },
      },
    });
    this.setState({
      openModal: true,
    });
  };

  handleMarkAsDone = (user) => {
    const { dispatch } = this.props;
    const { eligibilityDocs = {} } = this.state;
    dispatch({
      type: 'info/saveEligibilityRequirement',
      payload: {
        eligibilityDocs: {
          ...eligibilityDocs,
          generateLink: user.generateLink,
          isMarkAsDone: true,
        },
      },
    });
    this.setState({
      openModal: true,
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
    if (value === 'A') {
      // dispatch({
      //   type: 'info/saveEligibilityRequirement',
      //   payload: {
      //     eligibilityDocs: {
      //       ...eligibilityDocs,
      //       identityProof: {
      //         ...identityProof,
      //         listSelected: checkedList,
      //         isChecked: checkedList.length === arr.length,
      //       },
      //     },
      //   },
      // });
      this.setState({
        listTypeASelected: checkedList,
        typeAIsChecked: checkedList.length === arr.length,
      });
    } else if (value === 'B') {
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
      this.setState({
        listTypeBSelected: checkedList,
        typeBIsChecked: checkedList.length === arr.length,
      });
    } else if (value === 'C') {
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
      this.setState({
        listTypeCSelected: checkedList,
        typeCIsChecked: checkedList.length === arr.length,
      });
    } else if (value === 'D') {
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
      this.setState({
        listTypeDSelected: checkedList,
        typeDIsChecked: checkedList.length === arr.length,
      });
    }
  };

  // handleChange2 = (checkedList, arr, type) => {
  //   const {dispatch} = this.props;
  //   const {eligibilityDocs} = this.state;
  //   if(type==='A'){
  //     this.setState({
  //       listTypeASelected: checkedList,
  //       typeAIsChecked: checkedList.length === arr.length,
  //     })
  //     dispatch({
  //       type: 'info/saveEligibilityRequirement',
  //       payload:{
  //         eligibilityDocs:{
  //           ...eligibilityDocs,

  //         }
  //       }
  //     })
  //   }
  // };

  handleCheckAll = (e, arr, value) => {
    const { eligibilityDocs } = this.state;
    const { dispatch } = this.props;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;
    if (value === 'A') {
      // dispatch({
      //   type: 'info/saveEligibilityRequirement',
      //   payload: {
      //     eligibilityDocs: {
      //       ...eligibilityDocs,
      //       identityProof: {
      //         ...identityProof,
      //         listSelected: e.target.checked ? arr.map((data) => data.name) : [],
      //         isChecked: e.target.checked,
      //       },
      //     },
      //   },
      // });
      this.setState({
        listTypeASelected: e.target.checked ? arr.map((data) => data.alias) : [],
        typeAIsChecked: e.target.checked,
      });
      console.log(this.state.listTypeASelected);
      console.log(this.state.typeAIsChecked);
    } else if (value === 'B') {
      this.setState({
        listTypeBSelected: e.target.checked ? arr.map((data) => data.alias) : [],
        typeBIsChecked: e.target.checked,
      });
    } else if (value === 'C') {
      this.setState({
        listTypeCSelected: e.target.checked ? arr.map((data) => data.alias) : [],
        typeCIsChecked: e.target.checked,
      });
    } else if (value === 'D') {
      this.setState({
        listTypeDSelected: e.target.checked ? arr.map((data) => data.alias) : [],
        typeDIsChecked: e.target.checked,
      });
    }
  };

  render() {
    const {
      eligibilityDocs,
      eligibilityDocs: { email, isSentEmail, isMarkAsDone, generateLink },
      openModal,
      basicInformation,
      testEligibility,
      listTypeASelected,
      listTypeBSelected,
      listTypeCSelected,
      listTypeDSelected,
      typeAIsChecked,
      typeBIsChecked,
      typeCIsChecked,
      typeDIsChecked,
    } = this.state;
    const { workEmail } = basicInformation;
    console.log(testEligibility);

    return (
      <>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              <Warning formatMessage={formatMessage} />
              <Title formatMessage={formatMessage} />
              {testEligibility.length > 0 &&
                testEligibility.map((item) => {
                  return (
                    <CollapseFields
                      key={item.id}
                      item={item}
                      handleChange={this.handleChange}
                      handleCheckAll={this.handleCheckAll}
                      eligibilityDocs={eligibilityDocs}
                      testEligibility={testEligibility}
                      listTypeASelected={listTypeASelected}
                      listTypeBSelected={listTypeBSelected}
                      listTypeCSelected={listTypeCSelected}
                      listTypeDSelected={listTypeDSelected}
                      typeAIsChecked={typeAIsChecked}
                      typeBIsChecked={typeBIsChecked}
                      typeCIsChecked={typeCIsChecked}
                      typeDIsChecked={typeDIsChecked}
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
              generateLink={generateLink}
              handleMarkAsDone={this.handleMarkAsDone}
              workEmail={workEmail}
            />
          </Col>
        </Row>
        <CustomModal open={openModal} closeModal={this.closeModal}>
          {openModal && (
            <ModalContentComponent
              closeModal={this.closeModal}
              isSentEmail={isSentEmail}
              isMarkAsDone={isMarkAsDone}
              eligibilityDocs={eligibilityDocs}
            />
          )}
        </CustomModal>
        ;
      </>
    );
  }
}
export default EligibilityDocs;
