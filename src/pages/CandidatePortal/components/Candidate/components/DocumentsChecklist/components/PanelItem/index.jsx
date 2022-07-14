import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import DoneIcon from '@/assets/candidatePortal/doneSign.svg';
import ResubmitIcon from '@/assets/candidatePortal/ic_resubmit.svg';
import styles from './index.less';
import { DOCUMENT_KEYS, DOCUMENT_TYPES } from '@/utils/candidatePortal';

const PanelItem = ({ document, actionText, onClickFile, onClickAction }) => {
  const { alias = '', type } = document;
  const attachment = document?.document?.attachment;
  const status = document?.status;

  const renderUpload = (text = actionText) => {
    return (
      <Col onClick={onClickAction} span={6} className={styles.txtUpload}>
        {text}
      </Col>
    );
  };

  const renderVerified = (statusTxt = 'Verify') => {
    return (
      <Col span={6}>
        <div className={styles.verified}>
          <span>{statusTxt}</span>
          <Tooltip title="Accepted by HR" placement="right">
            <img src={DoneIcon} alt="" />
          </Tooltip>
        </div>
      </Col>
    );
  };

  const renderResubmit = () => {
    return (
      <Col onClick={onClickAction} span={6}>
        <div className={styles.resubmit}>
          <span> Resubmit </span>
          <img src={ResubmitIcon} alt="" />
        </div>
      </Col>
    );
  };

  const renderByStatus = () => {
    if (type === DOCUMENT_KEYS.HARD_COPY) return null;
    switch (status) {
      case DOCUMENT_TYPES.VERIFIED:
        return renderVerified();
      case DOCUMENT_TYPES.RESUBMIT_PENDING:
        return renderResubmit();
      case DOCUMENT_TYPES.VERIFYING:
        return renderUpload('Modify');
      default:
        return renderUpload();
    }
  };

  return (
    <Row gutter={[24, 24]} className={styles.PanelItem}>
      <Col span={12} style={{ paddingLeft: 8 }}>
        {alias}
      </Col>
      {attachment ? (
        <Tooltip title={attachment?.name}>
          <Col span={6} className={styles.txtFileName}>
            <span onClick={onClickFile}>{attachment?.name}</span>
          </Col>
        </Tooltip>
      ) : (
        <Col span={6} />
      )}
      {renderByStatus()}
    </Row>
  );
};

export default PanelItem;
