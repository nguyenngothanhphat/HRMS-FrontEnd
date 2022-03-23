import { Button, Col, Menu, Row, Skeleton, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import PdfIcon from '@/assets/policiesRegulations/pdf-2.svg';
import UnreadIcon from '@/assets/policiesRegulations/view.svg';
import ReadIcon from '@/assets/policiesRegulations/greenFile.svg';
import QuestionIcon from '@/assets/policiesRegulations/questionIcon.svg';
import ModalImage from '@/assets/projectManagement/modalImage1.png';
import SignatureModal from '@/components/SignatureModal';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import ActionModal from './components/ActionModal';
import styles from './index.less';
import FileContent from './components/FileContent';
import NoteComponent from './components/NoteComponent';
import TickMarkIcon from '@/assets/tickMarkIcon.svg';

const PoliciesCertification = (props) => {
  const {
    dispatch,
    permissions = {},
    listCategory = [],
    loadingGetList = false,
    loadingSignaturePolicies = false,
    currentUser: {
      employee = {},
      location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
    } = {},
  } = props;

  const [data, setData] = useState([]);
  const [activeCategoryID, setActiveCategoryID] = useState('');
  const [showingFiles, setShowingFiles] = useState([]);
  const [isCertify, setIsCertify] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isViewDocument, setIsViewDocument] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [isSignature, setIsSignature] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // complete index

  const currentIndex = data.findIndex((x) => x._id === activeCategoryID);

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  const getReadArr = (list, isFirstTurn) => {
    const result = list.map((category) => {
      return {
        ...category,
        isDone: category.policyregulations?.length
          ? category.policyregulations.every((file) => {
              if (file.certify) {
                return file.certify?.find((x) => x.employeeId === employee._id)?.isRead;
              }
              return false;
            })
          : true,
      };
    });
    // move signature to bottom
    result.push(
      result.splice(
        result.findIndex((x) => x.name === 'Digital Signature'),
        1,
      )[0],
    );

    if (isFirstTurn) {
      const activeIndexTemp = result.findIndex((x) => !x.isDone);
      setActiveIndex(activeIndexTemp === -1 ? 0 : activeIndexTemp);

      if (result.length > 0) {
        setActiveCategoryID(activeIndexTemp !== -1 ? result[activeIndexTemp]._id : result[0]._id);
      }
    }
    setData(result);
  };

  const refreshDataAfterReadFile = (fileId) => {
    const tempData = data.map((category) => {
      if (category._id === activeCategoryID) {
        return {
          ...category,
          policyregulations: category.policyregulations.map((file) => {
            if (file._id === fileId) {
              const { certify = [] } = file;
              return {
                ...file,
                certify: [
                  ...certify,
                  {
                    employeeId: employee._id,
                    isRead: true,
                  },
                ],
              };
            }
            return file;
          }),
        };
      }
      return category;
    });

    getReadArr(tempData);
  };

  const onRead = async (fileId) => {
    const res = await dispatch({
      type: 'policiesRegulations/certifyDocumentEffect',
      payload: {
        employeeId: employee?._id,
        isRead: true,
        id: fileId,
      },
    });
    if (res.statusCode === 200) {
      refreshDataAfterReadFile(fileId);
    }
  };

  useEffect(() => {
    const viewAllCountry = permissions.viewPolicyAllCountry !== -1;
    dispatch({
      type: 'policiesRegulations/getCountryListByCompany',
      payload: {
        tenantIds: [getCurrentTenant()],
        company: getCurrentCompany(),
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        const { data: dataTemp = [] } = res;
        let countryArr = [];
        if (viewAllCountry) {
          countryArr = dataTemp.map((item) => {
            return item.headQuarterAddress.country;
          });
          const newArr = removeDuplicate(countryArr, (item) => item._id);
          countryArr = newArr.map((val) => val._id);
          if (countryArr.length > 0) {
            dispatch({
              type: 'policiesRegulations/save',
              payload: {
                countryList: countryArr,
              },
            });
          }
          dispatch({
            type: 'policiesRegulations/fetchListCategory',
            payload: {
              country: countryArr,
            },
          });
        } else {
          dispatch({
            type: 'policiesRegulations/fetchListCategory',
            payload: {
              country: [countryID],
            },
          });
        }
      }
    });
  }, []);

  // first init
  useEffect(() => {
    if (listCategory.length > 0) {
      getReadArr(listCategory, true);
    }
  }, [JSON.stringify(listCategory)]);

  // on change category
  useEffect(() => {
    // if the last tab => signature
    const currentIndexTemp = data.findIndex((x) => x._id === activeCategoryID);
    if (currentIndexTemp !== -1 && currentIndexTemp + 1 === data.length) {
      setIsSignature(true);
    } else {
      setIsSignature(false);
    }

    // complete index
    if (currentIndexTemp >= activeIndex) {
      setActiveIndex(currentIndexTemp);
    }
  }, [activeCategoryID]);

  // refresh showing files after refreshing data
  useEffect(() => {
    if (activeCategoryID) {
      const { policyregulations = [] } = data.find((x) => x._id === activeCategoryID) || {};
      setShowingFiles(policyregulations);
    }
  }, [JSON.stringify(data), activeCategoryID]);

  const handleViewDocument = (file = {}) => {
    setIsViewDocument(true);
    setViewingFile(file);

    let isRead = false;
    if (file?.certify) {
      isRead = file.certify.find((x) => x.employeeId === employee._id)?.isRead;
    }
    if (!isRead) {
      onRead(file?._id);
    }
  };

  const handleChange = (key) => {
    setActiveCategoryID(key);
  };

  const renderFiles = () => {
    return showingFiles.map((val = {}) => {
      const { certify = [] } = val;
      const { isRead = false } = certify.find((x) => x.employeeId === employee._id) || {};

      return (
        <div key={val.attachment._id} className={styles.file}>
          <div className={styles.file__name}>
            <img src={PdfIcon} alt="pdf" />
            <span className={styles.file__name__text}>{val.attachment.name}</span>
          </div>
          <Button
            className={styles.file__viewBtn}
            icon={<img src={isRead ? ReadIcon : UnreadIcon} alt="view" />}
            onClick={() => handleViewDocument(val)}
          >
            <span
              className={styles.file__viewBtn__text}
              style={{
                color: isRead ? '#00C598' : '#ffa100',
              }}
            >
              {isRead ? 'Read' : 'View'}
            </span>
          </Button>
        </div>
      );
    });
  };

  const renderFinalStep = () => {
    return (
      <div className={styles.signatureBar}>
        <Row align="middle">
          <Col span={12}>
            <span className={styles.describeText}>
              Sign this document to certify that you have read all the policy documents.
            </span>
          </Col>
          <Col span={12}>
            <div className={styles.signatureBar__button}>
              <Button
                type="primary"
                className={styles.signatureBar__button__primary}
                onClick={() => setIsCertify(true)}
              >
                Certify digitally
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const onNext = () => {
    if (currentIndex !== -1 && currentIndex + 1 < data.length) {
      setActiveCategoryID(data[currentIndex + 1]._id);
    }
  };

  const renderBottomBar = () => {
    const find = data.find((x) => x._id === activeCategoryID);
    return (
      <div className={styles.signatureBar}>
        <Row align="middle">
          {/* <Col span={12}>
            <span className={styles.describeText}>
              Sign this document to certify that you have read all the policy documents.
            </span>
          </Col> */}
          <Col span={24}>
            <div className={styles.signatureBar__button}>
              <Button
                type="primary"
                className={styles.signatureBar__button__primary}
                onClick={onNext}
                disabled={!find?.isDone}
                style={{
                  opacity: !find?.isDone ? 0.5 : 1,
                }}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderContent = () => {
    const SignatureNote = {
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

    const Note = {
      title: 'Instructions',
      icon: QuestionIcon,
      data: (
        <Typography.Text>
          Our support team is waiting to help you 24/7. Get an emailed response from our team.
          <br />
          <div className={styles.btnContact}>
            <Button>Contact Us</Button>
          </div>
        </Typography.Text>
      ),
    };

    if (isSignature) {
      return (
        <>
          <Col sm={24} md={17} lg={19}>
            <div className={styles.signatureContainer}>
              <div className={styles.titleHeader}>
                <span className={styles.title}>Digitally Signature</span>
              </div>
              <Row gutter={24}>
                <Col sm={24} lg={14} xl={16}>
                  <div>
                    <div className={styles.viewFileContainer}>
                      <FileContent url={showingFiles[showingFiles.length - 1]?.attachment?.url} />
                    </div>
                    {renderFinalStep()}
                  </div>
                </Col>
                <Col sm={24} lg={10} xl={8}>
                  <NoteComponent note={SignatureNote} />
                </Col>
              </Row>
            </div>
          </Col>
        </>
      );
    }

    return (
      <>
        <Col sm={24} md={17} lg={19}>
          <div className={styles.signatureContainer}>
            <Row gutter={24}>
              <Col sm={24} lg={14} xl={16}>
                <div>
                  {renderFiles()}
                  {renderBottomBar()}
                  <ViewDocumentModal
                    visible={isViewDocument}
                    onClose={() => setIsViewDocument(false)}
                    url={viewingFile?.attachment?.url}
                  />
                </div>
              </Col>
              <Col sm={24} lg={10} xl={8}>
                <NoteComponent note={Note} />
              </Col>
            </Row>
          </div>
        </Col>
      </>
    );
  };

  const onFinish = async (attachmentID) => {
    const res = await dispatch({
      type: 'policiesRegulations/signaturePoliciesEffect',
      payload: {
        attachment: attachmentID,
        employee: employee._id,
      },
    });
    if (res.statusCode === 200) {
      setIsCertify(false);
      setIsDone(true);
    }
  };

  if (loadingGetList || !activeCategoryID)
    return (
      <div className={styles.PoliciesCertification} style={{ padding: 24 }}>
        <Skeleton />
      </div>
    );
  return (
    <div className={styles.PoliciesCertification}>
      <Row>
        <Col sm={24} md={7} lg={5} className={styles.viewLeft}>
          <div className={`${data.length > 0 ? styles.viewLeft__menu : ''}`}>
            <Menu selectedKeys={[activeCategoryID]} onClick={(e) => handleChange(e.key)}>
              {data.map((val, i) => {
                const { name, _id } = val;
                return (
                  <Menu.Item
                    key={_id}
                    disabled={(!val.isDone && activeIndex < i) || i > activeIndex}
                  >
                    <div className={styles.labelContainer}>
                      <span>{name}</span>
                      {val.isDone && i < activeIndex && (
                        <img src={TickMarkIcon} alt="iconCheck" className={styles.iconCheck} />
                      )}
                    </div>
                  </Menu.Item>
                );
              })}
            </Menu>
            <div className={styles.viewLeft__menu__btnPreviewOffer} />
          </div>
        </Col>

        {renderContent()}
      </Row>
      <SignatureModal
        visible={isCertify}
        onClose={() => setIsCertify(false)}
        onFinish={onFinish}
        titleModal="Signature of the employee"
        loading={loadingSignaturePolicies}
        activeMode="digital-signature"
      />

      <ActionModal
        visible={isDone}
        onClose={() => {
          // setIsDone(false);
          history.push('/home');
        }}
        noFooter
        width={400}
      >
        <img src={ModalImage} alt="" />
        <span style={{ fontWeight: 'bold' }}>Thank you!</span>
        <span
          style={{
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '18px',
            textAlign: 'center',
            color: '#707177',
            display: 'block',
            marginBlock: 24,
          }}
        >
          Acknowledgement has been sent to your mail and HR as well.
        </span>
      </ActionModal>
    </div>
  );
};

export default connect(
  ({
    loading,
    policiesRegulations: { listCategory = [] } = {},
    user: { permissions = {}, currentUser = {} },
  }) => ({
    loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
    loadingSignaturePolicies: loading.effects['policiesRegulations/signaturePoliciesEffect'],
    listCategory,
    currentUser,
    permissions,
  }),
)(PoliciesCertification);
