import { getCurrentTenant } from '@/utils/authority';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import { PROCESS_STATUS } from '@/utils/onboarding';
import AddDocumentModal from './components/AddDocumentModal';
import DocumentItem from './components/DocumentItem';
import Template from './components/Template/index';
import styles from './index.less';

const { Option } = Select;

const OfferDetail = (props) => {
  const { dispatch, checkMandatory, currentStep, data, tempData, loading1, loading2 } = props;
  const { processStatus = '' } = tempData;
  const previousStep = currentStep - 1;
  const nextStep = currentStep + 1;
  // Get default value from "candidateInfo" store
  const {
    template: templateProp,
    includeOffer: includeOfferProp,
    defaultTemplates: defaultTemplatesProp,
    customTemplates: customTemplatesProp,
    staticOfferLetter: staticOfferLetterProp,
    offerDocuments: offerDocumentsProp = [],
    offerLetterTemplate: offerLetterTemplateProp,
    expiryDate: expiryDateProp,
  } = tempData;
  const [isAddModalVisible, setAddModalVisible] = useState(false);

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
  const [disableAll, setDisableAll] = useState(
    [
      PROCESS_STATUS.APPROVED_OFFERS,
      PROCESS_STATUS.SENT_FINAL_OFFERS,
      PROCESS_STATUS.ACCEPTED_FINAL_OFFERS,
      PROCESS_STATUS.RENEGOTIATE_FINAL_OFFERS,
      PROCESS_STATUS.FINAL_OFFERS,
      PROCESS_STATUS.FINAL_OFFERS_HR,
      PROCESS_STATUS.FINAL_OFFERS_CANDIDATE,
    ].includes(processStatus),
  );

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
    const formValues = form.getFieldsValue();
    checkAllFieldsValid({ ...formValues });
  }, [displayTemplate]);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'candidateInfo/save',
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
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
          includeOffer,
          template: file,
          candidate: _id,
          hidePreviewOffer: includeOffer === 1,
        },
      },
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page

    const formValues = form.getFieldsValue();
    checkAllFieldsValid({ ...formValues });
  }, []);

  useEffect(() => {
    const { processStatus = '' } = data;
    if (processStatus !== 'DRAFT') {
      return;
    }
    const { candidate } = data;
    if (!dispatch || !candidate) {
      return;
    }
    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate,
        currentStep,
        tenantId: getCurrentTenant(),
      },
    });
  }, [data.candidate]);

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

    setFile({
      name: value,
      id: key,
    });
    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        template: value,
        offerLetterTemplate: key,
      },
    });

    const { candidate } = data;

    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate,
        includeOffer: 3,
        tenantId: getCurrentTenant(),
        offerLetterTemplate: key,
      },
    });
  };

  const onClickPrev = () => {
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: previousStep,
      },
    });
  };

  const onClickNext = () => {
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
        generalInfo: { firstName: managerFirstName = '', lastName: managerLastnName = '' } = {},
      } = {},
    } = data;

    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate: _id,
        currentStep: nextStep,
        includeOffer: 3,
        tenantId: getCurrentTenant(),

        // offerLetter: templateId,
      },
    });

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        data: {
          ...data,
          candidate: _id,
          includeOffer: 3,
        },
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
      reportManager: `${managerFirstName} ${managerLastnName}`,
      includeOffer: 3,
      tenantId: getCurrentTenant(),
    };

    dispatch({
      type: 'candidateInfo/createFinalOfferEffect',
      payload: offerData,
    }).then((res) => {
      const { statusCode, data: { _id: templateID = '', attachment = {} } = {} } = res;
      if (statusCode !== 200) {
        return;
      }

      dispatch({
        type: 'candidateInfo/updateByHR',
        payload: {
          candidate,
          currentStep: nextStep,
          offerLetter: templateID,
          tenantId: getCurrentTenant(),

          // offerTemplate: templateId,
        },
      });

      // Save next step
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          currentStep: nextStep,
        },
      });

      // Enable preview offer
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          disablePreviewOffer: false,
        },
      });

      // Save offer letter
      dispatch({
        type: 'candidateInfo/updateOfferLetter',
        payload: attachment,
      });
    });
  };

  const _renderStatus = () => {
    return !allFieldsFilled ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  const _renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={12}>
            <div className={styles.bottomBar__status}>{_renderStatus()}</div>
          </Col>
          <Col span={12}>
            <div className={styles.bottomBar__button}>
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
                loading={loading1}
                className={`${styles.bottomBar__button__primary} ${
                  !allFieldsFilled ? styles.bottomBar__button__disabled : ''
                }`}
                disabled={!allFieldsFilled}
              >
                Proceed
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

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
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
          staticOfferLetter: offerData,
          disablePreviewOffer: false,
        },
      },
    });
  };

  const handleAddDocument = (type = 'document') => {
    if (type === 'document') setAddModalVisible(true);
    else {
      const win = window.open('/create-new-template', '_blank');
      win.focus();
    }
  };

  const handleModalVisible = (value) => {
    setAddModalVisible(value);
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
        attachment: uploadedFile.id,
      },
    ];

    newOfferDocumentsProp = [...newOfferDocumentsProp, ...payloadNew];

    await dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
          offerDocuments: newOfferDocumentsProp,
        },
      },
    });

    const { candidate } = data;
    await dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        offerDocuments: newOfferDocumentsProp,
      },
    });
    handleModalVisible(false);
  };

  const onRemove = async (attachmentId) => {
    const newOfferDocumentsProp = offerDocumentsProp.filter(
      (doc) => doc.attachment !== attachmentId && doc.attachment?._id !== attachmentId,
    );

    await dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
          offerDocuments: newOfferDocumentsProp,
        },
      },
    });

    const { candidate } = data;
    await dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        offerDocuments: newOfferDocumentsProp,
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
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
          expiryDate: val,
        },
      },
    });

    await dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        candidate,
        tenantId: getCurrentTenant(),
        expiryDate: val,
      },
    });
  };

  return (
    <>
      <Form form={form} onValuesChange={handleFormChange}>
        <div className={styles.offerDetailContainer}>
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
                        defaultValue={offerLetterTemplateProp}
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
                <p className={styles.subTitle}>
                  {offerDocumentsProp.length === 0 ? 'Upload all documents' : 'Uploaded Documents'}
                </p>

                {renderDocuments()}

                {!disableAll && (
                  <div className={styles.addButton} onClick={() => handleAddDocument('document')}>
                    <PlusOutlined className={styles.plusIcon} />
                    <span className={styles.buttonTitle}>Add Document</span>
                  </div>
                )}
              </div>
            </div>
            {_renderBottomBar()}
          </div>

          <div className={styles.rightCol}>
            {/* <Template type="default" files={['Offer letter 1', 'Offer letter 2', 'Offer letter 3']} /> */}
            {/* <Template files={['Offer letter 4', 'Offer letter 5', 'Offer letter 6']} /> */}
            <Template dispatch={dispatch} type="default" files={defaultTemplates} />
            <Template dispatch={dispatch} files={customTemplates} />
          </div>
        </div>
      </Form>

      <AddDocumentModal
        visible={isAddModalVisible}
        handleModalVisible={handleModalVisible}
        defaultTemplates={defaultTemplatesProp}
        customTemplates={customTemplatesProp}
        onAdd={onAddDocument}
      />
    </>
  );
};

export default connect(
  ({ candidateInfo: { data, checkMandatory, currentStep, tempData } = {}, loading }) => ({
    data,
    checkMandatory,
    currentStep,
    tempData,
    loading1: loading.effects['candidateInfo/createFinalOfferEffect'], // Loading for generating offer service
    loading2: loading.effects['upload/uploadFile'],
  }),
)(OfferDetail);
