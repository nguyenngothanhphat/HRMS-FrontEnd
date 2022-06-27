import { Button, Col, Input, Popover, Radio, Row, Select, Skeleton, Space, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage, history } from 'umi';
import BigEditVector from '@/assets/bigEditVector.svg';
import CustomModal from '@/components/CustomModal';
import ModalDrawSignature from '@/components/ModalDrawSignature';
import ModalGenerateSignature from '@/components/ModalGenerateSignature';
import TextSignature from '@/components/TextSignature';
import { getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/utils/onboarding';
// import { SendOutlined } from '@ant-design/icons';
import ModalUpload from '../../../../components/ModalUpload';
import NoteComponent from '../NoteComponent';
import CancelIcon from './components/CancelIcon';
import ExtendOfferModal from './components/ExtendOfferModal';
import FileContent from './components/FileContent';
import whiteImg from './components/images/whiteImg.png';
// import SendEmail from './components/SendEmail';
import ModalContent from './components/ModalContent';
import RejectOfferModal from './components/RejectOfferModal';
import WithdrawOfferModal from './components/WithdrawOfferModal';
import styles from './index.less';

const { Option } = Select;

const PreviewOffer = (props) => {
  const {
    dispatch,
    currentUser = {},
    tempData = {},
    data = {},
    loading1,
    loading2,
    loading3,
    loadingFetchCandidate = false,
    // loadingExtendOfferDate = false,
    // loadingWithdrawOffer = false,
  } = props;

  const {
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
    offerLetter: offerLetterProp,
    staticOfferLetter: staticOfferLetterProp,
    candidateSignature: candidateSignatureProp,
    expiryDate: expiryDateProp = '',
    oldExpiryDate: oldExpiryDateProp = '',
    assignTo: { _id: assigneeId = '' } = {},
    assigneeManager: { _id: assigneeManagerId = '' } = {},
    ticketID = '',
    offerLetterTemplate: offerLetterTemplateProp = '',
    reasonForRejectionHR: reasonForRejectionHRProp = '',
    reasonForWithdraw: reasonForWithdrawProp = '',
  } = tempData;
  const {
    privateEmail: candidateEmailProp = '',
    firstName: candidateFirstName = '',
    middleName: candidateMiddleName = '',
    lastName: candidateLastName = '',
    processStatus,
  } = data;

  const { employee: { _id: currentUserId = '' } = {} || {} } = currentUser;
  const [hrSignature, setHrSignature] = useState(hrSignatureProp || '');

  const [hrSignatureSubmit, setHrSignatureSubmit] = useState(false);
  const [hrManagerSignature, setHrManagerSignature] = useState(hrManagerSignatureProp || '');
  const [hrManagerSignatureSubmit, setHrManagerSignatureSubmit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [candidateSignature, setCandidateSignature] = useState(candidateSignatureProp || '');

  const [mail, setMail] = useState(candidateEmailProp || '');

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);
  const [openModal5, setOpenModal5] = useState(false);

  const [modalSignature, setModalSignature] = useState('');
  const [isSignatureHR, setIsSignatureHR] = useState(false);
  const [optionSignature, setOptionSignature] = useState('upload');
  const [optionSignatureHRManager, setOptionSignatureHRManager] = useState('upload');
  const [valueDigitalSignature, setValueDigitalSignature] = useState(0);
  const [arrImgBase64, setArrImgBase64] = useState([]);
  const [openDigital, setOpenDigital] = useState(false);
  const [nameSignature, setNameSignature] = useState('');

  const getOfferLetterProp = () => {
    if (staticOfferLetterProp && staticOfferLetterProp.url) {
      return staticOfferLetterProp.url;
    }
    if (offerLetterProp && offerLetterProp.attachment && offerLetterProp.attachment.url) {
      return offerLetterProp.attachment.url;
    }
    return '';
  };

  const [offerLetter, setOfferLetter] = useState(getOfferLetterProp());

  // const processStatus = NEW_PROCESS_STATUS.AWAITING_APPROVALS;
  // const processStatus = NEW_PROCESS_STATUS.SALARY_NEGOTIATION;
  // const processStatus = NEW_PROCESS_STATUS.OFFER_ACCEPTED;
  // const processStatus = NEW_PROCESS_STATUS.OFFER_REJECTED;
  // const processStatus = NEW_PROCESS_STATUS.OFFER_WITHDRAWN;

  const isTicketAssignee = currentUserId === assigneeId;
  // const isTicketAssignee = true;
  const isTicketManager = currentUserId === assigneeManagerId;
  // const isTicketManager = false;
  const isNewOffer = processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION;
  const isAwaitingOffer = processStatus === NEW_PROCESS_STATUS.AWAITING_APPROVALS;
  const isNeedsChanges = processStatus === NEW_PROCESS_STATUS.NEEDS_CHANGES;
  const isAcceptedOffer = processStatus === NEW_PROCESS_STATUS.OFFER_ACCEPTED;
  const isRejectedOffer = processStatus === NEW_PROCESS_STATUS.OFFER_REJECTED;
  const isWithdrawnOffer = processStatus === NEW_PROCESS_STATUS.OFFER_WITHDRAWN;
  const isSentOffer = processStatus === NEW_PROCESS_STATUS.OFFER_RELEASED;
  const isDocumentCheckList = processStatus === NEW_PROCESS_STATUS.DOCUMENT_CHECKLIST_VERIFICATION;

  // MODALS
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  // const [extendOfferModalVisible, setExtendOfferModalVisible] = useState(false);
  // const [withdrawOfferModalVisible, setWithdrawOfferModalVisible] = useState(false);
  // FUNCTIONS

  const resetImg = (type) => {
    if (type === 'hr') {
      setHrSignature({});
    }
    if (type === 'hrManager') {
      setHrManagerSignature({});
    }
  };

  const saveChanges = () => {
    // Save changes to redux store
    // if (dispatch) {
    //   dispatch({
    //     type: 'newCandidateForm/save',
    //     payload: {
    //       tempData: {
    //         ...tempData,
    //         email: mail,
    //         hrSignature,
    //         hrManagerSignature,
    //       },
    //     },
    //   });
    // }
  };
  // const isHr = role.indexOf('HR') > -1 || role.indexOf('hr') > -1;
  // const isHrManager = role.indexOf('HR-MANAGER') > -1 || role.indexOf('hr-manager') > -1;

  const loadImage = (response) => {
    const { data: responseData = [] } = response;
    const { url, id } = responseData[0];

    if (isSignatureHR) {
      setHrSignature({
        url,
        id,
      });

      // save to Store
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          tempData: {
            ...tempData,
            hrSignature: {
              id,
              url,
            },
          },
        },
      });

      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          data: {
            ...data,
            // hrSignature: id,
            hrSignature: {
              ...data.hrSignature,
              id,
              url,
            },
          },
        },
      });
    } else {
      // setFile2(url);
      setHrManagerSignature({ url, id });
      // save to Store
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          tempData: {
            ...tempData,
            hrManagerSignature: {
              id,
              url,
            },
          },
        },
      });

      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          data: {
            ...data,
            hrManagerSignature: {
              ...data.hrSignature,
              id,
              url,
            },
          },
        },
      });
    }
  };

  const handleSentForApproval = () => {
    if (!dispatch) {
      return;
    }

    const { id } = hrSignature;
    const { candidate } = data;
    const { skip = 0 } = tempData;
    // let option = 1;
    // if (valueToFinalOffer === 1) {
    //   option = 2;
    // } else {
    //   option = 1;
    // }
    // call API
    dispatch({
      type: 'newCandidateForm/sentForApprovalEffect',
      payload: { hrSignature: id, candidate, options: skip, tenantId: getCurrentTenant() },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        if (isNeedsChanges) {
          setOpenModal5(true);
        } else {
          setOpenModal2(true);
        }
      }
    });
  };

  const handleSendFinalOffer = () => {
    if (!dispatch) {
      return;
    }
    const { id } = hrManagerSignature;
    const { candidate } = data;
    // call API
    dispatch({
      type: 'newCandidateForm/approveFinalOfferEffect',
      payload: { hrManagerSignature: id, candidate, options: 1, tenantId: getCurrentTenant() },
      action: 'accept',
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(true);
      }
    });
  };

  const handleRejectOffer = async (reason) => {
    const { id } = hrManagerSignature;
    const { candidate } = data;
    const res = await dispatch({
      type: 'newCandidateForm/approveFinalOfferEffect',
      payload: {
        candidate,
        reasonForRejection: reason,
        hrManagerSignature: id,
        options: 2,
        tenantId: getCurrentTenant(),
      },
      // action: 'reject',
      action: 'needschanges',
    });
    if (res.statusCode === 200) {
      setRejectModalVisible(false);
      setOpenModal3(true);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
  }, []);

  useEffect(() => {
    setHrManagerSignature(hrManagerSignatureProp);
  }, [hrManagerSignatureProp]);

  useEffect(() => {
    setHrSignature(hrSignatureProp);
  }, [hrSignatureProp]);

  useEffect(() => {
    // Save changes to store whenever input fields change
    saveChanges();
  }, [mail, hrSignature, hrManagerSignature]);

  useEffect(() => {
    setCandidateSignature(candidateSignatureProp);
  }, [candidateSignatureProp]);

  // Fetch new offer when redux update
  useEffect(() => {
    if (offerLetterProp && offerLetterProp.url) {
      setOfferLetter(offerLetterProp.url);
    }
  }, [offerLetterProp]);

  const closeModal = () => {
    setOpenModal(false);

    history.push(`/onboarding/list/offer-released`);
  };

  const closeModal2 = () => {
    setOpenModal2(false);
    history.push(`/onboarding/list/awaiting-approvals`);
  };

  const closeModal3 = () => {
    setOpenModal3(false);

    if (isNeedsChanges) {
      history.push(`/onboarding/list/needs-changes`);
    } else {
      history.push(`/onboarding/list/rejected-offer`);
    }
  };

  const closeModal4 = () => {
    setOpenModal4(false);
    history.push(`/onboarding/list/withdrawn-offers`);
  };

  const renderCandidateSignature = () => {
    return candidateSignature && candidateSignature.url;
  };

  // close modal signature
  const closeModalSignature = () => {
    setModalSignature('');
  };
  // convert base64 to file
  const dataURItoBlob = (dataURI) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i += 1) {
      array.push(binary.charCodeAt(i));
    }
    // eslint-disable-next-line compat/compat
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };
  // save draw signature
  const saveDrawSignature = async (imageBase64) => {
    const formData = new FormData();
    if (!imageBase64) {
      closeModalSignature();
      return;
    }
    const file = dataURItoBlob(imageBase64);
    formData.append('blob', file, 'signature.jpeg');
    const responsive = await dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    });
    loadImage(responsive);
    closeModalSignature();
  };
  // open modal upload signature
  const openModalUploadSignature = () => {
    setModalSignature(optionSignature);
    setIsSignatureHR(true);
  };
  const resetDefaultState = () => {
    setValueDigitalSignature(0);
    setNameSignature('');
    setArrImgBase64([]);
    setOptionSignature('upload');
    setOptionSignatureHRManager('upload');
    setOpenDigital(false);
  };

  const getImg = (e) => {
    const arr = arrImgBase64;
    arr.push(e);
    setArrImgBase64(arr);
  };
  const changeName = (e) => {
    setOpenDigital(true);
    setArrImgBase64([]);
    setNameSignature(e.target.value);
  };

  const handleHrSignatureSubmit = async () => {
    const { _id } = data;
    if (!dispatch || !_id) {
      return;
    }
    if (arrImgBase64.length > 0) {
      const formData = new FormData();
      if (!arrImgBase64[valueDigitalSignature]) {
        setOpenModal('');
        return;
      }
      const file = dataURItoBlob(arrImgBase64[valueDigitalSignature]);
      formData.append('blob', file, 'signatureCandidate.jpeg');
      const responsive = await dispatch({
        type: 'upload/uploadFile',
        payload: formData,
      });
      const { data: imageData = [] } = responsive;
      const { id = '', url = '' } = imageData[0];
      setHrSignature({
        url,
        id,
      });
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          tempData: {
            ...tempData,
            hrSignature: {
              id,
              url,
            },
          },
        },
      });

      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          data: {
            ...data,
            // hrSignature: id,
            hrSignature: {
              ...data.hrSignature,
              id,
              url,
            },
          },
        },
      });
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate: _id,
          hrSignature: id,
          currentStep: ONBOARDING_STEPS.OFFER_DETAILS,
          tenantId: getCurrentTenant(),
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          setHrSignatureSubmit(true);
        }
      });
      resetDefaultState();
    } else {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate: _id,
          hrSignature: hrSignatureProp.id,
          currentStep: ONBOARDING_STEPS.OFFER_DETAILS,
          tenantId: getCurrentTenant(),
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          setHrSignatureSubmit(true);
        }
      });
    }
  };
  const renderSignatureHr = () => {
    if (optionSignature === 'digital')
      return (
        <>
          <div>
            <p>Digital Signature</p>
          </div>
          <Row>
            <Col span={24}>
              <Popover
                content={
                  <Radio.Group
                    onChange={(e) => {
                      setValueDigitalSignature(e.target.value);
                    }}
                    value={valueDigitalSignature}
                  >
                    <Space direction="vertical">
                      {['Airin', 'GermanyScript', 'SH Imogen Agnes', 'AudreyAndReynold'].map(
                        (item, index) => (
                          <Radio value={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextSignature
                              name={nameSignature}
                              getImage={getImg}
                              x={10}
                              y={75}
                              height={100}
                              font={item === 'Airin' ? `48px ${item}` : `60px ${item}`}
                            />
                          </Radio>
                          // </Col>
                        ),
                      )}
                    </Space>
                  </Radio.Group>
                }
                placement="left"
                trigger="hover"
                visible={nameSignature && openDigital}
              >
                <Input placeholder="Enter your name" onChange={changeName} value={nameSignature} />
              </Popover>
            </Col>
          </Row>
        </>
      );
    return (
      <div className={styles.upload}>
        {!hrSignature.url ? (
          // Default image
          <>
            <img className={styles.signatureImg} src={whiteImg} alt="" />
            {(isTicketAssignee || isTicketManager) &&
              (isNewOffer || isAwaitingOffer || isNeedsChanges) && (
                <button type="submit" onClick={openModalUploadSignature}>
                  {optionSignature === 'draw' ? 'Click here to draw' : 'Upload'}
                </button>
              )}
          </>
        ) : (
          <>
            <img className={styles.signatureImg} src={hrSignature.url} alt="" />
            {(isTicketAssignee || isTicketManager) &&
              (isNewOffer || isAwaitingOffer || isNeedsChanges) && (
                <>
                  <button type="submit" onClick={openModalUploadSignature}>
                    {optionSignature === 'draw' ? 'Click here to draw' : 'Upload new'}
                  </button>
                  <CancelIcon resetImg={() => resetImg('hr')} />
                </>
              )}
          </>
        )}
      </div>
    );
  };

  const createFinalOffer = () => {
    const { _id } = data;
    dispatch({
      type: 'newCandidateForm/createFinalOfferEffect',
      payload: {
        candidateId: _id,
        templateId: offerLetterTemplateProp,
        tenantId: getCurrentTenant(),
      },
    }).then((res) => {
      const { data: { _id: newTemplateId = '', attachment = {} } = {} } = res;
      if (attachment) {
        setOfferLetter(attachment.url);
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            candidate: _id,
            currentStep: ONBOARDING_STEPS.OFFER_DETAILS,
            offerLetter: newTemplateId,
          },
        });
      }
    });
  };

  const handleHrManagerSignatureSubmit = async () => {
    const { _id } = data;
    if (!dispatch || !_id) {
      return;
    }
    if (arrImgBase64.length > 0) {
      const formData = new FormData();
      if (!arrImgBase64[valueDigitalSignature]) {
        setOpenModal('');
        return;
      }
      const file = dataURItoBlob(arrImgBase64[valueDigitalSignature]);
      formData.append('blob', file, 'signatureCandidate.jpeg');
      const responsive = await dispatch({
        type: 'upload/uploadFile',
        payload: formData,
      });
      const { data: imageData = [] } = responsive;
      const { id = '', url = '' } = imageData[0];
      setHrManagerSignature({ url, id });
      // save to Store
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          tempData: {
            ...tempData,
            hrManagerSignature: {
              id,
              url,
            },
          },
        },
      });

      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          data: {
            ...data,
            hrManagerSignature: {
              ...data.hrSignature,
              id,
              url,
            },
          },
        },
      });
      dispatch({
        type: 'newCandidateForm/addManagerSignatureEffect',
        payload: {
          candidate: _id,
          hrManagerSignature: id,
          tenantId: getCurrentTenant(),
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          createFinalOffer();
          setHrManagerSignatureSubmit(true);
        }
      });
      resetDefaultState();
    } else {
      dispatch({
        type: 'newCandidateForm/addManagerSignatureEffect',
        payload: {
          candidate: _id,
          hrManagerSignature: hrManagerSignatureProp.id,
          tenantId: getCurrentTenant(),
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          setHrManagerSignatureSubmit(true);
          createFinalOffer();
        }
      });
    }
  };
  const renderSignatureHrManager = () => {
    if (optionSignatureHRManager === 'digital')
      return (
        <>
          <div>
            <p>Digital Signature</p>
          </div>
          <Row>
            <Col span={24}>
              <Popover
                content={
                  <Radio.Group
                    onChange={(e) => {
                      setValueDigitalSignature(e.target.value);
                    }}
                    value={valueDigitalSignature}
                  >
                    <Space direction="vertical">
                      {['Airin', 'GermanyScript', 'SH Imogen Agnes', 'AudreyAndReynold'].map(
                        (item, index) => (
                          <Radio value={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextSignature
                              name={nameSignature}
                              getImage={getImg}
                              x={10}
                              y={75}
                              height={100}
                              font={item === 'Airin' ? `48px ${item}` : `60px ${item}`}
                            />
                          </Radio>
                          // </Col>
                        ),
                      )}
                    </Space>
                  </Radio.Group>
                }
                placement="left"
                trigger="hover"
                visible={nameSignature && openDigital}
              >
                <Input placeholder="Enter your name" onChange={changeName} value={nameSignature} />
              </Popover>
            </Col>
          </Row>
        </>
      );
    return (
      <div className={styles.upload}>
        {!hrManagerSignature.url ? (
          // Default image
          <img className={styles.signatureImg} src={whiteImg} alt="" />
        ) : (
          <img className={styles.signatureImg} src={hrManagerSignature.url} alt="" />
        )}

        {isTicketManager && (isNewOffer || isAwaitingOffer || isNeedsChanges) && (
          <>
            <button
              type="submit"
              onClick={() => {
                setIsSignatureHR(false);
                setModalSignature(optionSignatureHRManager);
              }}
            >
              {optionSignatureHRManager === 'draw' ? 'Click here to draw' : 'Upload new'}
            </button>

            <CancelIcon resetImg={() => resetImg('hrManager')} />
          </>
        )}
      </div>
    );
  };

  const _renderBottomBar = () => {
    // HR IS ASSIGNEE
    if (isTicketAssignee && !isTicketManager) {
      const hrButtonText = () => {
        if (isNewOffer) {
          return 'Send for approval';
        }
        return '';
      };

      const checkDisableButton = () => {
        if (isNewOffer && hrSignature.url) {
          return false;
        }
        return true;
      };

      const onPrimaryButtonClick = () => {
        if (isNewOffer) {
          handleSentForApproval();
        }
      };

      const onSecondaryButtonClick = () => {
        history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_DETAILS}`);
      };
      return (
        <div className={styles.bottomBar}>
          <Row align="middle">
            <Col span={24}>
              <div className={styles.bottomBar__button}>
                <Button
                  type="secondary"
                  className={styles.bottomBar__button__secondary}
                  onClick={onSecondaryButtonClick}
                >
                  Previous
                </Button>
                {isNewOffer && (
                  <Button
                    disabled={checkDisableButton()}
                    type="primary"
                    className={styles.bottomBar__button__primary}
                    onClick={onPrimaryButtonClick}
                    loading={loading1}
                  >
                    {hrButtonText()}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      );
    }

    // HR MANAGER IS TICKET MANAGER or HR MANAGER IS BOTH ASSIGNEE & MANAGER
    if (isTicketManager) {
      const managerSecondaryButtonText = () => {
        if (isAwaitingOffer || isNewOffer) {
          return 'Needs Changes';
        }

        // if (isRejectedOffer) {
        //   return 'Offer Rejected';
        // }

        return 'Previous';
      };

      const managerPrimaryButtonText = () => {
        if (isSentOffer || isAcceptedOffer || isNeedsChanges || isDocumentCheckList) {
          return 'Next';
        }

        return 'Approve';
      };

      const onSecondaryButtonClick = () => {
        if (isAwaitingOffer || isNewOffer) {
          setRejectModalVisible(true);
        } else {
          history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_DETAILS}`);
        }
      };

      const onPrimaryButtonClick = () => {
        if (isSentOffer || isAcceptedOffer || isDocumentCheckList) {
          history.push(
            `/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.DOCUMENT_CHECKLIST_VERIFICATION}`,
          );
        }
        if (isNewOffer || isAwaitingOffer) {
          // HR MANAGER APPROVES A TICKET HERE
          handleSendFinalOffer();
        }
        if (isNeedsChanges) {
          handleSentForApproval();
        }
      };

      const checkDisablePrimaryButton = () => {
        if (isAwaitingOffer || isNewOffer || isNeedsChanges) {
          if (!hrManagerSignature.url || !hrSignature.url) {
            return true;
          }
        }

        return false;
      };

      return (
        <div className={styles.bottomBar}>
          <Row align="middle">
            <Col span={24}>
              <div className={styles.bottomBar__button}>
                <Button
                  type="secondary"
                  onClick={onSecondaryButtonClick}
                  className={styles.bottomBar__button__secondary}
                >
                  {managerSecondaryButtonText()}
                </Button>
                {!isWithdrawnOffer && !isRejectedOffer && (
                  <Button
                    type="primary"
                    onClick={onPrimaryButtonClick}
                    className={[
                      styles.bottomBar__button__primary,
                      checkDisablePrimaryButton() ? styles.bottomBar__button__disabled : '',
                    ]}
                    disabled={checkDisablePrimaryButton()}
                    loading={loading2}
                  >
                    {managerPrimaryButtonText()}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      );
    }

    return '';
  };

  // sent offer information
  const SentNote = {
    title: 'Offer Sent',
    data: (
      <Typography.Text>
        The offer has been sent to the candidate to accept. You can either <span>withdraw</span> the
        offer or <span>extend</span> the offer letter date.
      </Typography.Text>
    ),
  };

  const ExtendedNote = {
    title: 'Offer letter date extended',
    data: (
      <Typography.Text>
        The offer letter date has been extended from{' '}
        <span>{oldExpiryDateProp ? moment(oldExpiryDateProp).format('MM.DD.YY') : '-'}</span> to{' '}
        <span>{expiryDateProp ? moment(expiryDateProp).format('MM.DD.YY') : '-'}</span>
      </Typography.Text>
    ),
  };

  const AcceptedNote = {
    title: 'Offer Accepted',
    data: <Typography.Text>The offer has been accepted by the candidate.</Typography.Text>,
  };

  const WithdrawnNote = {
    title: 'Offer Withdrawn',
    data: (
      <p>
        <Typography.Text>The offer has been withdrawn by the HR Manager.</Typography.Text>
        <br />
        <Typography.Text>Reason: {reasonForWithdrawProp}</Typography.Text>
      </p>
    ),
  };

  const RejectedNote = {
    title: 'Offer Rejected',
    data: (
      <p>
        <Typography.Text>The offer has been rejected by the HR Manager.</Typography.Text>
        <br />
        <Typography.Text>Reason: {reasonForRejectionHRProp}</Typography.Text>
      </p>
    ),
  };

  const OwnerNote = {
    title: 'Notice',
    data: (
      <p>
        <Typography.Text>
          You must be ticket's assignee or assignee's manager to proceed this step.
        </Typography.Text>
      </p>
    ),
  };

  const SentForApprovalNote = {
    title: 'Offer Sent For Approval',
    data: <Typography.Text>The offer has been sent to HR Manager for approval.</Typography.Text>,
  };

  if (loadingFetchCandidate) return <Skeleton />;

  // main
  return (
    <Row gutter={[24, 24]} className={styles.previewContainer}>
      <Col xs={24} xl={16} className={styles.left}>
        {(isAwaitingOffer || isNewOffer || isSentOffer || isNeedsChanges) && (
          <div className={styles.header}>
            {/* <span className={styles.title}>Offer Letter</span> */}
            <span />
            <span className={styles.expiryDate}>
              Offer will Expires on{' '}
              {expiryDateProp ? moment(expiryDateProp).format('MM.DD.YY') : '-'}
            </span>
          </div>
        )}
        <div className={styles.leftContent}>
          <FileContent url={offerLetter} />
        </div>
        {_renderBottomBar()}
      </Col>

      <Col xs={24} xl={8} className={styles.right}>
        {!isTicketManager && !isTicketAssignee && (
          <>
            <NoteComponent note={OwnerNote} />
            <div style={{ marginBottom: '24px' }} />
          </>
        )}
        {/* SENT OFFER  */}
        {isTicketManager && isSentOffer && (
          <>
            <NoteComponent note={SentNote} />
            <div style={{ marginBottom: '24px' }} />
          </>
        )}

        {/* ACCEPTED OFFER  */}
        {isAcceptedOffer && (
          <>
            <NoteComponent note={AcceptedNote} />
            <div style={{ marginBottom: '24px' }} />
          </>
        )}

        {/* REJECTED OFFER  */}
        {isRejectedOffer && (
          <>
            <NoteComponent note={RejectedNote} />
            <div style={{ marginBottom: '24px' }} />
          </>
        )}

        {/* WITHDRAWN OFFER  */}
        {isWithdrawnOffer && (
          <>
            <NoteComponent note={WithdrawnNote} />
            <div style={{ marginBottom: '24px' }} />
          </>
        )}

        {/* EXTENDED OFFER  */}
        {isTicketManager && isSentOffer && oldExpiryDateProp && (
          <>
            <NoteComponent note={ExtendedNote} />
            <div style={{ marginBottom: '24px' }} />
          </>
        )}

        {/* HR SENT FOR APPROVAL  */}
        {isTicketAssignee && !isTicketManager && isAwaitingOffer && isNeedsChanges && (
          <>
            <NoteComponent note={SentForApprovalNote} />
            <div style={{ marginBottom: '24px' }} />
          </>
        )}

        {/* HR signature */}
        {(isTicketAssignee || isTicketManager) && (
          <div className={styles.signature}>
            <header>
              <img src={BigEditVector} alt="" />
              <h2>{formatMessage({ id: 'component.previewOffer.hrSignature' })}</h2>
            </header>

            {hrSignature.user ? (
              <p>
                Undersigned - {hrSignature.user.employee?.generalInfo?.firstName}{' '}
                {hrSignature.user.employee?.generalInfo?.lastName}
              </p>
            ) : (
              <p>Undersigned</p>
            )}

            {(isTicketAssignee || isTicketManager) &&
              (isNewOffer || isAwaitingOffer || isNeedsChanges) && (
                <Row>
                  <Col span={24}>
                    <Select
                      value={optionSignature}
                      style={{ width: '100%', marginBottom: '5px' }}
                      onChange={(e) => {
                        setOptionSignature(e);
                      }}
                    >
                      <Option value="upload">Upload</Option>
                      <Option value="draw">Draw</Option>
                      <Option value="digital">Digital Signature</Option>
                    </Select>
                  </Col>
                </Row>
              )}

            {renderSignatureHr()}

            {(isTicketAssignee || isTicketManager) &&
              (isNewOffer || isAwaitingOffer || isNeedsChanges) && (
                <div className={styles.submitContainer}>
                  <Button
                    type="primary"
                    onClick={handleHrSignatureSubmit}
                    disabled={
                      !hrSignature.url &&
                      !(isTicketAssignee || isTicketManager) &&
                      optionSignature !== 'digital'
                    }
                    className={`${
                      (hrSignature.url && (isTicketAssignee || isTicketManager)) ||
                      optionSignature === 'digital'
                        ? styles.active
                        : styles.disable
                    }`}
                    loading={loading3}
                  >
                    Submit
                  </Button>

                  <span className={styles.submitMessage}>
                    {hrSignatureSubmit ? 'Signature submitted' : ''}
                  </span>
                </div>
              )}
          </div>
        )}

        {/* OLD SEND FOR APPROVAL */}
        {/* {isHr && ( */}
        {/* <div className={styles.send}>
          <header>
            <div className={styles.icon}>
              <div className={styles.bigGlow}>
                <div className={styles.smallGlow}>
                  <SendOutlined />
                </div>
              </div>
            </div>
            <h2>{formatMessage({ id: 'component.previewOffer.send' })}</h2>
          </header>

          <p>
            {formatMessage({ id: 'component.previewOffer.note1' })}
            <span>{formatMessage({ id: 'component.previewOffer.note2' })}</span>
            {formatMessage({ id: 'component.previewOffer.note3' })}
          </p>

          <p>{formatMessage({ id: 'component.previewOffer.also' })}</p>

          <div className={styles.mail}>
            <span> {formatMessage({ id: 'component.previewOffer.hrMail' })}</span>

            <Form form={mailForm} name="myForm" value={mail}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: formatMessage({ id: 'component.previewOffer.invalidMailErr' }),
                  },
                  {
                    required: true,
                    message: formatMessage({ id: 'component.previewOffer.emptyMailErr' }),
                  },
                ]}
              >
                <Input
                  required={false}
                  value={mail}
                  placeholder="address@terraminds.com"
                  onChange={(e) => setMail(e.target.value)}
                />
              </Form.Item>

              <Button type="primary" loading={loading1} onClick={() => handleSentForApproval()}>
                {formatMessage({ id: 'component.previewOffer.sendForApproval' })}
              </Button>
            </Form>
          </div>
        </div> */}
        {/* )} */}
        {/* OLD SEND FOR APPROVAL */}

        {/* HR Manager signature */}
        {isTicketManager && (
          <div className={styles.signature}>
            <header>
              <img src={BigEditVector} alt="" />
              <h2>{formatMessage({ id: 'component.previewOffer.managerSignature' })}</h2>
            </header>

            {hrManagerSignature.user ? (
              <p>
                Undersigned - {hrManagerSignature.user.employee?.generalInfo.firstName}{' '}
                {hrManagerSignature.user.employee?.generalInfo.lastName}
              </p>
            ) : (
              <p>Undersigned</p>
            )}

            {!isAcceptedOffer && (isNewOffer || isAwaitingOffer || isNeedsChanges) && (
              <Row>
                <Col span={24}>
                  <Select
                    value={optionSignatureHRManager}
                    style={{ width: '100%', marginBottom: '5px' }}
                    onChange={(e) => {
                      setOptionSignatureHRManager(e);
                    }}
                  >
                    <Option value="upload">Upload</Option>
                    <Option value="draw">Draw</Option>
                    <Option value="digital">Digital Signature</Option>
                  </Select>
                </Col>
              </Row>
            )}
            {renderSignatureHrManager()}

            {isTicketManager && (isNewOffer || isAwaitingOffer || isNeedsChanges) && (
              <div className={styles.submitContainer}>
                <Button
                  type="primary"
                  disabled={
                    !hrManagerSignature.url &&
                    !isTicketManager &&
                    optionSignatureHRManager !== 'digital'
                  }
                  onClick={handleHrManagerSignatureSubmit}
                  className={`${
                    (hrManagerSignature.url && isTicketManager) ||
                    optionSignatureHRManager === 'digital'
                      ? styles.active
                      : styles.disable
                  }`}
                >
                  Submit
                </Button>

                <span className={styles.submitMessage}>
                  {hrManagerSignatureSubmit ? 'Signature submitted' : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Candidate Signature */}
        {renderCandidateSignature() && (
          <div className={styles.signature}>
            <header>
              <img src={BigEditVector} alt="" />
              <h2>{formatMessage({ id: 'component.previewOffer.candidateSignature' })}</h2>
            </header>

            {/* <p>{formatMessage({ id: 'component.previewOffer.undersigned' })}</p> */}
            <p>
              Undersigned - {candidateFirstName} {candidateLastName} {candidateMiddleName}{' '}
            </p>

            <div className={styles.upload}>
              {candidateSignature !== null && candidateSignature.url ? (
                // Default image
                <img className={styles.signatureImg} src={candidateSignature.url} alt="" />
              ) : (
                <img className={styles.signatureImg} src={whiteImg} alt="" />
              )}
            </div>

            <div className={styles.submitContainer} />
          </div>
        )}

        {/* Send final offer */}
        {/* {isTicketManager && (
          <div style={{ marginBottom: '16px' }}>
            <SendEmail
              title="Send final offer to the candidate"
              formatMessage={formatMessage}
              handleSendEmail={handleSendFinalOffer}
              loading={loading2}
              isSentEmail={false}
              privateEmail={candidateEmailProp}
            />
          </div>
        )} */}
        {/* </>
        )} */}

        <ModalUpload
          visible={modalSignature === 'upload'}
          getResponse={(response) => {
            loadImage(response);
            const { statusCode } = response;
            if (statusCode === 200) {
              setModalSignature('');
            }
          }}
          handleCancel={() => {
            setModalSignature();
          }}
        />

        {/* <ModalUpload
          visible={uploadVisible2}
          getResponse={(response) => {
            loadImage( response);
            const { statusCode } = response;
            if (statusCode === 200) {
              setUploadVisible2(false);
            }
          }}
          handleCancel={() => {
            setUploadVisible2(false);
          }}
        /> */}
        <ModalDrawSignature
          visible={modalSignature === 'draw'}
          title="Draw your signature"
          onOk={saveDrawSignature}
          onCancel={closeModalSignature}
        />

        <ModalGenerateSignature
          visible={modalSignature === 'digital'}
          title="Digital Signature"
          onOk={saveDrawSignature}
          onCancel={closeModalSignature}
        />

        <CustomModal
          open={openModal}
          closeModal={closeModal}
          content={
            <ModalContent
              closeModal={closeModal}
              tempData={tempData}
              candidateEmail={mail}
              type="release"
            />
          }
        />

        <CustomModal
          open={openModal2}
          closeModal={closeModal2}
          content={
            <ModalContent
              closeModal={closeModal2}
              tempData={tempData}
              candidateEmail={mail}
              type="send-for-approval"
            />
          }
        />

        <CustomModal
          open={openModal5}
          closeModal={closeModal2}
          content={
            <ModalContent
              closeModal={closeModal2}
              tempData={tempData}
              candidateEmail={mail}
              type="needs-changes-for-approval"
            />
          }
        />

        <CustomModal
          open={openModal3}
          closeModal={closeModal3}
          content={
            <ModalContent
              closeModal={closeModal3}
              tempData={tempData}
              candidateEmail={mail}
              // type="reject"
              type="needs-changes"
            />
          }
        />

        <CustomModal
          open={openModal4}
          closeModal={closeModal4}
          content={
            <ModalContent
              closeModal={closeModal4}
              tempData={tempData}
              candidateEmail={mail}
              type="withdraw"
            />
          }
        />

        {/* REJECT MODAL (OLD VERSION) => UPDATE TO => NEEDS CHANGES MODAL (NEW VERSION) */}
        <RejectOfferModal
          title="Needs Changes"
          visible={rejectModalVisible}
          onClose={() => setRejectModalVisible(false)}
          onFinish={handleRejectOffer}
          loading={loading2}
        />
      </Col>
    </Row>
  );
};

// export default PreviewOffer;
export default connect(
  ({
    info: { previewOffer = {} } = {},
    loading,
    user: { currentUser = {} } = {},
    newCandidateForm: { rookieId = '', tempData = {}, data = {} } = {},
  }) => ({
    previewOffer,
    loading: loading.effects['upload/uploadFile'],
    currentUser,
    tempData,
    data,
    rookieId,
    loading1: loading.effects['newCandidateForm/sentForApprovalEffect'],
    loading2: loading.effects['newCandidateForm/approveFinalOfferEffect'],
    loading3: loading.effects['newCandidateForm/updateByHR'],
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
    loadingExtendOfferDate: loading.effects['newCandidateForm/extendOfferLetterEffect'],
    loadingWithdrawOffer: loading.effects['newCandidateForm/withdrawOfferEffect'],
  }),
)(PreviewOffer);
