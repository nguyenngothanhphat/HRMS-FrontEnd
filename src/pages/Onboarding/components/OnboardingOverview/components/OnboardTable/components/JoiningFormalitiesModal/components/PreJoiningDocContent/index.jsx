import { Checkbox, Col, Divider, Row } from 'antd';
import React, { useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import { connect } from 'umi';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
import { DOCUMENTS_CHECKLIST_TYPE } from '@/utils/newCandidateForm';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';
import Resubmit from '@/assets/resubmit.svg';
import DoneIcon from '@/assets/candidatePortal/doneSign.svg';

const PreJoiningDocContent = (props) => {
  const {
    dispatch,
    tempData: { documentChecklist = [] },
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
    // for type A, B, C, D
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
      // dispatch({
      //   type: 'newCandidateForm/updateByHR',
      //   payload: {
      //     candidate,
      //     documentChecklist,
      //   },
      // });
      const check = validateFiles();
      setValidated(check);
    }
  }, [JSON.stringify(documentChecklist)]);

  const onSaveRedux = (result) => {
    dispatch({
      type: 'newCandidateForm/saveOrigin',
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
    return type?.map((e) => (
      <Row className={styles.content} gutter={[16, 16]}>
        <Col span={17}>
          <Checkbox value={null} />
          <span className={styles.comment__text}>{e.alias}</span>
        </Col>
        {e.status ? (
          <Col span={7} className={styles.received}>
            <span>{e.status}</span> <img alt="received" src={DoneIcon} />
          </Col>
        ) : (
          e.resubmitComment && (
            <Col
              span={7}
              className={styles.waiting}
              onClick={() => assignPayloadToData({ status: DOCUMENT_TYPES.RECEIVED })}
            >
              <span>Waiting</span> <img alt="resubmit" src={Resubmit} />
            </Col>
          )
        )}
        {e.resubmitComment && (
          <Col className={styles.checklistComment} span={24}>
            {e.resubmitComment}
          </Col>
        )}
      </Row>
    ));
  };

  return (
    <div className={classNames(styles.pageBottom, styles.pageBottom__fixed)}>
      {documentChecklist.map((docType) => (
        <>
          <div className={styles.doctype}>{docType.type}</div>
          <Divider />
          {renderContent(docType.documents)}
        </>
      ))}

      {/* <Col span={17}>
          <Checkbox value={null} />
          <span className={styles.comment__text}>High school certificate</span>
        </Col>
        {props.status ? (
          <Col span={7} className={styles.waiting}>
            <span>Waiting</span> <img alt="resubmit" src={Resubmit} />
          </Col>
        ) : (
          <Col span={7} className={styles.received}>
            <span>Received</span> <img alt="received" src={DoneIcon} />
          </Col>
        )}
        {props.comment && (
          <div className={styles.checklistComment}>
            Will update later, because integer integer asced commodo est massa. Sit inecsed eget
            aenean turpis commodo ultrice viverra.
          </div>
        )} */}
    </div>
  );
};

export default connect(({ newCandidateForm: { tempData = {} } }) => ({
  tempData,
}))(PreJoiningDocContent);
