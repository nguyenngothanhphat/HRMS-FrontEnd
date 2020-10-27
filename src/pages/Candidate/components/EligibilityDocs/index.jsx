/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Typography, Row, Col } from 'antd';
import { connect } from 'umi';
import CustomModal from '@/components/CustomModal';
import Title from './components/Title';
import CollapseFields from './components/CollapseFields';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import SendEmail from './components/SendEmail';
import ModalContentComponent from './components/ModalContentComponent';
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

@connect(({ candidateProfile: { data, currentStep, tempData } = {}, loading }) => ({
  data,
  currentStep,
  tempData,
  loading: loading.effects['upload/uploadFile'],
}))
class EligibilityDocs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      isSentEmail: false,
    };
  }

  componentDidMount() {
    const {
      data: { documentList },
      dispatch,
    } = this.props;
    const groupA = [];
    const groupB = [];
    const groupC = [];
    const groupD = [];
    documentList.forEach((item) => {
      const { candidateGroup } = item;
      item.isValidated = true;
      switch (candidateGroup) {
        case 'A':
          groupA.push(item);
          break;
        case 'B':
          groupB.push(item);
          break;
        case 'C':
          groupC.push(item);
          break;
        case 'D':
          groupD.push(item);
          break;
        default:
          break;
      }
    });
    const docList = [
      { type: 'A', name: 'Identity Proof', data: [...groupA] },
      { type: 'B', name: 'Address Proof', data: [...groupB] },
      { type: 'C', name: 'Educational', data: [...groupC] },
      { type: 'D', name: 'Technical Certifications', data: [...groupD] },
    ];
    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        documentListToRender: docList,
      },
    });
  }

  handleFile = (res, index, id, docList) => {
    const { dispatch } = this.props;
    const arrToAdjust = JSON.parse(JSON.stringify(docList));
    const typeIndex = arrToAdjust.findIndex((item, index1) => index1 === index);
    if (arrToAdjust[typeIndex].data.length > 0) {
      const nestedIndex = arrToAdjust[typeIndex].data.findIndex((item, id1) => id1 === id);
      const documentId = arrToAdjust[typeIndex].data[nestedIndex]._id;
      const { statusCode, data } = res;
      const Obj = arrToAdjust[typeIndex].data[nestedIndex];
      const attachment1 = data.find((x) => x);
      if (statusCode === 200) {
        dispatch({
          type: 'candidateProfile/addAttachmentCandidate',
          payload: {
            attachment: attachment1.id,
            document: documentId,
          },
        }).then(({ data: { attachment } }) => {
          if (attachment) {
            arrToAdjust[typeIndex].data.splice(nestedIndex, 1, {
              ...Obj,
              attachment,
            });
            dispatch({
              type: 'candidateProfile/saveOrigin',
              payload: {
                documentListToRender: arrToAdjust,
              },
            });
          }
        });
      }
    }
  };

  handleCanCelIcon = (index, id, docList) => {
    const { dispatch } = this.props;
    const arrToAdjust = JSON.parse(JSON.stringify(docList));
    const typeIndex = arrToAdjust.findIndex((item, index1) => index1 === index);
    const { isValidated } = docList;
    if (arrToAdjust[typeIndex].data.length > 0) {
      const nestedIndex = arrToAdjust[typeIndex].data.findIndex((item, id1) => id1 === id);
      const attach = null;
      const Obj = arrToAdjust[typeIndex].data[nestedIndex];
      arrToAdjust[typeIndex].data.splice(nestedIndex, 1, {
        ...Obj,
        attachment: attach,
        isValidated: !isValidated,
      });
      dispatch({
        type: 'candidateProfile/saveOrigin',
        payload: {
          documentListToRender: arrToAdjust,
        },
      });
    }
  };

  handleSendEmail = () => {
    const {
      data: { dateOfJoining, noticePeriod, fullName, workDuration, employerId, generatedBy },
      dispatch,
    } = this.props;
    const { user } = generatedBy;
    const { email } = user;
    dispatch({
      type: 'candidateProfile/sendEmailByCandidate',
      payload: {
        dateOfJoining,
        options: 1,
        fullName,
        noticePeriod,
        hrEmail: email,
        workHistories: [
          {
            id: employerId,
            workDuration,
          },
        ],
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({
          openModal: true,
          isSentEmail: true,
        });
      }
    });
  };

  handleSubmitAgain = () => {
    this.setState({
      isSentEmail: false,
    });
  };

  onValuesChange = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        workDuration: Math.ceil(val.workDuration),
      },
    });
  };

  onValuesChangeEmail = (val) => {
    const {
      data: { generatedBy },
      dispatch,
    } = this.props;
    const { user } = generatedBy;
    dispatch({
      type: 'candidateProfile/saveOrigin',
      payload: {
        generatedBy: {
          ...generatedBy,
          user: { ...user, email: val.email },
        },
      },
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  checkLength = (url) => {
    if (url.length > 20) {
      const ext = url.split('.').pop();
      let fileName = url.split('.')[0];
      if (fileName.length > 15) {
        fileName = `${fileName.substring(0, 10)}...`;
        url = `${fileName}${ext}`;
      }
    }
    return url;
  };

  render() {
    const {
      loading,
      data: { attachments, documentListToRender, validateFileSize, generatedBy, employerName },
    } = this.props;
    const { openModal, isSentEmail } = this.state;
    const { user } = generatedBy;
    const { email } = user;
    return (
      <div className={styles.EligibilityDocs}>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              <Title />
              {documentListToRender.length > 0 &&
                documentListToRender.map((item, index) => {
                  return (
                    <CollapseFields
                      onValuesChange={this.onValuesChange}
                      item={item && item}
                      index={index}
                      docList={documentListToRender}
                      handleCanCelIcon={this.handleCanCelIcon}
                      handleFile={this.handleFile}
                      loading={loading}
                      attachments={attachments}
                      validateFileSize={validateFileSize}
                      employerName={employerName}
                      checkLength={this.checkLength}
                    />
                  );
                })}
            </div>
          </Col>
          <Col span={8} sm={24} md={24} lg={24} xl={8} className={styles.rightWrapper}>
            <NoteComponent note={Note} />
            {documentListToRender.length > 0 &&
            documentListToRender[0].data[0].attachment &&
            documentListToRender[0].data[1].attachment &&
            documentListToRender[2].data[0].attachment &&
            documentListToRender[2].data[1].attachment &&
            documentListToRender[2].data[2].attachment ? (
              <SendEmail
                handleSendEmail={this.handleSendEmail}
                email={email}
                onValuesChangeEmail={this.onValuesChangeEmail}
                isSentEmail={isSentEmail}
                handleSubmitAgain={this.handleSubmitAgain}
              />
            ) : (
              <StepsComponent />
            )}
          </Col>
        </Row>
        <CustomModal
          open={openModal}
          closeModal={this.closeModal}
          content={<ModalContentComponent closeModal={this.closeModal} />}
        />
      </div>
    );
  }
}

export default EligibilityDocs;
