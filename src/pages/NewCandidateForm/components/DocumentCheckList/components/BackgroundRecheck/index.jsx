import { Button, Col, Row, Space } from 'antd';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect, history } from 'umi';
import CommonModal from '@/components/CommonModal';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
import { DOCUMENTS_CHECKLIST_TYPE } from '@/utils/newCandidateForm';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import { goToTop } from '@/utils/utils';
import { Page } from '../../../../utils';
import MessageBox from '../../../MessageBox';
import NoteComponent from '../../../NewNoteComponent';
import CollapseField from './components/CollapseFields';
import CollapseFieldsTypeH from './components/CollapseFieldsTypeH';
import VerifyDocumentModalContent from './components/VerifyDocumentModalContent';
import ViewCommentModalContent from './components/ViewCommentModalContent';
import NotiIcon from '@/assets/notice-icon.svg';
import styles from './index.less';

const BackgroundRecheck = (props) => {
  const {
    newCandidateForm: {
      tempData: { ticketID = '', candidate, documentChecklist = [] },
      currentStep = '',
    } = {},
    // loadingUpdateByHR = false,
    dispatch,
  } = props;

  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [viewCommentModalVisible, setViewCommentModalVisible] = useState(false);
  const [selectingFile, setSelectingFile] = useState(null);
  const [action, setAction] = useState('');
  const [comment, setComment] = useState('');
  const [modalChangeStatus, setModalChangeStatus] = useState(false);

  const documentTypeS = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.SCAN_UPLOAD,
  ).documents;
  const documentTypeE = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.ELECTRONICALLY,
  ).documents;
  const documentTypeH = documentChecklist.find(
    (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.HARD_COPY,
  ).documents;

  const [validated, setValidated] = useState(false);

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

  useEffect(() => {
    goToTop();
  }, []);

  useLayoutEffect(() => {
    if (documentTypeS.length > 0 || documentTypeE.length > 0 || documentTypeH.length > 0) {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate,
          documentChecklist,
        },
      });
      const check = validateFiles();
      setValidated(check);
    }
  }, [JSON.stringify(documentChecklist)]);

  const onVerifyDocument = (typeProp, itemProp) => {
    setSelectingFile({
      type: typeProp,
      item: itemProp,
    });
    setVerifyModalVisible(true);
  };

  const onChangeStatusHardCopy = (typeProp, itemProp) => {
    setSelectingFile({
      type: typeProp,
      item: itemProp,
    });
    setModalChangeStatus(true);
  };

  const onViewCommentClick = (typeProp, itemProp) => {
    setSelectingFile({
      type: typeProp,
      item: itemProp,
    });
    setViewCommentModalVisible(true);
  };

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

  const onComment = (values) => {
    assignPayloadToData({
      resubmitComment: values,
    });
  };

  const _renderItems = () => {
    const dataS = documentTypeS.filter((x) => x.value || x.required);
    const dataE = documentTypeE.filter((x) => x.value || x.required);

    const items = [
      {
        component: dataS.length > 0 && (
          <CollapseField
            items={documentTypeS || []}
            layout={documentChecklist.find((x) => x.type === DOCUMENTS_CHECKLIST_TYPE.SCAN_UPLOAD)}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: dataE.length > 0 && (
          <CollapseField
            items={dataE || []}
            layout={documentChecklist.find(
              (x) => x.type === DOCUMENTS_CHECKLIST_TYPE.ELECTRONICALLY,
            )}
            onVerifyDocument={onVerifyDocument}
            onViewCommentClick={onViewCommentClick}
          />
        ),
      },
      {
        component: documentTypeH.length > 0 && (
          <CollapseFieldsTypeH
            onChangeStatusHardCopy={onChangeStatusHardCopy}
            onComment={onComment}
            setSelectingFile={setSelectingFile}
            setComment={setComment}
            items={documentChecklist.find((x) => x.type === DOCUMENTS_CHECKLIST_TYPE.HARD_COPY)}
            selectingFile={selectingFile}
            comment={comment}
          />
        ),
      },
    ];
    return items.map((x) => x.component && <Col span={24}>{x.component}</Col>);
  };

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_LETTER}`);
  };

  const onClickNext = async () => {
    const nextStatus = NEW_PROCESS_STATUS.JOINED;

    await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        currentStep,
        processStatus: nextStatus,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep,
          },
        });
        dispatch({
          type: 'newCandidateForm/saveTemp',
          payload: {
            processStatus: nextStatus,
          },
        });
        history.push('/onboarding/list');
      }
    });
  };

  const _renderBottomBar = () => {
    return (
      <Col span={24}>
        <div className={styles.bottomBar}>
          <Row align="middle">
            <Col className={styles.bottomBar__button} span={24}>
              <Space size={24}>
                <Button
                  type="secondary"
                  onClick={onClickPrev}
                  className={styles.bottomBar__button__secondary}
                >
                  Previous
                </Button>
                <Button
                  type="primary"
                  onClick={onClickNext}
                  className={[
                    styles.bottomBar__button__primary,
                    !validated ? styles.bottomBar__button__disabled : '',
                  ]}
                  disabled={!validated}
                  // loading={loadingUpdateByHR}
                >
                  Complete
                </Button>
              </Space>
              <RenderAddQuestion page={Page.Eligibility_documents} />
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  const onCloseModal = () => {
    setVerifyModalVisible(false);
    setViewCommentModalVisible(false);
    setModalChangeStatus(false);
    setSelectingFile(null);
    setAction('');
  };

  const onVerified = () => {
    assignPayloadToData({ status: DOCUMENT_TYPES.VERIFIED, resubmitComment: '' });
    onCloseModal();
  };

  const onResubmit = (values) => {
    assignPayloadToData({
      resubmitComment: values.resubmitComment,
      status: DOCUMENT_TYPES.RESUBMIT_PENDING,
    });
    onCloseModal();
  };

  const onRejectNotAvailable = (values) => {
    assignPayloadToData({
      hrNotAvailableComment: values.hrNotAvailableComment,
      status: DOCUMENT_TYPES.NOT_AVAILABLE_REJECTED,
    });
    onCloseModal();
  };

  const onAcceptNotAvailable = () => {
    assignPayloadToData({
      status: DOCUMENT_TYPES.NOT_AVAILABLE_ACCEPTED,
    });
    onCloseModal();
  };

  const verifiedHardCopy = () => {
    assignPayloadToData({ status: DOCUMENT_TYPES.RECEIVED });
    onCloseModal();
  };

  return (
    <div className={styles.backgroundRecheck}>
      <Row gutter={[24, 24]}>
        <Col span={24} xl={16}>
          <p className={styles.backgroundRecheck__title}>Pre-Joinging Documents</p>
          <p className={styles.backgroundRecheck__subTitle}>
            All documents supporting candidate&apos;s employment eligibility will be displayed here
          </p>
          <Row gutter={[24, 24]} className={styles.backgroundRecheck__left}>
            {_renderItems()}
            {_renderBottomBar()}
          </Row>
        </Col>
        <Col span={24} xl={8}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <NoteComponent />
            </Col>
            <Col span={24}>
              <MessageBox />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* verify and resubmit modal  */}
      <CommonModal
        visible={verifyModalVisible}
        onClose={onCloseModal}
        content={
          <VerifyDocumentModalContent
            onClose={onCloseModal}
            action={action}
            setAction={setAction}
            item={selectingFile?.item}
            onResubmit={action ? onResubmit : () => {}}
          />
        }
        onSecondButtonClick={action ? () => setAction('') : () => setAction('resubmit')}
        hasCancelButton={false}
        hasSecondButton
        firstText={action ? 'Submit' : 'Verified'}
        secondText={action ? 'Cancel' : 'Resubmit'}
        title={`${selectingFile?.item?.alias} ${action ? 'for Resubmission' : ''}`}
        width={600}
        onFinish={action ? () => {} : onVerified}
      />

      {/* view candidate comment modal  */}
      <CommonModal
        visible={viewCommentModalVisible}
        title="View Comment"
        width={500}
        onClose={onCloseModal}
        content={
          <ViewCommentModalContent
            onClose={onCloseModal}
            selectedFile={selectingFile?.item}
            action={action}
            setAction={setAction}
            item={selectingFile?.item}
            onFinish={action ? onRejectNotAvailable : () => {}}
          />
        }
        onSecondButtonClick={action ? () => setAction('') : () => setAction('notAvailableReject')}
        hasCancelButton={false}
        hasSecondButton
        firstText={action ? 'Add' : 'Approve'}
        secondText={action ? 'Cancel' : 'Reject'}
        onFinish={action ? () => {} : onAcceptNotAvailable}
      />

      <CommonModal
        visible={modalChangeStatus}
        hasHeader={false}
        width={500}
        onClose={onCloseModal}
        content={
          <div className={styles.contentModal}>
            <img src={NotiIcon} alt="noti" />
            <p>Did you recive the document from candidate?</p>
          </div>
        }
        hasCancelButton
        firstText="Received"
        onFinish={verifiedHardCopy}
      />
    </div>
  );
};
export default connect(({ newCandidateForm, loading }) => ({
  newCandidateForm,
  loadingGetById: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  loadingUpdateByHR: loading.effects['newCandidateForm/updateByHR'],
}))(BackgroundRecheck);
