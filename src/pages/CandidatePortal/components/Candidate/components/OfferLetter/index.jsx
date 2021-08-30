/* eslint-disable no-unused-vars */
import { Button, Col, Form, message, Row, Select, Typography } from 'antd';
import axios from 'axios';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PROCESS_STATUS } from '@/utils/onboarding';
import { getCurrentTenant } from '@/utils/authority';
import NoteComponent from '@/pages/FormTeamMember/components/NoteComponent';
import FileContent from '../FileContent';
import AcceptOfferModal from './components/AcceptOfferModal';
import RejectOfferModal from './components/RejectOfferModal';
import styles from './index.less';

const OfferLetter = (props) => {
  const { dispatch, tempData = {}, data = {}, candidate, loading1, processStatus = '' } = props;

  const {
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
    candidateSignature: candidateSignatureProp = {},
    privateEmail: candidateEmailProp = '',
    // firstName: candidateFirstName = '',
    // middleName: candidateMiddleName = '',
    // lastName: candidateLastName = '',
    offerLetter: offerLetterProp = {},
    staticOfferLetter: staticOfferLetterProp = {},
    expiryDate: expiryDateProp = '',
    // assignTo: assignToProp = {},
    // assigneeManager: assigneeManagerProp = {},
  } = data;

  // const inputRefs = [];

  const [hrSignature, setHrSignature] = useState(hrSignatureProp || '');
  const [hrManagerSignature, setHrManagerSignature] = useState(hrManagerSignatureProp || '');
  const [candidateSignature, setCandidateSignature] = useState(candidateSignatureProp || '');

  const [offerLetter, setOfferLetter] = useState(
    offerLetterProp && !isEmpty(offerLetterProp)
      ? offerLetterProp.attachment?.url || offerLetterProp.url || ''
      : staticOfferLetterProp.attachment?.url || staticOfferLetterProp.url || '',
  );

  const [mail, setMail] = useState(candidateEmailProp || '');

  // const [role, setRole] = useState('');

  const [openModalCus, setOpenModalCus] = useState(false);

  const [acceptOfferModalVisible, setAcceptOfferModalVisible] = useState(false);
  const [rejectOfferModalVisible, setRejectOfferModalVisible] = useState(false);

  // const saveChanges = () => {
  //   // Save changes to redux store
  //   if (dispatch) {
  //     dispatch({
  //       type: 'newCandidateForm/save',
  //       payload: {
  //         tempData: {
  //           ...tempData,
  //           email: mail,
  //           hrSignature,
  //           hrManagerSignature,
  //         },
  //       },
  //     });
  //   }
  // };

  useEffect(() => {
    // window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }, []);

  // useEffect(() => {
  //   // Save changes to store whenever input fields change
  //   saveChanges();
  // }, [mail, hrSignature, hrManagerSignature]);

  useEffect(() => {}, [hrSignatureProp, hrManagerSignatureProp]);

  useEffect(() => {
    setCandidateSignature(candidateSignatureProp);
  }, [candidateSignatureProp]);

  useEffect(() => {
    const { url = '', id = '' } = candidateSignature;
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        tempData: {
          ...tempData,
          candidateSignature: {
            ...tempData.candidateSignature,
            id,
            url,
          },
        },
      },
    });
  }, [candidateSignature]);

  const handleFinalSubmit = async (id) => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        candidateSignature: id,
        candidate,
        tenantId: getCurrentTenant(),
      },
    });
    setAcceptOfferModalVisible(false);
    const res = await dispatch({
      type: 'candidatePortal/submitCandidateFinalOffer',
      payload: {
        candidate,
        candidateFinalSignature: id,
        options: 1,
        tenantId: getCurrentTenant(),
      },
    });
    if (res.statusCode === 200) {
      dispatch({
        type: 'candidatePortal/saveOrigin',
        payload: {
          processStatus: PROCESS_STATUS.ACCEPTED_FINAL_OFFERS,
        },
      });
    }
  };

  const handleFinalReject = async (reason) => {
    if (!dispatch) {
      return;
    }
    setRejectOfferModalVisible(false);
    const res = await dispatch({
      type: 'candidatePortal/submitCandidateFinalOffer',
      payload: {
        candidate,
        options: 2,
        tenantId: getCurrentTenant(),
        reasonForRejection: reason,
      },
    });
    if (res.statusCode === 200) {
      dispatch({
        type: 'candidatePortal/saveOrigin',
        payload: {
          processStatus: PROCESS_STATUS.FINAL_OFFERS_CANDIDATE,
        },
      });
    }
  };

  const Note = {
    title: 'Note',
    data: (
      <Typography.Text>
        The Salary structure will be sent as a <span>provisional offer</span>. The candidate must
        accept the and acknowledge the salary structure as a part of final negotiation.
        <br />
        <br />
        <span style={{ fontWeight: 'bold', color: '#707177' }}>
          Post acceptance of salary structure, the final offer letter will be sent.
        </span>
      </Typography.Text>
    ),
  };

  const onDownload = (url) => {
    const fileName = url.split('/').pop();
    message.loading('Downloading file. Please wait...');
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
    }).then((resp) => {
      // eslint-disable-next-line compat/compat
      const urlDownload = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = urlDownload;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  const _renderBottomBar = () => {
    const { loadingUpdateCandidate = false } = props;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={8}>
            {processStatus === PROCESS_STATUS.ACCEPTED_FINAL_OFFERS && (
              <span className={styles.greenText}>Offer Accepted</span>
            )}
            {(processStatus === PROCESS_STATUS.FINAL_OFFERS_CANDIDATE ||
              processStatus === PROCESS_STATUS.FINAL_OFFERS_HR) && (
              <span className={styles.redText}>Offer Rejected</span>
            )}
          </Col>
          <Col span={16}>
            <div className={styles.bottomBar__button}>
              {processStatus === PROCESS_STATUS.SENT_FINAL_OFFERS && (
                <>
                  <Button
                    type="secondary"
                    onClick={() => {
                      setRejectOfferModalVisible(true);
                    }}
                    className={styles.bottomBar__button__secondary}
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setAcceptOfferModalVisible(true);
                    }}
                    className={styles.bottomBar__button__primary}
                    // disabled={!filledBasicInformation || !isVerifiedBasicInfo}
                    loading={loadingUpdateCandidate || loading1}
                  >
                    Accept Offer
                  </Button>
                </>
              )}

              {(processStatus === PROCESS_STATUS.ACCEPTED_FINAL_OFFERS ||
                processStatus === PROCESS_STATUS.FINAL_OFFERS_CANDIDATE ||
                processStatus === PROCESS_STATUS.FINAL_OFFERS_HR) && (
                <Button
                  type="primary"
                  onClick={() => {
                    onDownload(offerLetter);
                  }}
                  className={styles.bottomBar__button__primary}
                >
                  Download Offer Letter
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Row gutter={[24, 24]} className={styles.previewContainer}>
      <Col xs={24} xl={16} className={styles.left}>
        <div className={styles.header}>
          <span className={styles.title}>Offer Letter</span>
          <span className={styles.expiryDate}>
            {expiryDateProp
              ? `Offer will Expires on ${moment(expiryDateProp).format('MM.DD.YY')}`
              : ''}
          </span>
        </div>
        <div className={styles.leftContent}>
          <FileContent url={offerLetter} />
        </div>
        {_renderBottomBar()}
      </Col>

      <Col xs={24} xl={8} className={styles.right}>
        <NoteComponent note={Note} />
        {/* <CustomModal
          open={openModalCus}
          closeModal={closeModal}
          content={
            <ModalContent closeModal={closeModal} tempData={tempData} candidateEmail={mail} />
          }
        /> */}
      </Col>

      <AcceptOfferModal
        visible={acceptOfferModalVisible}
        onClose={() => setAcceptOfferModalVisible(false)}
        onFinish={handleFinalSubmit}
      />
      <RejectOfferModal
        visible={rejectOfferModalVisible}
        onClose={() => setRejectOfferModalVisible(false)}
        onFinish={handleFinalReject}
      />
    </Row>
  );
};

// export default PreviewOffer;
export default connect(
  ({
    info: { previewOffer = {} } = {},
    loading,
    user: { currentUser = {} } = {},
    // newCandidateForm: { rookieId = '', tempData = {}, data = {} } = {},
    candidatePortal: {
      data: { processStatus = '' } = {},
      tempData = {},
      data = {},
      candidate = '',
    } = {},
  }) => ({
    previewOffer,
    loading: loading.effects['upload/uploadFile'],
    currentUser,
    tempData,
    data,
    processStatus,
    candidate,
    // rookieId,
    loading1: loading.effects['candidatePortal/submitCandidateFinalOffer'],
  }),
)(OfferLetter);
