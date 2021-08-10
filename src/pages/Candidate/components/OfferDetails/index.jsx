import FileIcon from '@/assets/pdf_icon.png';
import ModalUpload from '@/components/ModalUpload';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import CancelIcon from '@/pages/FormTeamMember/components/PreviewOffer/components/CancelIcon';
import whiteImg from '@/pages/FormTeamMember/components/PreviewOffer/components/images/whiteImg.png';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { getCurrentTenant } from '@/utils/authority';
import { Button, Col, Row, Select, Typography, Input, Popover, Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import ModalDrawSignature from '@/components/ModalDrawSignature/index';
import TextSignature from '@/components/TextSignature';
import { TYPE_QUESTION, SPECIFY } from '@/components/Question/utils';
import { every } from 'lodash';
import NoteComponent from '../NoteComponent';
import Alert from './components/Alert';
import s from './index.less';
import { Page } from '../../../FormTeamMember/utils';

const { Option } = Select;

const Note = {
  title: 'Note',
  data: (
    <Typography.Text style={{ marginTop: '24px' }}>
      The candidate <span>must sign</span> the confidentiality document as part of acceptance of
      employment with Terralogic Private Limited..
    </Typography.Text>
  ),
};

const FileInfo = [
  {
    name: 'Hiring Document.pdf',
    url: 'http://api-stghrms.paxanimi.ai/api/attachments/60adcca825870e54bbd9e944/Company_handbook.pdf',
  },
  {
    name: 'Company Handbook Document.pdf',
    url: 'http://api-stghrms.paxanimi.ai/api/attachments/60adcca825870e54bbd9e944/Company_handbook.pdf',
  },
];

const OfferDetails = (props) => {
  const { dispatch, checkCandidateMandatory, localStep, tempData, data, loading1, question } =
    props;
  const { filledOfferDetails = false } = checkCandidateMandatory;
  const {
    candidateSignature: candidateSignatureProp = {},
    offerDocuments: offerDocumentsProp = [],
  } = data;

  const [signature, setSignature] = useState(candidateSignatureProp || {});
  const [signatureSubmit, setSignatureSubmit] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  // const [uploadVisible, setUploadVisible] = useState(false);
  const [allFieldFilled, setAllFieldFilled] = useState(false);
  const [nameSignature, setNameSignature] = useState('');
  const [optionSignature, setOptionSignature] = useState('upload');
  const [openModal, setOpenModal] = useState('');
  const [valueDigitalSignature, setValueDigitalSignature] = useState(0);
  const [arrImgBase64, setArrImgBase64] = useState([]);
  const [openDigital, setOpenDigital] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        pageName: Page.Offer_Details,
        // candidate: data.candidate,
        data: {},
      },
    });
  }, []);

  useEffect(() => {
    setSignature(candidateSignatureProp);
  }, [candidateSignatureProp]);

  useEffect(() => {
    if (signature.url) {
      setAllFieldFilled(true);
    }
    const { url = '', id = '' } = signature;
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
  }, [signature]);

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    if (allFieldFilled) {
      dispatch({
        type: 'candidatePortal/save',
        payload: {
          checkCandidateMandatory: {
            ...checkCandidateMandatory,
            filledOfferDetails: true,
          },
        },
      });
    }
  }, [allFieldFilled]);

  const handleClick = (url) => {
    setFileUrl(url);
    setModalVisible(true);
  };

  const _renderViewFile = ({ name, url }) => {
    return (
      <div className={s.file} onClick={() => handleClick(url)}>
        <span className={s.fileName}>{name}</span>
        <img src={FileIcon} alt="file icon" />
      </div>
    );
  };

  const _renderStatus = () => {
    return !filledOfferDetails ? (
      <div className={s.normalText}>
        <div className={s.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={s.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  const checkAllFieldsValidate = () => {
    const valid = question?.settings?.map((item) => {
      const employeeAnswers = item.employeeAnswers.filter((answer) => answer);

      if (question.isRequired) {
        if (question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key) {
          const { specify = {}, num } = item?.multiChoice || {};
          switch (specify) {
            case SPECIFY.AT_LEAST.key:
              return employeeAnswers.length >= num
                ? null
                : `This question must have at least ${num} answer`;
            case SPECIFY.AT_MOST.key:
              return employeeAnswers.length <= num
                ? null
                : `This question must have at most ${num} answer`;
            case SPECIFY.EXACTLY.key:
              return employeeAnswers.length !== num
                ? null
                : `This question must have exactly ${num} answer`;
            default:
              break;
          }
        }
        if (item.answerType === TYPE_QUESTION.MULTI_RATING_CHOICE.key) {
          const { rows = [] } = item?.rating || {};
          return employeeAnswers.length === rows.length ? null : 'You must rating all';
        }
        return employeeAnswers.length > 0 ? null : 'You must answer this question';
      }
      return null;
    });

    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        messageErrors: valid,
      },
    });
    return valid;
  };
  const onClickNext = () => {
    if (!dispatch) {
      return;
    }
    const messageErr = checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
    const { id, url } = signature;
    if (question._id !== '' && question.settings && question.settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: question._id,
          settings: question.settings,
        },
      });
    }
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: localStep + 1,
      },
    });

    dispatch({
      type: 'candidatePortal/save',
      payload: {
        data: {
          ...data,
          candidateSignature: {
            ...data.candidateSignature,
            id,
            url,
          },
        },
      },
    });
  };

  const onClickPrevious = () => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidatePortal/save',
      payload: {
        localStep: localStep - 1,
      },
    });
  };

  const renderBottomBar = () => {
    return (
      <div className={s.bottomBar}>
        <Row align="middle">
          <Col sm={4} md={16} span={16}>
            <div className={s.bottomBar__status}>{_renderStatus()}</div>
          </Col>
          <Col sm={8} md={8} span={8}>
            <div className={s.bottomBar__button}>
              <Button type="secondary" onClick={onClickPrevious}>
                Previous
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={onClickNext}
                className={`${s.bottomBar__button__primary} ${
                  !allFieldFilled ? s.bottomBar__button__disabled : ''
                }`}
                disabled={!allFieldFilled}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const loadImage = (response) => {
    const { data: imageData = [] } = response;
    const { url = '', id = '', fileName } = imageData[0];

    setSignature({ url, id, fileName });
  };

  const resetImg = () => {
    setSignature({ ...signature, url: '', id: '' });
  };

  const dataURItoBlob = (dataURI) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i += 1) {
      array.push(binary.charCodeAt(i));
    }
    // eslint-disable-next-line compat/compat
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };
  const resetDefaultState = () => {
    setValueDigitalSignature(0);
    setNameSignature('');
    setArrImgBase64([]);
    setOptionSignature('upload');
    setOpenDigital(false);
  };

  const saveDrawSignature = async (imageBase64) => {
    const formData = new FormData();
    if (!imageBase64) {
      setOpenModal('');
      return;
    }
    const file = dataURItoBlob(imageBase64);
    formData.append('blob', file, 'signatureCandidate.jpeg');
    const responsive = await dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    });
    loadImage(responsive);
    setOpenModal('');
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
  // submit signature

  const submitSignature = async () => {
    if (!dispatch) {
      return;
    }
    const { id, url, fileName } = signature;
    const { candidate } = data;
    const res = await dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        candidateSignature: id,
        candidate,
        tenantId: getCurrentTenant(),
      },
    });
    const { statusCode = 1 } = res;
    if (statusCode === 200) {
      setSignatureSubmit(true);
      dispatch({
        type: 'candidatePortal/save',
        payload: {
          data: {
            ...data,
            candidateSignature: {
              _id: id,
              url,
              fileName,
            },
          },
        },
      });
    }
  };
  const handleSubmit = async () => {
    if (!dispatch) {
      return;
    }
    if (optionSignature === 'digital') {
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
        const { url = '', id = '', fileName } = imageData[0];

        const { candidate } = data;
        const res = await dispatch({
          type: 'candidatePortal/updateByCandidateEffect',
          payload: {
            candidateSignature: id,
            candidate,
            tenantId: getCurrentTenant(),
          },
        });
        const { statusCode = 1 } = res;
        if (statusCode === 200) {
          setSignatureSubmit(true);
          dispatch({
            type: 'candidatePortal/save',
            payload: {
              data: {
                ...data,
                candidateSignature: {
                  _id: id,
                  url,
                  fileName,
                },
              },
            },
          });
        }
        resetDefaultState();
      } else submitSignature();
    }
  };
  // render signature candidate
  const renderSignature = () => {
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
                      {['Airin', 'GermanyScript', 'Bestlife', 'AudreyAndReynold'].map(
                        (item, index) => (
                          <Radio value={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextSignature
                              name={nameSignature}
                              getImage={getImg}
                              x={10}
                              y={75}
                              height={100}
                              font={`60px ${item}`}
                            />
                          </Radio>
                          // </Col>
                        ),
                      )}
                    </Space>
                  </Radio.Group>
                }
                placement="right"
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
      <div className={s.upload}>
        {!signature.url ? (
          // Default image
          <img className={s.signatureImg} src={whiteImg} alt="" />
        ) : (
          <img className={s.signatureImg} src={signature.url} alt="" />
        )}

        <button type="submit" onClick={() => setOpenModal(optionSignature)}>
          {formatMessage({ id: 'component.previewOffer.uploadNew' })}
        </button>

        <CancelIcon resetImg={() => resetImg()} />
      </div>
    );
  };
  return (
    <div className={s.offerDetailsContainer}>
      <Row gutter={24}>
        <Col md={16}>
          <div className={s.offerDetails}>
            <div className={s.header}>
              <h3>Offer Details</h3>
              <p>
                All documents supporting candidate’s employment eligibility will be displayed here
              </p>
            </div>

            <div className={s.agreement}>
              <h3>Hiring agreements</h3>
              <h4>Confidentiality Agreement</h4>
              <p>
                The candidate must read all the content of this confidentiality agreement and sign
                to acknowledge that all terms and conditions have been properly read and understood.{' '}
              </p>

              <h4>Attached documents</h4>

              {offerDocumentsProp.map((doc) => {
                const doc1 = { name: doc.name, url: doc.attachment?.url };
                return _renderViewFile(doc1);
              })}

              <h4>Signature of the candidate</h4>
              <p>Choose your options for Signature</p>
              <Row>
                <Col span={12}>
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
              <Row gutter={16} style={{ marginTop: '24px' }}>
                <Col
                  // sm={8}
                  md={12}
                >
                  <div className={s.signature}>
                    {renderSignature()}
                    <div className={s.submitContainer}>
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        className={`${
                          signature.url || optionSignature === 'digital' ? s.active : s.disable
                        }`}
                        disabled={!signature.url && optionSignature !== 'digital'}
                        loading={loading1}
                      >
                        {formatMessage({ id: 'component.previewOffer.submit' })}
                      </Button>

                      <span className={s.submitMessage}>
                        {signatureSubmit
                          ? formatMessage({ id: 'component.previewOffer.submitted' })
                          : ''}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col
                  // sm={4}
                  md={10}
                  className={s.alert}
                >
                  {signatureSubmit && (
                    <Alert display type="info">
                      <p>The signature has been submitted.</p>
                    </Alert>
                  )}
                </Col>
              </Row>
            </div>

            <div className={s.handbook}>
              <h3>Company handbook</h3>
              <p>
                The company handbook defines all of Terralogics’s policies, years of achievement,
                its vision and mission. You will find about the culture of Terralogic and what keeps
                our employees motivated.
              </p>
              {_renderViewFile(FileInfo[1])}
            </div>
            <AnswerQuestion />
          </div>

          {renderBottomBar()}
        </Col>

        <Col md={8}>
          <NoteComponent note={Note} />
        </Col>
      </Row>

      <ViewDocumentModal visible={modalVisible} onClose={closeModal} url={fileUrl} />

      <ModalUpload
        visible={openModal === 'upload'}
        getResponse={(response) => {
          loadImage(response);
          const { statusCode = 1 } = response;
          if (statusCode === 200) {
            setOpenModal('');
          }
        }}
        handleCancel={() => setOpenModal('')}
      />
      <ModalDrawSignature
        visible={openModal === 'draw'}
        title="Draw your signature"
        onOk={saveDrawSignature}
        onCancel={() => setOpenModal('')}
      />
    </div>
  );
};

export default connect(
  ({
    optionalQuestion: { data: question },
    candidatePortal: {
      localStep = 4,
      checkCandidateMandatory = {},
      tempData = {},
      data = {},
    } = {},
    loading,
  }) => ({
    question,
    checkCandidateMandatory,
    localStep,
    tempData,
    data,
    loading1: loading.effects['candidatePortal/updateByCandidateEffect'],
  }),
)(OfferDetails);
