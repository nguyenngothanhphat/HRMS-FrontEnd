/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Typography, Row, Col } from 'antd';
import { connect } from 'umi';
import { _ } from 'lodash';
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

@connect(({ candidateProfile: { data, currentStep, tempData } = {}, loading }) => ({
  data,
  currentStep,
  tempData,
  loading: loading.effects['upload/uploadFile'],
}))
class EligibilityDocs extends PureComponent {
  handleFile = (res, index, id, docList) => {
    const { dispatch } = this.props;
    const arrToAdjust = JSON.parse(JSON.stringify(docList));
    const typeIndex = arrToAdjust.findIndex((item, index1) => index1 === index);
    if (arrToAdjust[typeIndex].data.length > 0) {
      const nestedIndex = arrToAdjust[typeIndex].data.findIndex((item, id1) => id1 === id);
      const documentId = arrToAdjust[typeIndex].data[nestedIndex]._id;
      const { statusCode, data } = res;
      const attachment1 = data.find((x) => x);
      const { key } = arrToAdjust[typeIndex].data[nestedIndex];
      // docList.splice(nestedIndex, 1,);
      console.log(key);
      if (statusCode === 200) {
        dispatch({
          type: 'candidateProfile/addAttachmentCandidate',
          payload: {
            attachment: attachment1.id,
            document: documentId,
          },
        }).then(({ data: { attachment } }) => {
          if (attachment) {
            console.log('aa', attachment);
            dispatch({
              type: 'candidateProfile/saveDocumentList',
              payload: {},
            });
          }
        });
      }
    }
  };

  render() {
    const {
      loading,
      data: { documentList, attachments },
    } = this.props;
    const groupA = [];
    const groupB = [];
    const groupC = [];
    const groupD = [];
    documentList.forEach((item) => {
      const { candidateGroup } = item;
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
    console.log('docList', docList);

    return (
      <div className={styles.EligibilityDocs}>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              <Title />
              {docList.length > 0 &&
                docList.map((item, index) => {
                  return (
                    <CollapseFields
                      item={item && item}
                      index={index}
                      docList={docList}
                      // handleChange={this.handleChange}
                      // handleCheckAll={this.handleCheckAll}
                      // testEligibility={testEligibility}
                      // eligibilityDocs={eligibilityDocs}
                      handleFile={this.handleFile}
                      loading={loading}
                      attachments={attachments}
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
