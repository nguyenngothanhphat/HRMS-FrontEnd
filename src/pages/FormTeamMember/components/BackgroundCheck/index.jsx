/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Row, Col, Typography, Spin } from 'antd';
import { connect, formatMessage } from 'umi';
import CustomModal from '@/components/CustomModal';
import { map } from 'lodash';
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

@connect(({ candidateInfo: { tempData, data, tableData, currentStep } }) => ({
  tempData,
  data,
  tableData,
  currentStep,
}))
class BackgroundCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('tempData' in props) {
      return {
        tempData: props.tempData,
        data: props.data || {},
      };
    }
    return null;
  }

  componentDidMount() {
    const {
      data,
      tempData: {
        documentList,
        isSentEmail,
        identityProof,
        addressProof,
        educational,
        technicalCertification: { poe },
      },
      dispatch,
    } = this.props;
    console.log('abc');

    // save step
    const { currentStep } = this.props;
    const { candidate = '' } = data;

    if (dispatch && candidate) {
      dispatch({
        type: 'candidateInfo/updateByHR',
        payload: {
          candidate,
          currentStep,
        },
      });
    }

    if (data.documentChecklistSetting !== documentList) {
      console.log('inside');
      const arrToAdjust = JSON.parse(JSON.stringify(data.documentChecklistSetting));
      const arrA = arrToAdjust[0].data.filter((x) => x.value === true);
      const arrB = arrToAdjust[1].data.filter((x) => x.value === true);
      const arrC = arrToAdjust[2].data.filter((x) => x.value === true);
      const arrD = arrToAdjust[3].data.filter((x) => x.value === true);
      const listSelectedA = arrA.map((x) => x.key);
      const listSelectedB = arrB.map((x) => x.key);
      const listSelectedC = arrC.map((x) => x.key);
      const listSelectedD = arrD.map((x) => x.key);
      let isCheckedA;
      let isCheckedB;
      let isCheckedC;
      let isCheckedD;

      if (listSelectedA.length === arrToAdjust[0].data.length) {
        isCheckedA = true;
      }
      if (listSelectedB.length === arrToAdjust[1].data.length) {
        isCheckedB = true;
      }
      if (listSelectedC.length === arrToAdjust[2].data.length) {
        isCheckedC = true;
      }
      if (listSelectedD.length === arrToAdjust[3].data.length) {
        isCheckedD = true;
      }

      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          documentList: data.documentChecklistSetting,
          isSentEmail,
          identityProof: {
            ...identityProof,
            isChecked: isCheckedA,
            checkedList: listSelectedA,
          },
          addressProof: {
            ...addressProof,
            checkedList: listSelectedB,
            isChecked: isCheckedB,
          },
          educational: {
            ...educational,
            checkedList: listSelectedC,
            isChecked: isCheckedC,
          },
          technicalCertification: {
            poe: {
              ...poe,
              checkedList: listSelectedD,
              isChecked: isCheckedD,
            },
          },
        },
      });
    }
  }

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  handleSendEmail = () => {
    const { dispatch } = this.props;
    const {
      tempData: { documentList, employer },
      data: {
        department,
        workLocation,
        reportingManager,
        title,
        employeeType,
        _id,
        fullName,
        position,
        privateEmail,
        workEmail,
        previousExperience,
        salaryStructure,
      },
    } = this.state;
    const newArrToAdjust = JSON.parse(JSON.stringify(documentList));
    newArrToAdjust[3].employer = employer;
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        newArrToAdjust,
      },
    });

    dispatch({
      type: 'candidateInfo/submitPhase1Effect',
      payload: {
        candidate: _id,
        fullName,
        position,
        employeeType: employeeType._id,
        department: department._id,
        title: title._id,
        workLocation: workLocation._id,
        reportingManager: reportingManager._id,
        privateEmail,
        workEmail,
        previousExperience,
        salaryStructure,
        documentChecklistSetting: newArrToAdjust,
        action: 'submit',
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({
          openModal: true,
        });
        dispatch({
          type: 'candidateInfo/saveTemp',
          payload: {
            isSentEmail: true,
          },
        });
      }
    });
  };

  handleValueChange = (e) => {
    const { dispatch } = this.props;
    const value = Object.values(e).find((x) => x);
    dispatch({
      type: 'candidateInfo/saveOrigin',
      payload: {
        privateEmail: value,
      },
    });
  };

  handleMarkAsDone = (user) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        generateLink: user.generateLink,
        isMarkAsDone: true,
      },
    });
    this.setState({
      openModal: true,
    });
  };

  handleSendFormAgain = () => {
    const { dispatch } = this.props;
    const { tempData: { isSentEmail } = {} } = this.state;
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        isSentEmail: !isSentEmail,
      },
    });
  };

  handleChange = (checkedList, arr, item) => {
    const { dispatch } = this.props;
    const { tempData } = this.state;
    const { identityProof, addressProof, educational, technicalCertification } = tempData;
    const { poe } = technicalCertification;
    if (item.type === 'A') {
      arr.map((data) => {
        if (checkedList.includes(data.alias)) {
          data.value = true;
          dispatch({
            type: 'candidateInfo/saveTemp',
            payload: {
              identityProof,
            },
          });
        } else {
          data.value = false;
        }
        return data;
      });
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          identityProof: {
            ...identityProof,
            isChecked: checkedList.length === arr.length,
            checkedList,
          },
        },
      });
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
        type: 'candidateInfo/saveTemp',
        payload: {
          addressProof: {
            ...addressProof,
            isChecked: checkedList.length === arr.length,
            checkedList,
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
        type: 'candidateInfo/saveTemp',
        payload: {
          educational: {
            ...educational,
            isChecked: checkedList.length === arr.length,
            checkedList,
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
        type: 'candidateInfo/saveTemp',
        payload: {
          technicalCertification: {
            ...technicalCertification,
            poe: {
              ...poe,
              isChecked: checkedList.length === arr.length,
              checkedList,
            },
          },
        },
      });
    }
  };

  handleCheckAll = (e, arr, item) => {
    const { tempData } = this.state;
    const { dispatch } = this.props;
    const { identityProof, addressProof, educational, technicalCertification } = tempData;
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
        type: 'candidateInfo/saveTemp',
        payload: {
          identityProof: {
            ...identityProof,
            checkedList: e.target.checked ? arr.map((data) => data.alias) : [],
            isChecked: e.target.checked,
          },
        },
      });
    } else if (item.type === 'B') {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          addressProof: {
            ...addressProof,
            checkedList: e.target.checked ? arr.map((data) => data.alias) : [],
            isChecked: e.target.checked,
          },
        },
      });
    } else if (item.type === 'C') {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          educational: {
            ...educational,
            checkedList: e.target.checked ? arr.map((data) => data.alias) : [],
            isChecked: e.target.checked,
          },
        },
      });
    } else if (item.type === 'D') {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          technicalCertification: {
            ...technicalCertification,
            poe: {
              ...poe,
              checkedList: e.target.checked ? arr.map((data) => data.alias) : [],
              isChecked: e.target.checked,
            },
          },
        },
      });
    }
  };

  onValuesChange = (value) => {
    const { dispatch } = this.props;
    const { employer } = value;
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        employer,
      },
    });
  };

  render() {
    const {
      openModal,
      tempData,
      tempData: { documentList, isSentEmail, isMarkAsDone, generateLink, fullName },
      data: { privateEmail },
    } = this.state;
    const { loading } = this.props;
    return (
      <>
        {loading ? (
          <div className={styles.viewLoading}>
            <Spin />
          </div>
        ) : (
          <>
            <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
              <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
                <div className={styles.eliContainer}>
                  <Warning formatMessage={formatMessage} />
                  <Title formatMessage={formatMessage} />
                  {documentList.length > 0 &&
                    documentList.map((item) => {
                      return (
                        <CollapseFields
                          key={item.id}
                          item={item && item}
                          handleChange={this.handleChange}
                          handleCheckAll={this.handleCheckAll}
                          documentList={documentList}
                          tempData={tempData}
                          onValuesChange={this.onValuesChange}
                        />
                      );
                    })}
                </div>
              </Col>
              <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
                <NoteComponent note={note} />
                <SendEmail
                  title={formatMessage({ id: 'component.eligibilityDocs.sentForm' })}
                  formatMessage={formatMessage}
                  handleSendEmail={this.handleSendEmail}
                  handleChangeEmail={this.handleChangeEmail}
                  handleSendFormAgain={this.handleSendFormAgain}
                  isSentEmail={isSentEmail}
                  generateLink={generateLink}
                  handleMarkAsDone={this.handleMarkAsDone}
                  fullName={fullName}
                  handleValueChange={this.handleValueChange}
                  privateEmail={privateEmail}
                />
              </Col>
            </Row>
            <CustomModal
              open={openModal}
              closeModal={this.closeModal}
              content={
                <ModalContentComponent
                  closeModal={this.closeModal}
                  isSentEmail={isSentEmail}
                  isMarkAsDone={isMarkAsDone}
                  tempData={tempData}
                  privateEmail={privateEmail}
                />
              }
            />
          </>
        )}
      </>
    );
  }
}
export default BackgroundCheck;
