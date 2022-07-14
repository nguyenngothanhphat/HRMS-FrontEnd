import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'umi';
import DoneIcon from '@/assets/candidatePortal/doneSign.svg';
import ResubmitIcon from '@/assets/candidatePortal/resubmitIcon.svg';
import WarningIcon from '@/assets/candidatePortal/warningIcon.svg';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
// import UploadComponent from '../UploadComponent';
import styles from './index.less';

const {
  //   UPLOAD_PENDING,
  VERIFYING,
  VERIFIED,
  RESUBMIT_PENDING,
  NOT_AVAILABLE_ACCEPTED,
  NOT_AVAILABLE_REJECTED,
  NOT_AVAILABLE_PENDING_HR,
} = DOCUMENT_TYPES;

const File = (props) => {
  const {
    item = {},
    type = '',
    onVerifyDocument = () => {},
    onViewCommentClick = () => {},
    blockIndex = 0, // for type E
  } = props;

  const renderFile = () => {
    return (
      <div className={styles.file} onClick={() => onVerifyDocument(type, item, blockIndex)}>
        <img src={WarningIcon} alt="" />
        <span className={styles.fileName}>
          {item.document?.attachment?.name || 'File not found'}
        </span>
      </div>
    );
  };

  const renderNeedVerification = () => {
    return (
      <div className={styles.needVerification}>
        <span>Needs verification</span>
        <img src="data:," alt="" />
      </div>
    );
  };

  const renderVerified = () => {
    return (
      <div className={styles.verified}>
        <span>Verified</span>
        <Tooltip title="Accepted by HR" placement="right">
          <img src={DoneIcon} alt="" />
        </Tooltip>
      </div>
    );
  };
  const renderResubmit = () => {
    return (
      <div className={styles.resubmit}>
        <span>Resubmit</span>
        <Tooltip title={item.resubmitComment} placement="right">
          <img src={ResubmitIcon} alt="" />
        </Tooltip>
      </div>
    );
  };

  const renderComment = () => {
    return (
      <div className={styles.comments}>
        <span onClick={() => onViewCommentClick(type, item)}>View Comments</span>
      </div>
    );
  };

  const renderNotAvailableActions = () => {
    return (
      <div
        className={styles.notAvailable}
        style={{
          cursor: 'default',
        }}
      >
        <span>Not Available</span>
        {item.status === NOT_AVAILABLE_ACCEPTED ? (
          <Tooltip title="Accepted by HR" placement="right">
            <img src={DoneIcon} alt="" />
          </Tooltip>
        ) : (
          <img src="data:," alt="" />
        )}
      </div>
    );
  };

  const renderNotAvailable = () => {
    return (
      <div className={styles.notAvailable}>
        <span>Not Available</span>
      </div>
    );
  };

  const renderFileStatus = () => {
    switch (item.status) {
      case VERIFYING:
        return (
          <Row>
            <Col span={12}>{renderFile()}</Col>
            <Col span={12}>{renderNeedVerification()}</Col>
          </Row>
        );

      case VERIFIED:
        return (
          <Row justify="end">
            <Col span={12}>{renderFile()}</Col>
            <Col span={12}>{renderVerified()}</Col>
          </Row>
        );

      case RESUBMIT_PENDING:
        return (
          <Row justify="end">
            <Col span={12}>{renderFile()}</Col>
            <Col span={12}>{renderResubmit()}</Col>
          </Row>
        );

      case NOT_AVAILABLE_PENDING_HR:
      case NOT_AVAILABLE_ACCEPTED:
        return (
          <Row justify="end" align="middle">
            <Col span={12}>{renderComment()}</Col>
            <Col span={12}>{renderNotAvailableActions()}</Col>
          </Row>
        );

      case NOT_AVAILABLE_REJECTED:
        return (
          <Row justify="end" align="middle">
            <Col span={12}>{renderComment()}</Col>
            <Col span={12}>{renderResubmit()}</Col>
          </Row>
        );

      default:
        return (
          <Row justify="end">
            <Col span={12}>{renderNotAvailable()}</Col>
            <Col span={12}>
              <div className={styles.upload}>
                {/* <UploadComponent getResponse={getResponse} item={item} /> */}
                <img src="data:," alt="" />
              </div>
            </Col>
          </Row>
        );
    }
  };

  return (
    <Row className={styles.File} justify="space-between">
      <Col span={12}>
        <span>
          {item.alias}
          {item.required && <span className={styles.starSymbol}>*</span>}
        </span>
      </Col>
      <Col span={12}>{renderFileStatus()}</Col>
    </Row>
  );
};

export default connect(({ candidatePortal }) => ({ candidatePortal }))(File);
