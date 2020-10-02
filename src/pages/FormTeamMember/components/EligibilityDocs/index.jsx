/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Row, Col, Typography } from 'antd';
import { connect, formatMessage } from 'umi';
import CustomModal from '@/components/CustomModal';
import { isEmpty, map } from 'lodash';
import { PageLoading } from '@/layouts/layout/src';
import ModalContentComponent from './components/ModalContentComponent';
import Warning from './components/Warning';
import Title from './components/Title';
import CollapseFields from './components/CollapseFields';
import NoteComponent from '../NoteComponent';
import SendEmail from './components/SendEmail';
import styles from './styles.less';

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

@connect(
  ({
    info: { eligibilityDocs, basicInformation } = {},
    info: { testEligibility, loadingDocumentList },
  }) => ({
    eligibilityDocs,
    basicInformation,
    testEligibility,
    loadingDocumentList,
  }),
)
class EligibilityDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('eligibilityDocs' in props || 'basicInformation' in props) {
      return {
        eligibilityDocs: props.eligibilityDocs,
        basicInformation: props.basicInformation,
        testEligibility: props.testEligibility,
        loadingDocumentList: props.loadingDocumentList || {},
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { eligibilityDocs, testEligibility, basicInformation, loadingDocumentList } = this.state;
    const { workEmail } = basicInformation;
    if (isEmpty(testEligibility)) {
      dispatch({
        type: 'info/fetchDocumentList',
        payload: {
          testEligibility,
          loadingDocumentList,
        },
      });
    }

    dispatch({
      type: 'info/save',
      payload: {
        eligibilityDocs: {
          ...eligibilityDocs,
          email: workEmail,
        },
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

  handleChange = (checkedList, arr, item) => {
    const { dispatch } = this.props;
    const { eligibilityDocs } = this.state;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;
    if (item.type === 'A') {
      arr.map((data) => {
        if (checkedList.includes(data.alias)) {
          data.value = true;
        } else {
          data.value = false;
        }
        return data;
      });
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            identityProof: {
              ...identityProof,
              isChecked: checkedList.length === arr.length,
              listSelected: checkedList,
            },
          },
        },
      });
      // console.log(testEligibility);
    } else if (item.type === 'B') {
      arr.map((data) => {
        if (checkedList.includes(data.alias)) {
          data.value = true;
        } else {
          data.value = false;
        }
        return data;
      });

      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            addressProof: {
              ...addressProof,
              isChecked: checkedList.length === arr.length,
              listSelected: checkedList,
            },
          },
        },
      });
    } else if (item.type === 'C') {
      arr.map((data) => {
        if (checkedList.includes(data.alias)) {
          data.value = true;
        } else {
          data.value = false;
        }
        return data;
      });

      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            educational: {
              ...educational,
              isChecked: checkedList.length === arr.length,
              listSelected: checkedList,
            },
          },
        },
      });
    } else if (item.type === 'D') {
      arr.map((data) => {
        if (checkedList.includes(data.alias)) {
          data.value = true;
        } else {
          data.value = false;
        }
        return data;
      });

      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            technicalCertification: {
              ...technicalCertification,
              poe: {
                ...poe,
                isChecked: checkedList.length === arr.length,
                listSelected: checkedList,
              },
            },
          },
        },
      });
    }
  };

  handleCheckAll = (e, arr, item) => {
    const { eligibilityDocs, testEligibility } = this.state;
    const { dispatch } = this.props;
    const { identityProof, addressProof, educational, technicalCertification } = eligibilityDocs;
    const { poe } = technicalCertification;

    if (e.target.checked) {
      map(arr, (data) => {
        data.value = true;
      });
    } else {
      map(arr, (data) => {
        data.value = false;
      });
    }

    if (item.type === 'A') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            identityProof: {
              ...identityProof,
              listSelected: e.target.checked ? arr.map((data) => data.alias) : [],
              isChecked: e.target.checked,
            },
          },
        },
        testEligibility: [...testEligibility],
      });
    } else if (item.type === 'B') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            addressProof: {
              ...addressProof,
              listSelected: e.target.checked ? arr.map((data) => data.alias) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (item.type === 'C') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            educational: {
              ...educational,
              listSelected: e.target.checked ? arr.map((data) => data.alias) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    } else if (item.type === 'D') {
      dispatch({
        type: 'info/saveEligibilityRequirement',
        payload: {
          eligibilityDocs: {
            ...eligibilityDocs,
            technicalCertification: {
              ...technicalCertification,
              poe: {
                ...poe,
                listSelected: e.target.checked ? arr.map((data) => data.alias) : [],
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
      eligibilityDocs: { email, isSentEmail, isMarkAsDone, generateLink },
      openModal,
      testEligibility,
      loadingDocumentList,
    } = this.state;
    return (
      <>
        {loadingDocumentList === true ? (
          <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
            <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
              <div className={styles.eliContainer}>
                <PageLoading />
              </div>
            </Col>
          </Row>
        ) : (
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
                        item={item && item}
                        handleChange={this.handleChange}
                        handleCheckAll={this.handleCheckAll}
                        testEligibility={testEligibility}
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
                generateLink={generateLink}
                handleMarkAsDone={this.handleMarkAsDone}
              />
            </Col>
          </Row>
        )}
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
      </>
    );
  }
}
export default EligibilityDocs;
