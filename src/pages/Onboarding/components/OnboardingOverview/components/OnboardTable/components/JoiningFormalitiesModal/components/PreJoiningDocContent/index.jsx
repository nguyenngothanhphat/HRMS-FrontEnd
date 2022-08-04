import { Checkbox, Col, Divider, Row } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect } from 'umi';
import CheckIcon from '@/assets/onboarding/checkIcon.svg';
import Resubmit from '@/assets/resubmit.svg';
import { DOCUMENT_TYPES } from '@/constants/candidatePortal';
import { DOCUMENTS_CHECKLIST_TYPE } from '@/constants/newCandidateForm';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

const PreJoiningDocContent = (props) => {
  const {
    dispatch,
    tempData: { documentChecklist = [] } = {},
    candidateId = '',
    setCallback = () => {},
    preJoinCheckList = [],
    setPreJoinCheckList = () => {},
  } = props;
  const [selectingFile, setSelectingFile] = useState(null);
  const [validated, setValidated] = useState(false);

  const documentTypeS = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.SCAN_UPLOAD,
  )?.documents;
  const documentTypeE = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.ELECTRONICALLY,
  )?.documents;
  const documentTypeH = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.HARD_COPY,
  )?.documents;

  const validateFiles = () => {
    const checkDocumentUploaded = (arr = []) => {
      if (arr.length === 0) return true;
      return arr
        .filter((x) => x.required || x.value)
        .every(
          (x) =>
            x.status === DOCUMENT_TYPES.VERIFIED ||
            x.status === DOCUMENT_TYPES.NOT_AVAILABLE_ACCEPTED,
        );
    };

    const checkHardCopy = (arr = []) => {
      if (arr.length === 0) return true;
      return arr
        .filter((x) => x.required || x.value)
        .every((x) => x.status === DOCUMENT_TYPES.RECEIVED || x.resubmitComment?.length > 0);
    };

    return (
      checkDocumentUploaded(documentTypeS) &&
      checkDocumentUploaded(documentTypeE) &&
      checkHardCopy(documentTypeH)
    );
  };

  useLayoutEffect(() => {
    if (documentTypeS?.length > 0 || documentTypeE?.length > 0 || documentTypeH?.length > 0) {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate: candidateId,
          ...documentChecklist,
        },
      });
      const check = validateFiles();
      setValidated(check);
    }
  }, [JSON.stringify(documentChecklist)]);

  const onSaveRedux = (result) => {
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        documentChecklist: result,
      },
    });
  };

  const assignPayloadToData = (payload) => {
    let items = documentChecklist;

    const func = (arr) => {
      return arr.map((x) => {
        if (x.key === selectingFile?.item?.key) {
          return {
            ...x,
            ...payload,
          };
        }
        return x;
      });
    };
    items = items.map((x) => {
      if (x.type === selectingFile?.type) {
        return {
          ...x,
          documents: func(x.documents),
        };
      }
      return x;
    });

    onSaveRedux(items);
  };

  const renderContent = (type) => {
    return type?.map((e) => {
      const { _id = '', alias = '', status = '', resubmitComment = '' } = e;
      return (
        <Row className={styles.content} gutter={[16, 16]}>
          <Col span={17}>
            <Checkbox value={_id} />
            <span className={styles.comment__text}>{alias}</span>
          </Col>
          <Col
            span={7}
            className={styles.waiting}
            onClick={() => assignPayloadToData({ status: DOCUMENT_TYPES.RECEIVED })}
          >
            <span>{status || 'Waiting'}</span> <img alt="resubmit" src={Resubmit} />
          </Col>
          {resubmitComment && (
            <Col className={styles.checklistComment} span={24}>
              {resubmitComment}
            </Col>
          )}
        </Row>
      );
    });
  };

  const allValues = documentChecklist.reduce(
    (c, i) =>
      c +
      i.documents.filter(
        (e) => e.status !== DOCUMENT_TYPES.VERIFIED && e.status !== DOCUMENT_TYPES.RECEIVED,
      ).length,
    0,
  );
  const waiting = documentChecklist.some((i) =>
    i.documents.some(
      (e) => e.status !== DOCUMENT_TYPES.VERIFIED && e.status !== DOCUMENT_TYPES.RECEIVED,
    ),
  );

  useEffect(() => {
    setCallback(allValues);
  }, [allValues]);

  return waiting ? (
    <div className={classNames(styles.pageBottom, styles.pageBottom__fixed)}>
      <Checkbox.Group value={preJoinCheckList} onChange={setPreJoinCheckList}>
        {documentChecklist.map(
          (docType) =>
            docType.documents.some(
              (e) => e.status !== DOCUMENT_TYPES.VERIFIED && e.status !== DOCUMENT_TYPES.RECEIVED,
            ) && (
              <>
                <div className={styles.doctype}>{docType.type}</div>
                <Divider />
                {renderContent(docType.documents)}
              </>
            ),
        )}
      </Checkbox.Group>
    </div>
  ) : (
    <>
      <div className={styles.pageNotice}>
        <img className={styles.check} alt="check icon" src={CheckIcon} height="20px" />
        <div className={styles.pageNotice__text}>
          All the required documents have been received and verified
        </div>
      </div>
    </>
  );
};

export default connect(({ newCandidateForm: { tempData = {} } }) => ({
  tempData,
}))(PreJoiningDocContent);
