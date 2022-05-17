import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'umi';
import DoneIcon from '@/assets/candidatePortal/doneSign.svg';
import WarningGrayIcon from '@/assets/candidatePortal/warningGrayIcon.png';
import WarningIcon from '@/assets/candidatePortal/warningIcon.svg';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
import { mapType } from '@/utils/newCandidateForm';
import UploadComponent from '../UploadComponent';
import styles from './index.less';

const {
  //   UPLOAD_PENDING,
  VERIFYING,
  VERIFIED,
  RE_SUBMITTED_PENDING,
  RE_SUBMITTED,
  NOT_AVAILABLE,
} = DOCUMENT_TYPES;

const File = (props) => {
  const {
    dispatch,
    item = {},
    type = '',
    index = 0,
    candidatePortal: { data = {}, data: { currentStep } = {} } = {},
  } = props;

  const onSaveRedux = (result) => {
    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        [mapType[type]]: result,
      },
    });
  };

  const getResponse = (key, res) => {
    const [attachment] = res.data;
    // dispatch({
    //     type: 'candidatePortal/addAttachmentCandidate',
    //     payload: {
    //       attachment: attachment1.id,
    //       document: documentId,
    //       tenantId: getCurrentTenant(),
    //     },
    //   })

    if (attachment) {
      let items = [...data[mapType[type]]];
      items = items.map((x) => {
        if (x.key === key) {
          return {
            ...x,
            attachment,
            candidateDocumentStatus: VERIFYING,
          };
        }
        return x;
      });
      onSaveRedux(items);
    }
  };

  const renderFileStatus = () => {
    switch (item.candidateDocumentStatus) {
      case VERIFYING:
        if (currentStep > 2) {
          return (
            <Row justify="end">
              <Col span={24}>
                <div className={styles.pending}>
                  <span>Pending Verification</span>
                  <Tooltip
                    title="The document is pending for verification by the HR"
                    placement="right"
                  >
                    <img src={WarningGrayIcon} alt="" />
                  </Tooltip>
                </div>
              </Col>
            </Row>
          );
        }
        return (
          <Row justify="end">
            <Col span={12}>
              <div className={styles.file}>
                <img src={WarningIcon} alt="undo" />
                <span className={styles.fileName}>{item.attachment?.name || 'File not found'}</span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.upload}>
                <span>
                  <UploadComponent getResponse={getResponse} item={item} />
                </span>
                <img src="data:," alt="" />
              </div>
            </Col>
          </Row>
        );

      case VERIFIED:
        return (
          <Row justify="end">
            <Col span={12}>
              <div className={styles.file}>
                <img src={WarningIcon} alt="undo" />
                <span>sample_file.pdf</span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.verified}>
                <span>Verified</span>
                <Tooltip title="Accepted by HR" placement="right">
                  <img src={DoneIcon} alt="" />
                </Tooltip>
              </div>
            </Col>
          </Row>
        );

      case RE_SUBMITTED_PENDING:
        return (
          <Row>
            <Col span={12}>
              <div className={styles.comments}>
                <span>View Comments</span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.resubmit}>
                <span>
                  <UploadComponent getResponse={getResponse} item={item} content="Resubmit" />
                </span>
                <img src="data:," alt="" />
              </div>
            </Col>
          </Row>
        );

      case RE_SUBMITTED:
        return (
          <Row>
            <Col span={12}>
              <div className={styles.file}>
                <img src={WarningIcon} alt="undo" />
                <span>sample_file.pdf</span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.resubmit}>
                <span>
                  <UploadComponent getResponse={getResponse} item={item} content="Resubmit" />
                </span>
                <img src="data:," alt="" />
              </div>
            </Col>
          </Row>
        );

      case NOT_AVAILABLE:
        return (
          <Row justify="end" align="middle">
            <Col span={12}>
              <div className={styles.comments}>
                <span>View Comments</span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.notAvailable}>
                <span>Not Available</span>
              </div>
            </Col>
          </Row>
        );

      default:
        return (
          <Row justify="end">
            <Col span={12}>
              <div className={styles.notAvailable}>
                <span>Not Available</span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.upload}>
                <span>
                  <UploadComponent getResponse={getResponse} item={item} />
                </span>
                <img src="data:," alt="" />
              </div>
            </Col>
          </Row>
        );
    }
  };

  return (
    <Row className={styles.File} justify="space-between">
      <Col span={14}>
        <span>
          {item.alias}
          {item.required && '*'}
        </span>
      </Col>
      <Col span={10}>{renderFileStatus()}</Col>
    </Row>
  );
};

export default connect(({ candidatePortal }) => ({ candidatePortal }))(File);
