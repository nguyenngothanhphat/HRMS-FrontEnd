/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Collapse, Checkbox, Space, Col, Row, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import ResubmitIcon from '@/assets/resubmit.svg';
import VerifiedIcon from '@/assets/verified.svg';
import WarningIcon from '@/assets/warning-filled.svg';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import VerifyDocumentModal from '../VerifyDocumentModal';
import styles from './index.less';

class CollapseField extends Component {
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
      // if processStatus = DOCUMENT_VERIFICATION, show modal verification
      this.setState({
        openModal: true,
        url,
        displayName,
        documentId,
        candidateDocStatus: candidateDocumentStatus,
      });
    } else {
      // if not, just show modal to view the documents
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

  render() {
    const { item = {}, processStatus = '' } = this.props;
    const { visible, url, displayName, openModal, documentId, candidateDocStatus } = this.state;

    return (
      <div className={styles.collapseField}>
        {item.data.length > 0 ? (
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
                  Type {item.type}: {item.name}
                </Checkbox>
              }
            >
              <Space direction="vertical" className={styles.space}>
                {item.data.map((document, index) => {
                  const { attachment = {}, candidateDocumentStatus = '' } = document;
                  const { name: fileName = '' } = attachment;

                  return (
                    <Row gutter={[16, 0]} className={styles.collapseField__row} key={index}>
                      <Col span={12} className={styles.collapseField__row__name}>
                        <Typography.Text>{document.displayName}</Typography.Text>
                      </Col>
                      <Col
                        span={candidateDocumentStatus === 'PENDING' ? 6 : 8}
                        className={styles.collapseField__row__file}
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
                        className={styles.collapseField__row__statusVerify}
                      >
                        {this.renderStatusVerify(fileName, candidateDocumentStatus)}
                      </Col>
                    </Row>
                  );
                })}
              </Space>
            </Collapse.Panel>
          </Collapse>
        ) : null}

        {/* <PopUpViewDocument
          titleModal={displayName}
          visible={visible}
          handleCancel={this.handleCancel}
          url={url}
        /> */}

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

export default CollapseField;
