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
  NOT_AVAILABLE_PENDING_HR,
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

  const renderFileStatus = () => {
    switch (item.status) {
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
              <div className={styles.file} onClick={() => onViewDocumentClick(item)}>
                <img src={WarningIcon} alt="" />
                <span className={styles.fileName}>
                  {item.document?.attachment?.name || 'File not found'}
                </span>
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
              <div className={styles.file} onClick={() => onViewDocumentClick(item)}>
                <img src={WarningIcon} alt="" />
                <span className={styles.fileName}>
                  {item.document?.attachment?.name || 'File not found'}
                </span>
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
                <span onClick={() => onViewCommentClick(item)}>View Comments</span>
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
              <div className={styles.file} onClick={() => onViewDocumentClick(item)}>
                <img src={WarningIcon} alt="" />
                <span className={styles.fileName}>
                  {item.document?.attachment?.name || 'File not found'}
                </span>
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

      case NOT_AVAILABLE_PENDING_HR:
        return (
          <Row justify="end" align="middle">
            <Col span={12}>
              <div className={styles.comments}>
                <span onClick={() => onViewCommentClick(item)}>View Comments</span>
              </div>
            </Col>
            <Col span={12}>
              <div
                className={styles.notAvailable}
                style={{
                  cursor: 'default',
                }}
              >
                <span>Not Available</span>
                <img src="data:," alt="" />
              </div>
            </Col>
          </Row>
        );

      default:
        return (
          <Row justify="end">
            <Col span={12}>
              <div className={styles.notAvailable}>
                <span onClick={() => onNotAvailableClick(type, item, blockIndex)}>
                  Not Available
                </span>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.upload}>
                <UploadComponent getResponse={getResponse} item={item} />
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
          {item.required && '*'}
        </span>
      </Col>
      <Col span={12}>{renderFileStatus()}</Col>
    </Row>
  );
};

export default connect(({ candidatePortal }) => ({ candidatePortal }))(File);
