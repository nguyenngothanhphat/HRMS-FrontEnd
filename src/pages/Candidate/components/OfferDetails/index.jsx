import FileIcon from '@/assets/pdf_icon.png';
import ModalUpload from '@/components/ModalUpload';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import CancelIcon from '@/pages/FormTeamMember/components/PreviewOffer/components/CancelIcon';
import whiteImg from '@/pages/FormTeamMember/components/PreviewOffer/components/images/whiteImg.png';
import { getCurrentTenant } from '@/utils/authority';
import { Button, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import NoteComponent from '../NoteComponent';
import Alert from './components/Alert';
import s from './index.less';



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
  const { dispatch, checkCandidateMandatory, localStep, tempData, data, loading1 } = props;
  const { filledOfferDetails = false } = checkCandidateMandatory;
  const {
    candidateSignature: candidateSignatureProp = {},
    offerDocuments: offerDocumentsProp = [],
  } = data;

  const [signature, setSignature] = useState(candidateSignatureProp || {});
  const [signatureSubmit, setSignatureSubmit] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [allFieldFilled, setAllFieldFilled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
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
      type: 'candidateProfile/save',
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
        type: 'candidateProfile/save',
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

  const onClickNext = () => {
    if (!dispatch) {
      return;
    }
    const { id, url } = signature;

    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep + 1,
      },
    });

    dispatch({
      type: 'candidateProfile/save',
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
      type: 'candidateProfile/save',
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

  const handleSubmit = async () => {
    if (!dispatch) {
      return;
    }
    const { id } = signature;
    const { candidate } = data;
    const res = await dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        candidateSignature: id,
        candidate,
        tenantId: getCurrentTenant(),
      },
    });
    const { statusCode = 1 } = res;
    if (statusCode === 200) {
      setSignatureSubmit(true);
    }
  };

  const loadImage = (response) => {
    const { data: imageData = [] } = response;
    const { url = '', id = '' } = imageData[0];

    setSignature({ url, id });
  };

  const resetImg = () => {
    setSignature({ ...signature, url: '', id: '' });
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
              <p>
                The candidate may draw the signature below or can upload the signature from personal
                system.
              </p>
              <Row gutter={16} style={{ marginTop: '24px' }}>
                <Col
                  // sm={8}
                  md={14}
                >
                  <div className={s.signature}>
                    <div className={s.upload}>
                      {!signature.url ? (
                        // Default image
                        <img className={s.signatureImg} src={whiteImg} alt="" />
                      ) : (
                        <img className={s.signatureImg} src={signature.url} alt="" />
                      )}

                      <button
                        type="submit"
                        onClick={() => {
                          setUploadVisible(true);
                        }}
                      >
                        {formatMessage({ id: 'component.previewOffer.uploadNew' })}
                      </button>

                      <CancelIcon resetImg={() => resetImg()} />
                    </div>


                    <div className={s.submitContainer}>
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        className={`${signature.url ? s.active : s.disable}`}
                        disabled={!signature.url}
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
          </div>

          {renderBottomBar()}
        </Col>

        <Col md={8}>
          <NoteComponent note={Note} />
        </Col>
      </Row>

      <ViewDocumentModal visible={modalVisible} onClose={closeModal} url={fileUrl} />

      <ModalUpload
        visible={uploadVisible}
        getResponse={(response) => {
          loadImage(response);
          const { statusCode = 1 } = response;
          if (statusCode === 200) {
            setUploadVisible(false);
          }
        }}
        handleCancel={() => {
          setUploadVisible(false);
        }}
      />
    </div>
  );
};

export default connect(
  ({
    candidateProfile: {
      localStep = 4,
      checkCandidateMandatory = {},
      tempData = {},
      data = {},
    } = {},
    loading,
  }) => ({
    checkCandidateMandatory,
    localStep,
    tempData,
    data,
    loading1: loading.effects['candidateProfile/updateByCandidateEffect'],
  }),
)(OfferDetails);
