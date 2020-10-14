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

@connect(({ candidateProfile: { eliDocs, isUploadedSuccessfully } = {} }) => ({
  eliDocs,
  isUploadedSuccessfully,
}))
class EligibilityDocs extends PureComponent {
  handleFile = (resp, index, id) => {
    const { dispatch, eliDocs = [] } = this.props;
    const tempData = JSON.parse(JSON.stringify(eliDocs));
    console.log(resp);
    const { statusCode } = resp;
    if (statusCode === 200) {
      const { data } = tempData[id];
      const { name } = resp.data[0];
      const { url } = resp.data[0];
      data[index].value = true;
      data[index].isUploaded = true;
      data[index].fileName = name;
      data[index].fileUrl = url;
      tempData.splice(id, 1, { ...tempData[id], data });
      dispatch({
        type: 'candidateProfile/save',
        payload: {
          eliDocs: tempData,
        },
      });
    } else {
      const { data } = tempData[id];
      data[index].isUploaded = false;
      tempData.splice(id, 1, { ...tempData[id], data });
      dispatch({
        type: 'candidateProfile/save',
        payload: {
          eliDocs: tempData,
        },
      });
    }
  };

  handleCanCelIcon = (index, id) => {
    console.log('index', index);
    console.log('id', id);
    const { dispatch, eliDocs = [] } = this.props;
    const tempData = JSON.parse(JSON.stringify(eliDocs));
    const { data } = tempData[id];
    data[index].value = false;
    data[index].isUploaded = null;
    tempData.splice(id, 1, { ...tempData[id], data });
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        eliDocs: tempData,
      },
    });
  };

  handleAdd = (e) => {
    console.log('a', e);
  };

  render() {
    const { eliDocs } = this.props;
    return (
      <div className={styles.EligibilityDocs}>
        <Row gutter={[24, 0]} className={styles.EligibilityDocs}>
          <Col span={16} sm={24} md={24} lg={24} xl={16} className={styles.leftWrapper}>
            <div className={styles.eliContainer}>
              <Title />
              {eliDocs.length > 0 &&
                eliDocs.map((item, id) => {
                  return (
                    <CollapseFields
                      item={item && item}
                      id={id}
                      eliDocs={eliDocs}
                      handleFile={this.handleFile}
                      handleCanCelIcon={this.handleCanCelIcon}
                      handleAdd={this.handleAdd}
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
