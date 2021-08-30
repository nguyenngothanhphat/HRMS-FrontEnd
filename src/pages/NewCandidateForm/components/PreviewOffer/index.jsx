import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Button, Input, Form, Select, Row, Col, Popover, Radio, Space } from 'antd';
import { EditOutlined, SendOutlined } from '@ant-design/icons';
// import logo from './components/images/brand-logo.png';
import CustomModal from '@/components/CustomModal';
import { getCurrentTenant } from '@/utils/authority';
import { PROCESS_STATUS } from '@/utils/onboarding';
import ModalDrawSignature from '@/components/ModalDrawSignature/index';
import ModalGenerateSignature from '@/components/ModalGenerateSignature/index';
import TextSignature from '@/components/TextSignature';
import whiteImg from './components/images/whiteImg.png';
import CancelIcon from './components/CancelIcon';
import ModalUpload from '../../../../components/ModalUpload';
import FileContent from './components/FileContent';
import SendEmail from './components/SendEmail';
import ModalContent from './components/ModalContent';
// import { PROCESS_STATUS } from '@/utils/onboarding';
import styles from './index.less';

const { Option } = Select;
// import { PROCESS_STATUS } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
//

// const ROLE = {
//   HRMANAGER: 'HR-MANAGER',
//   HR: 'HR',
//   HRGLOBAL: 'HR-GLOBAL',
// };

const PreviewOffer = (props) => {
  const {
    dispatch,
    currentUser = {},
    tempData = {},
    data = {},
    loading1,
    loading2,
    loading3,
  } = props;

  const {
    // email: mailProp,
    hrSignature: hrSignatureProp,
    hrManagerSignature: hrManagerSignatureProp,
    offerLetter: offerLetterProp,
    staticOfferLetter: staticOfferLetterProp,
    candidateSignature: candidateSignatureProp,
  } = tempData;
  const {
    // offerLetter: offerLetterProp,
    privateEmail: candidateEmailProp = '',
    firstName: candidateFirstName = '',
    middleName: candidateMiddleName = '',
    lastName: candidateLastName = '',
    processStatus,
  } = data;

  // const inputRefs = [];

  const [hrSignature, setHrSignature] = useState(hrSignatureProp || '');

  const [hrSignatureSubmit, setHrSignatureSubmit] = useState(false);
  const [hrManagerSignature, setHrManagerSignature] = useState(hrManagerSignatureProp || '');
  const [hrManagerSignatureSubmit, setHrManagerSignatureSubmit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [candidateSignature, setCandidateSignature] = useState(candidateSignatureProp || '');

  const [mail, setMail] = useState(candidateEmailProp || '');
  const [mailForm] = Form.useForm();

  const [role, setRole] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);

  const [modalSignature, setModalSignature] = useState('');
  const [isSignatureHR, setIsSignatureHR] = useState(false);
  const [optionSignature, setOptionSignature] = useState('upload');
  const [optionSignatureHRManager, setOptionSignatureHRManager] = useState('upload');
  const [valueDigitalSignature, setValueDigitalSignature] = useState(0);
  const [arrImgBase64, setArrImgBase64] = useState([]);
  const [openDigital, setOpenDigital] = useState(false);
  const [nameSignature, setNameSignature] = useState('');
  // const trim = () => {
  //   setTrimDataURL(sigPad.getTrimmedCanvas().toDataURL('image/png'));
  // };
  const getOfferLetterProp = () => {
    if (staticOfferLetterProp && staticOfferLetterProp.url) {
      return staticOfferLetterProp.url;
    }
    if (offerLetterProp && offerLetterProp.attachment && offerLetterProp.attachment.url) {
      return offerLetterProp.attachment.url;
    }
    return '';
  };

  // eslint-disable-next-line no-unused-vars
  const [offerLetter, setOfferLetter] = useState(getOfferLetterProp());

  const resetImg = (type) => {
    if (type === 'hr') {
      // setFile('');
      setHrSignature({});
    }
    if (type === 'hrManager') {
      setHrManagerSignature({});
      // setFile2('');
    }
  };
  // const isOfferAccepted = () => {
  //   const { ACCEPTED_FINAL_OFFERS } = PROCESS_STATUS;
  //   return processStatus === ACCEPTED_FINAL_OFFERS;
  // };
  const isRenderAddSignature = (value) => {
    if (value === 'hr')
      return (
        processStatus === PROCESS_STATUS.ACCEPTED_PROVISIONAL_OFFERS ||
        processStatus === PROCESS_STATUS.PENDING
      );
    return processStatus === PROCESS_STATUS.SENT_FOR_APPROVAL;
  };
  const saveChanges = () => {
    // Save changes to redux store
    if (dispatch) {
      dispatch({
        type: 'newCandidateForm/save',
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
  const isHr = role.indexOf('HR') > -1 || role.indexOf('hr') > -1;
  const isHrManager = role.indexOf('HR-MANAGER') > -1 || role.indexOf('hr-manager') > -1;
  const renderHRManagerSignature = () => {
    return (
      isHrManager &&
      (processStatus === PROCESS_STATUS.SENT_FOR_APPROVAL ||
        processStatus === PROCESS_STATUS.ACCEPTED_FINAL_OFFERS)
    );
  };

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
        setOpenModal2(true);
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
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        setOpenModal(true);
      }
    });
  };

  const getUserRole = () => {
    const { roles } = currentUser;
    setRole(roles);
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    getUserRole();
    const { _id } = data;
    if (!dispatch || !_id) {
      return;
    }

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate: _id,
        currentStep: 7,
        tenantId: getCurrentTenant(),
      },
    });
  }, []);

  useEffect(() => {
    // Save changes to store whenever input fields change
    saveChanges();
  }, [mail, hrSignature, hrManagerSignature]);

  useEffect(() => {}, [hrSignatureProp, hrManagerSignatureProp]);

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

    dispatch({
      type: 'newCandidateForm/redirectToOnboardList',
    });
  };

  const closeModal2 = () => {
    setOpenModal2(false);

    dispatch({
      type: 'newCandidateForm/redirectToOnboardList',
    });
  };

  // const disableHrSubmitActions = () => {
  //   const { ACCEPTED_FINAL_OFFERS } = PROCESS_STATUS;
  // };

  // useEffect(() => {
  //   dispatch({
  //     type: 'newCandidateForm/saveTemp',
  //     payload: {
  //       offerLetter,
  //     },
  //   });
  // }, [offerLetterProp]);

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
          currentStep: 7,
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
          currentStep: 7,
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
            {isRenderAddSignature('hr') && (
              <button type="submit" onClick={openModalUploadSignature}>
                {formatMessage({ id: 'component.previewOffer.upload' })}
              </button>
            )}
          </>
        ) : (
          <>
            <img className={styles.signatureImg} src={hrSignature.url} alt="" />
            {isRenderAddSignature('hr') && (
              <>
                <button type="submit" onClick={openModalUploadSignature}>
                  {formatMessage({ id: 'component.previewOffer.uploadNew' })}
                </button>
                <CancelIcon resetImg={() => resetImg('hr')} />
              </>
            )}
          </>
        )}
      </div>
    );
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
          // currentStep: 6,
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
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
          // currentStep: 6,
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          setHrManagerSignatureSubmit(true);
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

        {isRenderAddSignature('hrManager') && (
          <>
            <button
              type="submit"
              onClick={() => {
                setIsSignatureHR(false);
                setModalSignature(optionSignatureHRManager);
              }}
            >
              {formatMessage({ id: 'component.previewOffer.uploadNew' })}
            </button>

            <CancelIcon resetImg={() => resetImg('hrManager')} />
          </>
        )}
      </div>
    );
  };

  // main
  return (
    <div className={styles.previewContainer}>
      <div className={styles.left}>
        <FileContent url={offerLetter} />
      </div>

      <div className={styles.right}>
        {/* HR signature */}
        <div className={styles.signature}>
          <header>
            <div className={styles.icon}>
              <div className={styles.bigGlow}>
                <div className={styles.smallGlow}>
                  <EditOutlined />
                </div>
              </div>
            </div>
            <h2>{formatMessage({ id: 'component.previewOffer.hrSignature' })}</h2>
          </header>

          {/* <p>{formatMessage({ id: 'component.previewOffer.undersigned' })}</p> */}
          {hrSignature.user ? (
            <p>
              Undersigned - {hrSignature.user.employee?.generalInfo.firstName}{' '}
              {hrSignature.user.employee?.generalInfo.lastName}
            </p>
          ) : (
            <p>Undersigned</p>
          )}
          {isRenderAddSignature('hr') && (
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
          {isRenderAddSignature('hr') && (
            <div className={styles.submitContainer}>
              <Button
                type="primary"
                onClick={handleHrSignatureSubmit}
                disabled={
                  !hrSignature.url && !isRenderAddSignature('hr') && optionSignature !== 'digital'
                }
                className={`${
                  (hrSignature.url && isRenderAddSignature('hr')) || optionSignature === 'digital'
                    ? styles.active
                    : styles.disable
                }`}
                loading={loading3}
              >
                {formatMessage({ id: 'component.previewOffer.submit' })}
              </Button>

              <span className={styles.submitMessage}>
                {hrSignatureSubmit ? formatMessage({ id: 'component.previewOffer.submitted' }) : ''}
              </span>
            </div>
          )}
        </div>

        {(isHr || isHrManager) &&
          processStatus !== PROCESS_STATUS.SENT_FINAL_OFFERS &&
          processStatus !== PROCESS_STATUS.SENT_FOR_APPROVAL &&
          processStatus !== PROCESS_STATUS.ACCEPTED_FINAL_OFFERS && (
            <div className={styles.send}>
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
            </div>
          )}

        {/* HR Manager signature */}
        {renderHRManagerSignature() && (
          <>
            <div className={styles.signature}>
              <header>
                <div className={styles.icon}>
                  <div className={styles.bigGlow}>
                    <div className={styles.smallGlow}>
                      <EditOutlined />
                    </div>
                  </div>
                </div>
                <h2>{formatMessage({ id: 'component.previewOffer.managerSignature' })}</h2>
              </header>
              {/* <p>{formatMessage({ id: 'component.previewOffer.managerUndersigned' })}</p> */}
              {hrManagerSignature.user ? (
                <p>
                  Undersigned - {hrManagerSignature.user.employee?.generalInfo.firstName}{' '}
                  {hrManagerSignature.user.employee?.generalInfo.lastName}
                </p>
              ) : (
                <p>Undersigned</p>
              )}
              {isRenderAddSignature('hrManager') && (
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
              {isRenderAddSignature('hrManager') && (
                <div className={styles.submitContainer}>
                  <Button
                    type="primary"
                    disabled={
                      !hrManagerSignature.url &&
                      !isRenderAddSignature('hrManager') &&
                      optionSignatureHRManager !== 'digital'
                    }
                    onClick={handleHrManagerSignatureSubmit}
                    className={`${
                      (hrManagerSignature.url && isRenderAddSignature('hrManager')) ||
                      optionSignatureHRManager === 'digital'
                        ? styles.active
                        : styles.disable
                    }`}
                  >
                    {formatMessage({ id: 'component.previewOffer.submit' })}
                  </Button>

                  <span className={styles.submitMessage}>
                    {hrManagerSignatureSubmit
                      ? formatMessage({ id: 'component.previewOffer.submitted' })
                      : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Candidate Signature */}
            {renderCandidateSignature() && (
              <div className={styles.signature}>
                <header>
                  <div className={styles.icon}>
                    <div className={styles.bigGlow}>
                      <div className={styles.smallGlow}>
                        <EditOutlined />
                      </div>
                    </div>
                  </div>
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
            {isRenderAddSignature('hrManager') && (
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
            )}
          </>
        )}

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
              type="hrManager"
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
              type="hr"
              // privateEmail={privateEmail}
            />
          }
        />
      </div>
    </div>
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
  }),
)(PreviewOffer);
