import React, { useState, useEffect } from 'react';

import { formatMessage, connect } from 'umi';
import FileIcon from '@/assets/pdf_icon.png';
import { Row, Col, Typography, Button } from 'antd';
import CustomModal from '@/components/CustomModal/index';
import CancelIcon from '@/pages/FormTeamMember/components/PreviewOffer/components/CancelIcon';
import whiteImg from '@/pages/FormTeamMember/components/PreviewOffer/components/images/whiteImg.png';
import ModalUpload from '@/components/ModalUpload';
import FileContent from '../FileContent';
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
    name: 'Y2 Confidentiality document _ 11211231.pdf',
    url:
      'http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff',
  },
  {
    name: 'Company handbook document _ 11211.pdf',
    url:
      'http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff',
  },
];

const OfferDetails = (props) => {
  const { dispatch, checkCandidateMandatory, localStep, tempData, data } = props;
  const { filledOfferDetails = false } = checkCandidateMandatory;
  const { candidateSignature = {}, finalOfferCandidateSignature = {} } = tempData;

  const [signature, setSignature] = useState(candidateSignature || {});
  const [fileUrl, setFileUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [allFieldFilled, setAllFieldFilled] = useState(false);

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

  // console.log(props);

  const handleClick = (url) => {
    setFileUrl(url);
    setModalVisible(true);
  };

  const _renderFile = (url) => {
    return <FileContent url={url} />;
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
          <Col span={16}>
            <div className={s.bottomBar__status}>{_renderStatus()}</div>
          </Col>
          <Col span={8}>
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

  const handleSubmit = () => {
    if (!dispatch) {
      return;
    }
    const { id } = signature;
    const { candidate } = data;
    dispatch({
      type: 'candidateProfile/updateByCandidateEffect',
      payload: {
        candidateSignature: id,
        candidate,
      },
    });
  };

  const loadImage = (response) => {
    const { data: imageData = [] } = response;
    const { url = '', id = '' } = imageData[0];

    setSignature({ url, id });
  };

  const resetImg = () => {
    setSignature({ url: '', id: '' });
  };

  console.log(props);

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

              {_renderViewFile(FileInfo[0])}
              <h4>Signature of the candidate</h4>
              <p>
                The candidate may draw the signature below or can upload the signature from personal
                system.
              </p>
              <Row gutter={16} style={{ marginTop: '24px' }}>
                <Col md={14}>
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

                      <CancelIcon resetImg={() => resetImg('hr')} />
                    </div>

                    <div className={s.submitContainer}>
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        className={`${signature ? s.active : s.disable}`}
                      >
                        {formatMessage({ id: 'component.previewOffer.submit' })}
                      </Button>

                      <span className={s.submitMessage}>
                        {signature.url
                          ? formatMessage({ id: 'component.previewOffer.submitted' })
                          : ''}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={10}>
                  {signature.url && (
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

      <CustomModal
        width={700}
        open={modalVisible}
        closeModal={closeModal}
        content={_renderFile(fileUrl)}
      />

      <ModalUpload
        visible={uploadVisible}
        getResponse={(response) => {
          loadImage(response);
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
  }) => ({
    checkCandidateMandatory,
    localStep,
    tempData,
    data,
  }),
)(OfferDetails);
