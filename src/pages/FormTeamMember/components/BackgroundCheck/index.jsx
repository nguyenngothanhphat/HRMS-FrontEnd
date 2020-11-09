/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Row, Col, Typography, Spin, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import CustomModal from '@/components/CustomModal';
import { map, isEmpty } from 'lodash';
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
  ({ candidateInfo: { tempData, checkMandatory, data, tableData, currentStep }, loading }) => ({
    tempData,
    data,
    tableData,
    currentStep,
    checkMandatory,
    loading4: loading.effects['candidateInfo/submitPhase1Effect'],
  }),
)
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
      data = {},
      tempData: {
        documentList,
        identityProof,
        addressProof,
        educational,
        technicalCertification: { poe },
      },
      dispatch,
    } = this.props;
    // save step
    const { currentStep } = this.props;
    const currentStepLocal = localStorage.getItem('currentStep') || currentStep;
    const { candidate = '', processStatus } = data;

    if (dispatch && candidate) {
      dispatch({
        type: 'candidateInfo/updateByHR',
        payload: {
          candidate,
          currentStep: currentStepLocal,
        },
      });
    }
    if (data.documentChecklistSetting !== documentList) {
      const arrToAdjust =
        processStatus === 'DRAFT' && !isEmpty(documentList)
          ? JSON.parse(JSON.stringify(documentList))
          : JSON.parse(JSON.stringify(data.documentChecklistSetting));
      console.log('arr', arrToAdjust);
      console.log('process', processStatus);
      console.log('documentList', documentList);
      console.log('data', data.documentChecklistSetting);
      const arrA = arrToAdjust.length > 0 && arrToAdjust[0].data.filter((x) => x.value === true);
      const arrB = arrToAdjust.length > 0 && arrToAdjust[1].data.filter((x) => x.value === true);
      const arrC = arrToAdjust.length > 0 && arrToAdjust[2].data.filter((x) => x.value === true);
      const arrD = arrToAdjust.length > 0 && arrToAdjust[3].data.filter((x) => x.value === true);
      const listSelectedA = arrA.map((x) => x.alias);
      const listSelectedB = arrB.map((x) => x.alias);
      const listSelectedC = arrC.map((x) => x.alias);
      const listSelectedD = arrD.map((x) => x.alias);
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
          documentList: processStatus === 'DRAFT' ? documentList : data.documentChecklistSetting,
          isSentEmail: processStatus !== 'DRAFT',
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
    window.addEventListener('unload', this.handleUnload, false);
    this.checkBottomBar();
  }

  componentWillUnmount() {
    // const { data } = this.state;
    const { dispatch, tempData, processStatus } = this.props;
    console.log('pro', processStatus);
    // console.log('current', currentStep);
    // const { _id } = data;
    // dispatch({
    //   type: 'candidateInfo/updateByHR',
    //   payload: {
    //     candidate: _id,
    //     currentStep,
    //   },
    // });
    if (processStatus === 'SENT-PROVISIONAL-OFFER') {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          ...tempData,
          employer: '',
          checkValidation: undefined,
          isSentEmail: true,
        },
      });
    } else if (processStatus === 'DRAFT') {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          ...tempData,
          employer: '',
          checkValidation: undefined,
          isSentEmail: false,
        },
      });
    }
    this.handleUpdateByHR();
    window.removeEventListener('unload', this.handleUnload, false);
  }

  handleUnload = () => {
    this.handleUpdateByHR();
    const { currentStep } = this.props;
    localStorage.setItem('currentStep', currentStep);
  };

  handleUpdateByHR = () => {
    const { data } = this.state;
    const { dispatch } = this.props;
    const { _id } = data;
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate: _id,
      },
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  changeValueToFinalOffer = (e) => {
    const { dispatch, tempData, checkMandatory } = this.props;
    // console.log('e', e.target.value);
    if (e.target.value === 1) {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            valueToFinalOffer: 1,
          },
          checkMandatory: {
            ...checkMandatory,
            filledBackgroundCheck: true,
          },
        },
      });
    } else {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            valueToFinalOffer: 0,
          },
          checkMandatory: {
            ...checkMandatory,
            filledBackgroundCheck: false,
          },
        },
      });
    }
  };

  handleSendEmail = () => {
    const { dispatch } = this.props;
    const {
      tempData: { documentList, employer, employeeType },
      data,
      data: {
        department,
        workLocation,
        reportingManager,
        title,
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
    console.log('data', data);
    newArrToAdjust[3].employer = employer;
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        newArrToAdjust,
      },
    });
    if (employer.length <= 0) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: false,
        },
      });
    } else {
      dispatch({
        type: 'candidateInfo/submitPhase1Effect',
        payload: {
          candidate: _id,
          fullName,
          position,
          employeeType,
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
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: true,
        },
      });
    }
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
    if (employer.length > 0) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: true,
        },
      });
    } else {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: false,
        },
      });
    }
  };

  checkBottomBar = () => {
    const {
      tempData: { valueToFinalOffer, checkStatus },
      checkMandatory,
      dispatch,
    } = this.props;
    if (valueToFinalOffer === 1) {
      checkStatus.filledBackgroundCheck = true;
      console.log('a');
    } else {
      checkStatus.filledBackgroundCheck = false;
      console.log('b');
    }
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        checkMandatory: {
          ...checkMandatory,
          filledBackgroundCheck: checkStatus.filledBackgroundCheck,
        },
      },
    });
  };

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledBackgroundCheck } = checkMandatory;
    return !filledBackgroundCheck ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  onClickPrev = () => {
    const { currentStep } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep - 1,
      },
    });
  };

  _renderBottomBar = () => {
    const { checkMandatory } = this.props;
    const { filledBackgroundCheck } = checkMandatory;
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>{this._renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              {' '}
              <Button
                type="secondary"
                onClick={this.onClickPrev}
                className={styles.bottomBar__button__secondary}
              >
                Previous
              </Button>
              <Button
                type="primary"
                onClick={this.onClickNext}
                className={`${styles.bottomBar__button__primary} ${
                  !filledBackgroundCheck ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!filledBackgroundCheck}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  onClickNext = () => {
    const { currentStep } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
        valueToFinalOffer: 1,
      },
    });
  };

  render() {
    const {
      openModal,
      tempData,
      tempData: {
        documentList,
        isSentEmail,
        isMarkAsDone,
        generateLink,
        fullName,
        valueToFinalOffer,
        checkValidation,
      },
      data: { privateEmail, documentChecklistSetting },
    } = this.state;
    const { loading, processStatus, loading4 } = this.props;
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
                          checkValidation={checkValidation}
                          item={item && item}
                          handleChange={this.handleChange}
                          handleCheckAll={this.handleCheckAll}
                          documentList={documentList}
                          tempData={tempData}
                          onValuesChange={this.onValuesChange}
                          documentChecklistSetting={documentChecklistSetting}
                          processStatus={processStatus}
                          handleValidation={this.handleValidation}
                        />
                      );
                    })}
                  {this._renderBottomBar()}
                </div>
              </Col>
              <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
                <NoteComponent note={note} />
                <SendEmail
                  loading4={loading4}
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
                  processStatus={processStatus}
                  valueToFinalOffer={valueToFinalOffer}
                  changeValueToFinalOffer={this.changeValueToFinalOffer}
                  checkValidation={checkValidation}
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
