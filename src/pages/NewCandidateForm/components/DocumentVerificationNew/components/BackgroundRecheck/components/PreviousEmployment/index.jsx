/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Collapse, Checkbox, Space, Col, Row, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import WarningIcon from '@/assets/warning-filled.svg';
import ResubmitIcon from '@/assets/resubmit.svg';
import VerifiedIcon from '@/assets/verified.svg';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import InputField from '../InputField';
import styles from './index.less';
import VerifyDocumentModal from '../VerifyDocumentModal';

@connect(({ newCandidateForm: { candidate = '', data, tempData } = {} }) => ({
  data,
  tempData,
  candidate,
}))
class PreviousEmployment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      openModal: false,
      url: '',
      displayName: '',
      documentId: '',
      candidateDocStatus: '',
    };
  }

  openDocument = (document = {}, key = '') => {
    const { displayName, attachment, _id: documentId, candidateDocumentStatus } = document;
    const { url } = attachment;
    if (!attachment) {
      return;
    }

    if (key === 'verify') {
      this.setState({
        openModal: true,
        url,
        displayName,
        documentId,
        candidateDocStatus: candidateDocumentStatus,
      });
    } else {
      this.setState({
        visible: true,
        url,
        displayName,
      });
    }
  };

  handleCancel = (key = 0) => {
    if (key === 1) {
      this.setState({
        openModal: false,
        url: '',
        displayName: '',
      });
    } else {
      this.setState({
        visible: false,
        url: '',
        displayName: '',
      });
    }
  };

  renderStatusVerify = (fileName, candidateDocumentStatus) => {
    const formatStatus = (status) => {
      if (status === 'RE-SUBMIT') {
        return (
          <div className={styles.resubmit}>
            <div>Resubmit</div>
            <img src={ResubmitIcon} alt="re-submit" />
          </div>
        );
      }
      if (status === 'VERIFIED') {
        return (
          <div className={styles.verified}>
            <div>Verified</div>
            <img src={VerifiedIcon} alt="verified" />
          </div>
        );
      }

      return (
        <div className={styles.pending}>
          <div>Pending Verification</div>
        </div>
      );
    };
    return <>{fileName && <>{formatStatus(candidateDocumentStatus)}</>}</>;
  };

  renderEmployer = (item, docListE, indexGroupDoc) => {
    const {
      data: { workHistory = [] },
      processStatus = '',
    } = this.props;

    const currentCompany = workHistory.filter((value) => value.toPresent) || [];

    let itemDataFilter = [];
    if (item.toPresent) {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'paysTubs' || doc.key === 'form16' || doc.isCandidateUpload,
      );
    } else {
      itemDataFilter = item.data.filter(
        (doc) => doc.key === 'relievingLetter' || doc.isCandidateUpload,
      );
    }

    return (
      <>
        <Row gutter={[16, 0]} className={styles.previousEmployment__row}>
          <Col span={24}>
            <InputField
              item={item}
              index={indexGroupDoc}
              hasCurrentCompany={currentCompany.length > 0}
            />
          </Col>
        </Row>

        {itemDataFilter.map((document, index) => {
          const { attachment = { name: '' }, candidateDocumentStatus } = document;
          const { name: fileName = '' } = attachment;
          return (
            <Row gutter={[16, 0]} className={styles.previousEmployment__row} key={index}>
              <Col span={12} className={styles.previousEmployment__row__name}>
                <Typography.Text>{document.displayName}</Typography.Text>
              </Col>
              <Col
                span={candidateDocumentStatus === 'PENDING' ? 6 : 8}
                className={styles.previousEmployment__row__file}
              >
                <div
                  onClick={() => {
                    if (!fileName) {
                      return;
                    }
                    const status = processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION;
                    if (status) {
                      this.openDocument(document, 'view');
                    } else {
                      this.openDocument(document, 'verify');
                    }
                  }}
                  className={styles.file__content__fileName}
                >
                  <img src={WarningIcon} alt="warning" />
                  <div className={styles.file__content__fileName__text}>{fileName}</div>
                </div>
              </Col>
              <Col
                span={candidateDocumentStatus === 'PENDING' ? 6 : 4}
                className={styles.previousEmployment__row__statusVerify}
              >
                {this.renderStatusVerify(fileName, candidateDocumentStatus)}
              </Col>
            </Row>
          );
        })}
        {indexGroupDoc + 1 < docListE.length && <hr />}
      </>
    );
  };

  render() {
    const { docList = [] } = this.props;
    const { visible, url, displayName, openModal, documentId, candidateDocStatus } = this.state;
    const docListE = docList.filter((d) => d.type === 'E');
    const firstIndex = docList.findIndex((d) => d.type === 'E');
    return (
      <div className={styles.PreviousEmployment}>
        {docListE.length > 0 ? (
          <Collapse
            accordion
            expandIconPosition="right"
            expandIcon={(props) => {
              return props.isActive ? <MinusOutlined /> : <PlusOutlined />;
            }}
          >
            <Collapse.Panel
              header={
                <Checkbox
                  className={styles.checkbox}
                  onClick={(e) => e.stopPropagation()}
                  checked="true"
                >
                  Type {docListE[0].type}: {docListE[0].name}
                </Checkbox>
              }
            >
              <Space direction="vertical" className={styles.space}>
                {docList.map((doc, i) => {
                  if (doc.type === 'E') {
                    return this.renderEmployer(doc, docListE, i - firstIndex);
                  }
                  return '';
                })}
              </Space>
            </Collapse.Panel>
          </Collapse>
        ) : null}

        <ViewDocumentModal
          visible={visible}
          fileName={displayName}
          url={url}
          onClose={this.handleCancel}
        />
        <VerifyDocumentModal
          visible={openModal}
          docProps={{
            candidateDocStatus,
            documentId,
            url,
            displayName,
          }}
          onClose={() => this.handleCancel(1)}
        />
      </div>
    );
  }
}

export default PreviousEmployment;
