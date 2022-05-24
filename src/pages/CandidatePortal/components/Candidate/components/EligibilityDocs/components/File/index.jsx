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
  VERIFYING,
  VERIFIED,
  RESUBMIT_PENDING,
  NOT_AVAILABLE_PENDING_HR,
  NOT_AVAILABLE_ACCEPTED,
  NOT_AVAILABLE_REJECTED,
} = DOCUMENT_TYPES;

const File = (props) => {
  const {
    dispatch,
    item = {},
    type = '',
    candidatePortal: { data = {}, data: { currentStep } = {} } = {},
    onNotAvailableClick = () => {},
    onViewCommentClick = () => {},
    onViewDocumentClick = () => {},
    blockIndex = 0, // for type E
  } = props;

  const onSaveRedux = (result) => {
    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        [mapType[type]]: result,
      },
    });
  };

  const getResponse = async (key, res) => {
    const [attachment] = res.data;
    const documentRes = await dispatch({
      type: 'candidatePortal/upsertCandidateDocumentEffect',
      payload: {
        attachment: attachment.id,
        document: item.document?._id,
      },
    });

    if (documentRes.statusCode === 200) {
      const { data: fetchedDocument = {} } = documentRes;
      const onAddFetchedDocToRedux = (arr) => {
        return arr.map((x) => {
          if (x.key === key) {
            return {
              ...x,
              document: { ...fetchedDocument, attachment },
              status: VERIFYING,
            };
          }
          return x;
        });
      };

      if (fetchedDocument) {
        let items = [...data[mapType[type]]];

        if (type !== 'E') {
          items = onAddFetchedDocToRedux(items);
        } else {
          items = items.map((x) => {
            return {
              ...x,
              data: onAddFetchedDocToRedux(x.data),
            };
          });
        }
        onSaveRedux(items);
      }
    }
  };

  const renderFile = () => {
    return (
      <div className={styles.file} onClick={() => onViewDocumentClick(item)}>
        <img src={WarningIcon} alt="" />
        <span className={styles.fileName}>
          {item.document?.attachment?.name || 'File not found'}
        </span>
      </div>
    );
  };
  const renderPendingVerification = () => {
    return (
      <div className={styles.pending}>
        <span>Pending Verification</span>
        <Tooltip title="The document is pending for verification by the HR" placement="right">
          <img src={WarningGrayIcon} alt="" />
        </Tooltip>
      </div>
    );
  };

  const renderUpload = () => {
    return (
      <div className={styles.upload}>
        <span>
          <UploadComponent getResponse={getResponse} item={item} />
        </span>
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

  const renderComment = () => {
    return (
      <div className={styles.comments}>
        <span onClick={() => onViewCommentClick(item)}>View Comments</span>
      </div>
    );
  };

  const renderResubmit = () => {
    return (
      <div className={styles.resubmit}>
        <span>
          <UploadComponent getResponse={getResponse} item={item} content="Resubmit" />
        </span>
        <img src="data:," alt="" />
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
        <span onClick={() => onNotAvailableClick(type, item, blockIndex)}>Not Available</span>
      </div>
    );
  };

  const renderFileStatus = () => {
    switch (item.status) {
      case VERIFYING:
        if (currentStep > 1) {
          return (
            <Row justify="end">
              <Col span={24}>{renderPendingVerification()}</Col>
            </Row>
          );
        }
        return (
          <Row justify="end">
            <Col span={12}>{renderFile()}</Col>
            <Col span={12}>{renderUpload()}</Col>
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
          <Row>
            <Col span={12}>{renderComment()}</Col>
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
            <Col span={12}>{renderUpload()}</Col>
          </Row>
        );

      default:
        return (
          <Row justify="end">
            <Col span={12}>{renderNotAvailable()}</Col>
            <Col span={12}>{renderUpload()}</Col>
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
