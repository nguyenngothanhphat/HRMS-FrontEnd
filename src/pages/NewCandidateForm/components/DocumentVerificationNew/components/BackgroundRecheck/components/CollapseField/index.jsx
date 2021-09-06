/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Collapse, Checkbox, Space, Col, Row, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
// import ViewDocumentModal from '@/components/ViewDocumentModal';
import ResubmitIcon from '@/assets/resubmit.svg';
import VerifiedIcon from '@/assets/verified.svg';
import WarningIcon from '@/assets/warning-filled.svg';
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
    };
  }

  openDocument = (displayName, attachment, documentId, key = '') => {
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

  // renderClassnameOfFile = (candidateDocumentStatus) => {
  //   let className = `${styles.file__content} `;
  //   if (candidateDocumentStatus === 'VERIFIED') {
  //     className += `${styles.file__content__file} `;
  //   }
  //   if (candidateDocumentStatus === 'RE-SUBMIT') {
  //     className += `${styles.file__content__resubmit} `;
  //   }
  //   if (candidateDocumentStatus === 'INELIGIBLE') {
  //     className += `${styles.file__content__ineligible} `;
  //   }
  //   return className;
  // };

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
    const { item = {} } = this.props;
    const { visible, url, displayName, openModal, documentId } = this.state;

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
                  const {
                    attachment = {},
                    candidateDocumentStatus = '',
                    _id: docId = '',
                  } = document;
                  const { name: fileName = '' } = attachment;

                  return (
                    <Row gutter={[16, 0]} className={styles.collapseField__row} key={index}>
                      <Col span={12} className={styles.collapseField__row__name}>
                        <Typography.Text>{document.displayName}</Typography.Text>
                      </Col>
                      <Col span={8} className={styles.collapseField__row__file}>
                        <div
                          onClick={() => {
                            if (!fileName) {
                              return;
                            }
                            // this.openViewDocument(document.displayName, attachment);
                            this.openDocument(document.displayName, attachment, docId, 'verify');
                          }}
                          className={styles.file__content__fileName}
                        >
                          <img src={WarningIcon} alt="warning" />
                          <div className={styles.file__content__fileName__text}>{fileName}</div>
                        </div>
                      </Col>
                      <Col span={4} className={styles.collapseField__row__statusVerify}>
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

        {/* <ViewDocumentModal />
          visible={visible}
          fileName={displayName}
          url={url}
          onClose={this.handleCancel}
        /> */}

        <VerifyDocumentModal
          visible={openModal}
          fileName={displayName}
          url={url}
          document={documentId}
          onClose={() => this.handleCancel(1)}
        />
      </div>
    );
  }
}

export default CollapseField;
