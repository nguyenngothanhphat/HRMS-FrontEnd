/* eslint-disable no-unused-vars */
import NoteComponent from '@/pages/FormTeamMember/components/NoteComponent';
import { getCurrentTenant } from '@/utils/authority';
import { PROCESS_STATUS } from '@/utils/onboarding';
import { Button, Col, Form, Row, Select, Typography } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import FileContent from '../FileContent';
import AcceptOfferModal from './components/AcceptOfferModal';
import RejectOfferModal from './components/RejectOfferModal';
import styles from './index.less';

const OfferLetter = (props) => {
  const { dispatch, tempData = {}, data = {}, candidate, loading1 } = props;

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

  const saveChanges = () => {
    // Save changes to redux store
    if (dispatch) {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          tempData: {
            ...tempData,
            email: mail,
            hrSignature,
            hrManagerSignature,
          },
        },
      });
    }
  };

  useEffect(() => {
    // window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }, []);

  useEffect(() => {
    // Save changes to store whenever input fields change
    saveChanges();
  }, [mail, hrSignature, hrManagerSignature]);

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
    dispatch({
      type: 'candidatePortal/submitCandidateFinalOffer',
      payload: {
        candidate,
        candidateFinalSignature: id,
        options: 1,
        tenantId: getCurrentTenant(),
      },
    });
    setAcceptOfferModalVisible(false);
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

  const _renderBottomBar = () => {
    const { loadingUpdateCandidate = false } = props;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={8} />
          <Col span={16}>
            <div className={styles.bottomBar__button}>
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
                loading={loadingUpdateCandidate}
              >
                Accept Offer
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Row gutter={[24, 24]} className={styles.previewContainer}>
      <Col span={16} className={styles.left}>
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

      <Col span={8} className={styles.right}>
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
    // candidateInfo: { rookieId = '', tempData = {}, data = {} } = {},
    candidatePortal: { tempData = {}, data = {}, candidate = '' } = {},
  }) => ({
    previewOffer,
    loading: loading.effects['upload/uploadFile'],
    currentUser,
    tempData,
    data,
    candidate,
    // rookieId,
    loading1: loading.effects['candidatePortal/submitCandidateFinalOffer'],
  }),
)(OfferLetter);
