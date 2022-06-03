import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Row, Select, Skeleton, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage, history } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
// import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/utils/onboarding';
import AddDocumentModal from './components/AddDocumentModal';
import DocumentItem from './components/DocumentItem';
// import { Page } from '../../utils';
import Template from './components/Template/index';
import AddTemplateModal from './components/AddTemplateModal';
import styles from './index.less';

const { Option } = Select;

const OfferDetail = (props) => {
  const {
    dispatch,
    checkMandatory,
    data,
    tempData,
    loading1,
    loadingFetchCandidate = false,
    currentStep,
    documentListOnboarding: documentListProps = [],
  } = props;
  const { processStatus = '' } = tempData;
  // const previousStep = currentStep - 1;
  // const nextStep = currentStep + 1;
  // Get default value from "newCandidateForm" store
  const {
    template: templateProp,
    includeOffer: includeOfferProp,
    defaultTemplates: defaultTemplatesProp,
    customTemplates: customTemplatesProp,
    staticOfferLetter: staticOfferLetterProp,
    offerDocuments: offerDocumentsProp = [],
    offerLetterTemplate: offerLetterTemplateProp,
    expiryDate: expiryDateProp,
    ticketID = '',
    assignTo: { _id: assignToId = '' } = {},
    assigneeManager: { _id: assigneeManagerId = '' } = {},
  } = tempData;
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isAddTemplateModalVisible, setAddTemplateModalVisible] = useState(false);

  const [uploadedOfferTemplate, setUploadedOfferTemplate] = useState(offerLetterTemplateProp);

  const [defaultTemplates, setDefaultTemplates] = useState(defaultTemplatesProp || []);
  const [customTemplates, setCustomTemplates] = useState(customTemplatesProp || []);

  const [templateList, setTemplateList] = useState(
    [...defaultTemplatesProp, ...customTemplatesProp] || [],
  );
  const [form] = Form.useForm();

  // const [includeOffer, setIncludeOffer] = useState(includeOfferProp);
  const [file, setFile] = useState(templateProp || {});
  // const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(timeoff !== 'can');
  const [displayTemplate, setDisplayTemplate] = useState(includeOfferProp === 3);
  const [uploadedOffer, setUploadedOffer] = useState(staticOfferLetterProp || {});
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  // const [disableAll, setDisableAll] = useState(processStatus === 'SENT-PROVISIONAL-OFFER');
  // eslint-disable-next-line no-unused-vars
  const [disableAll, setDisableAll] = useState(false);

  const checkAllFieldsValid = (allFieldsValues) => {
    const keys = Object.keys(allFieldsValues);
    let valid = true;
    if (displayTemplate && file.id === undefined) {
      valid = false;
    }
    keys.map((key) => {
      const value = allFieldsValues[key];
      if (value === null || value === undefined || value.length === 0) {
        valid = false;
      }
      return null;
    });

    const { includeOffer = 1 } = allFieldsValues;
    // console.log(includeOffer);
    // console.log(uploadedOffer);
    if (includeOffer === 2) {
      if (!uploadedOffer.url) {
        valid = false;
      }
    }

    setAllFieldsFilled(valid);

    return valid;
  };

  useEffect(() => {
    dispatch({
      type: 'newCandidateForm/fetchDocumentListOnboarding',
      payload: {
        tenantId: getCurrentTenant(),
        module: 'ON_BOARDING',
        company: getCurrentCompany(),
      },
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (processStatus) {
      setDisableAll(
        [
          NEW_PROCESS_STATUS.AWAITING_APPROVALS,
          NEW_PROCESS_STATUS.OFFER_RELEASED,
          NEW_PROCESS_STATUS.OFFER_WITHDRAWN,
          NEW_PROCESS_STATUS.OFFER_ACCEPTED,
          NEW_PROCESS_STATUS.OFFER_REJECTED,
        ].includes(processStatus),
      );
    }
    return () => {};
  }, [processStatus]);

  useEffect(() => {
    if (offerLetterTemplateProp) {
      setUploadedOfferTemplate(offerLetterTemplateProp);
    }
    return () => {};
  }, [offerLetterTemplateProp]);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    checkAllFieldsValid({ ...formValues });
  }, [displayTemplate]);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          checkMandatory: {
            ...checkMandatory,
            filledOfferDetail: allFieldsFilled,
          },
        },
      });
    }
  }, [allFieldsFilled]);

  useEffect(() => {
    const { includeOffer = 1 } = form.getFieldsValue();
    if (includeOffer === 2) {
      if (!uploadedOffer.url) {
        setAllFieldsFilled(false);
      } else if (!allFieldsFilled) {
        setAllFieldsFilled(true);
      }
    }
  }, [uploadedOffer]);

  const handleFormChange = (changedValues, allFieldsValues) => {
    const { includeOffer } = allFieldsValues;

    checkAllFieldsValid(allFieldsValues);

    if (!dispatch) {
      return;
    }

    setDisplayTemplate(includeOffer === 3);

    const { _id = '' } = data;

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        includeOffer,
        template: file,
        candidate: _id,
        hidePreviewOffer: includeOffer === 1,
      },
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    const formValues = form.getFieldsValue();
    checkAllFieldsValid({ ...formValues });
  }, []);

  useEffect(() => {
    const allFormValues = form.getFieldsValue();
    handleFormChange(null, allFormValues);
    checkAllFieldsValid(allFormValues);
  }, [file]);

  useEffect(() => {
    setDefaultTemplates(defaultTemplatesProp);
    setTemplateList([...defaultTemplatesProp, ...customTemplatesProp]);
  }, [defaultTemplatesProp]);

  useEffect(() => {
    setCustomTemplates(customTemplatesProp);
    setTemplateList([...defaultTemplatesProp, ...customTemplatesProp]);
  }, [customTemplatesProp]);

  const handleTemplateChange = (_, option) => {
    const { value = '', key = '' } = option;
    setUploadedOfferTemplate(key);
    setFile({
      name: value,
      id: key,
    });
    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        template: value,
        offerLetterTemplate: key,
      },
    });

    const { candidate } = data;

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        includeOffer: 3,
        tenantId: getCurrentTenant(),
        offerLetterTemplate: key,
        currentStep: ONBOARDING_STEPS.OFFER_LETTER,
      },
    });
  };

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.BENEFITS}`);
  };

  const onNextTab = () => {
    const nextStep = ONBOARDING_STEPS.OFFER_LETTER;

    if (currentStep === ONBOARDING_STEPS.OFFER_DETAILS) {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          currentStep: nextStep,
        },
      });
      const { candidate } = data;
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate,
          currentStep: nextStep,
          tenantId: getCurrentTenant(),
        },
      });
    }
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_LETTER}`);
  };

  const onSubmitOfferDetails = () => {
    if (!dispatch) {
      return;
    }

    const { id: templateId = '' } = file;

    const {
      candidate = '',
      _id = '',
      firstName = '',
      middleName = '',
      lastName = '',
      position = '',
      employeeType: { name: classificationName = '' } = {},
      workLocation: { name: workLocationName = '' } = {},
      department: { name: departmentName = '' } = {},
      title: { name: jobTitle = '' } = {},
      reportingManager: {
        generalInfo: { firstName: managerFirstName = '', lastName: managerLastName = '' } = {},
      } = {},
    } = data;

    dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate: _id,
        currentStep: ONBOARDING_STEPS.OFFER_LETTER,
        includeOffer: 3,
        tenantId: getCurrentTenant(),
        expiryDate: expiryDateProp || moment().add('15', 'days'),
        // offerLetter: templateId,
      },
    });

    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        data: {
          ...data,
          candidate: _id,
          includeOffer: 3,
        },
        currentStep: ONBOARDING_STEPS.OFFER_LETTER,
      },
    });

    // Use existing offer letter

    const offerData = {
      candidateId: candidate,
      templateId: templateId || offerLetterTemplateProp,
      firstName,
      middleName,
      lastName,
      position,
      classification: classificationName,
      workLocation: workLocationName,
      department: departmentName,
      jobTitle,
      reportManager: `${managerFirstName} ${managerLastName}`,
      includeOffer: 3,
      tenantId: getCurrentTenant(),
    };

    dispatch({
      type: 'newCandidateForm/createFinalOfferEffect',
      payload: offerData,
    }).then((res) => {
      const { statusCode, data: { _id: templateID = '', attachment = {} } = {} } = res;
      if (statusCode !== 200) {
        return;
      }

      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate,
          currentStep: ONBOARDING_STEPS.OFFER_LETTER,
          offerLetter: templateID,
          tenantId: getCurrentTenant(),
          processStatus:
            assigneeManagerId === assignToId
              ? NEW_PROCESS_STATUS.AWAITING_APPROVALS
              : processStatus,
          // offerTemplate: templateId,
        },
      });

      // Enable preview offer
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          disablePreviewOffer: false,
          expiryDate: expiryDateProp || moment().add('15', 'days'),
        },
      });

      // Save offer letter
      dispatch({
        type: 'newCandidateForm/updateOfferLetter',
        payload: attachment,
      });

      onNextTab();
    });
  };

  const _renderBottomBar = () => {
    const isNewOffer = processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION;
    const handleButtonAction = isNewOffer ? onSubmitOfferDetails : onNextTab;

    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
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
                  onClick={handleButtonAction}
                  loading={loading1}
                  className={`${styles.bottomBar__button__primary} ${
                    !allFieldsFilled ? styles.bottomBar__button__disabled : ''
                  }`}
                  disabled={!allFieldsFilled}
                >
                  {currentStep === 5 || !isNewOffer ? 'Next' : 'Update'}
                </Button>
              </Space>
              {/* <RenderAddQuestion page={Page.Offer_Details} /> */}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const handleUploadResponse = (res) => {
    const { data: uploadFileData = [] } = res;
    if (uploadFileData.length === 0) {
      return;
    }
    const { id, name = '', url = '' } = uploadFileData[0];
    const offerData = {
      id,
      name,
      url,
    };
    setUploadedOffer(offerData);

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        staticOfferLetter: offerData,
        disablePreviewOffer: false,
      },
    });
  };

  const handleAddDocument = (type = 'document') => {
    if (type === 'document') setAddModalVisible(true);
    else {
      setAddTemplateModalVisible(true);
      // const win = window.open('/create-new-template', '_blank');
      // win.focus();
    }
  };

  const handleModalVisible = (value) => {
    setAddModalVisible(value);
  };

  const handleTemplateModalVisible = (value) => {
    setAddTemplateModalVisible(value);
  };

  // refresh template list
  const refreshTemplateList = async (value, key) => {
    await dispatch({
      type: 'newCandidateForm/fetchDefaultTemplateList',
      payload: {
        tenantId: getCurrentTenant(),
        type: 'ON_BOARDING',
      },
    });
    await dispatch({
      type: 'newCandidateForm/fetchCustomTemplateList',
      payload: {
        tenantId: getCurrentTenant(),
        type: 'ON_BOARDING',
      },
    });
    const option = { value, key };
    handleTemplateChange('', option);
    setUploadedOfferTemplate(key);
  };
  // DISABLE DATE OF DATE PICKER
  const disabledDate = (current) => {
    return current && current < moment();
  };

  const onAddDocument = async (payload) => {
    const { name = '', uploadedFile = {} } = payload;

    let newOfferDocumentsProp = [...offerDocumentsProp];
    const payloadNew = [
      {
        name,
        attachmentName: uploadedFile.name,
        attachmentUrl: uploadedFile.url,
        attachment: uploadedFile._id,
      },
    ];

    newOfferDocumentsProp = [...newOfferDocumentsProp, ...payloadNew];

    await dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        offerDocuments: newOfferDocumentsProp,
      },
    });

    const { candidate } = data;
    await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        offerDocuments: newOfferDocumentsProp,
        currentStep: ONBOARDING_STEPS.OFFER_LETTER,
      },
    });
    handleModalVisible(false);
  };

  const onRemove = async (attachmentId) => {
    const newOfferDocumentsProp = offerDocumentsProp.filter(
      (doc) => doc.attachment !== attachmentId && doc.attachment?._id !== attachmentId,
    );

    await dispatch({
      type: 'newCandidateForm/save',
      payload: {
        tempData: {
          ...tempData,
          offerDocuments: newOfferDocumentsProp,
        },
      },
    });

    const { candidate } = data;
    await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        offerDocuments: newOfferDocumentsProp,
        currentStep: ONBOARDING_STEPS.OFFER_LETTER,
      },
    });
  };

  const renderDocuments = () => {
    return offerDocumentsProp.map((doc) => (
      <DocumentItem disableAll={disableAll} onRemove={onRemove} item={doc} />
    ));
  };

  const handleExpiryDay = async (val) => {
    const { candidate } = data;
    await dispatch({
      type: 'newCandidateForm/save',
      payload: {
        tempData: {
          ...tempData,
          expiryDate: val,
        },
      },
    });

    await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        expiryDate: val,
        currentStep: ONBOARDING_STEPS.OFFER_LETTER,
      },
    });
  };

  if (loadingFetchCandidate) return <Skeleton />;
  return (
    <>
      <Form form={form} onValuesChange={handleFormChange}>
        <div className={styles.offerDetailContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.offerDetail}>
              <div className={styles.top}>
                <h3 className={styles.header}>
                  {formatMessage({ id: 'component.offerDetail.title' })}
                </h3>

                <p>{formatMessage({ id: 'component.offerDetail.subtitle' })}</p>
              </div>

              <div className={styles.middle}>
                <div className={styles.offerLetterBlock}>
                  <p className={styles.title}>Offer Letter</p>
                  <Row gutter={['24']}>
                    <Col span={12}>
                      <p>Use an existing offer letter</p>
                      <div className={styles.wrapper1}>
                        {/* <Form.Item name="template"> */}
                        <Select
                          defaultValue={uploadedOfferTemplate}
                          value={uploadedOfferTemplate}
                          placeholder="Select file"
                          className={styles.select}
                          onChange={(value, option) => handleTemplateChange(value, option)}
                          disabled={disableAll}
                        >
                          {templateList.map((fileItem) => {
                            const { _id = '', attachment = {} } = fileItem;
                            return (
                              <Option value={attachment?._id} key={_id}>
                                <div className={styles.iconWrapper}>
                                  <span>{attachment?.name}</span>
                                </div>
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </Col>
                    <Col span={12}>
                      {!disableAll && (
                        <>
                          <p>Add Expiry Date</p>
                          <div className={styles.wrapper1}>
                            <DatePicker
                              className={styles.inputDate}
                              format="DD.MM.YY"
                              placeholder="Select expiry date"
                              disabledDate={disabledDate}
                              defaultValue={
                                expiryDateProp ? moment(expiryDateProp) : moment().add('15', 'days')
                              }
                              onChange={(val) => handleExpiryDay(val)}
                            />
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                  {!disableAll ? (
                    <div className={styles.addButton} onClick={() => handleAddDocument('template')}>
                      <PlusOutlined className={styles.plusIcon} />
                      <span className={styles.buttonTitle}>Add Template</span>
                    </div>
                  ) : (
                    <span className={styles.expiryDate}>
                      Document Expires on {moment(expiryDateProp).locale('en').format('MM.DD.YY')}
                    </span>
                  )}
                </div>

                <div className={styles.documentBlock}>
                  <p className={styles.title}>Documents</p>
                  {!disableAll ? (
                    <p className={styles.subTitle}>
                      {offerDocumentsProp.length === 0
                        ? 'Upload all documents'
                        : 'Uploaded Documents'}
                    </p>
                  ) : (
                    <p className={styles.subTitle}>
                      {offerDocumentsProp.length === 0 ? 'No Documents' : 'Uploaded Documents'}
                    </p>
                  )}
                  {renderDocuments()}

                  {!disableAll && (
                    <div className={styles.addButton} onClick={() => handleAddDocument('document')}>
                      <PlusOutlined className={styles.plusIcon} />
                      <span className={styles.buttonTitle}>Add Document</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {_renderBottomBar()}
          </div>

          <div className={styles.rightCol}>
            <Template dispatch={dispatch} type="default" files={defaultTemplates} />
            <Template
              dispatch={dispatch}
              type="custom"
              files={customTemplates}
              handleAdd={handleAddDocument}
            />
          </div>
        </div>
      </Form>

      <AddDocumentModal
        visible={isAddModalVisible}
        handleModalVisible={handleModalVisible}
        documentList={documentListProps}
        onAdd={onAddDocument}
      />
      <AddTemplateModal
        visible={isAddTemplateModalVisible}
        handleModalVisible={handleTemplateModalVisible}
        // onAdd={onAddTemplate}
        refreshTemplateList={refreshTemplateList}
      />
    </>
  );
};

export default connect(
  ({
    newCandidateForm: { data, checkMandatory, currentStep, tempData, documentListOnboarding } = {},
    loading,
  }) => ({
    data,
    checkMandatory,
    currentStep,
    tempData,
    documentListOnboarding,
    loading1: loading.effects['newCandidateForm/createFinalOfferEffect'], // Loading for generating offer service
    loading2: loading.effects['upload/uploadFile'],
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)(OfferDetail);
