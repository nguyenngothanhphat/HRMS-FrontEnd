/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import { Radio, Select, Checkbox, Form, Row, Col, Button } from 'antd';

import { connect, formatMessage } from 'umi';
import { currencyArr, timeoffArr } from './mockData';

import styles from './index.less';

import FileIcon from './components/FileIcon/index';
import Template from './components/Template/index';
import Alert from './components/Alert/index';
import { getFileType } from './components/utils';

const { Option } = Select;

const OfferDetail = (props) => {
  const { dispatch, checkMandatory, currentStep, data, tempData, loading1 } = props;
  const previousStep = currentStep - 1;
  const nextStep = currentStep + 1;
  // Get default value from "candidateInfo" store
  const {
    compensationType: compensationProp,
    amountIn: currencyProp,
    timeOffPolicy: timeoffProp,
    hiringAgreements: agreementProp,
    companyHandbook: handbookProp,
    template: templateProp,
    includeOffer: includeOfferProp,
    defaultTemplates: defaultTemplatesProp,
    customTemplates: customTemplatesProp,
  } = tempData;

  const [defaultTemplates, setDefaultTemplates] = useState(defaultTemplatesProp || []);
  const [customTemplates, setCustomTemplates] = useState(customTemplatesProp || []);
  const [templateList, setTemplateList] = useState(
    [...defaultTemplatesProp, ...customTemplatesProp] || [],
  );
  const [form] = Form.useForm();

  // const [includeOffer, setIncludeOffer] = useState(includeOfferProp);
  const [file, setFile] = useState(templateProp || {});
  const [agreement, setAgreement] = useState(agreementProp);
  const [handbook, setHandbook] = useState(handbookProp);
  // const [compensation, setCompensation] = useState(compensationProp);
  // const [currency, setCurrency] = useState(currencyProp);
  // const [timeoff, setTimeoff] = useState(timeoffProp);
  // const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(timeoff !== 'can');
  const [displayTemplate, setDisplayTemplate] = useState(includeOfferProp);
  const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(false);
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

    setAllFieldsFilled(valid);

    return valid;
  };

  useEffect(() => {
    const formValues = form.getFieldsValue();
    checkAllFieldsValid({ ...formValues, agreement, handbook });
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

  const handleFormChange = (changedValues, allFieldsValues) => {
    const { includeOffer, compensation, currency, timeoff } = allFieldsValues;

    if (timeoff === 'can not') {
      setDisplayTimeoffAlert(true);
    } else {
      setDisplayTimeoffAlert(false);
    }

    checkAllFieldsValid(allFieldsValues);

    if (!dispatch) {
      return;
    }

    setDisplayTemplate(includeOffer);

    const { _id = '' } = data;

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
          includeOffer,
          compensationType: compensation,
          amountIn: currency,
          timeOffPolicy: timeoff,
          hiringAgreements: agreement,
          companyHandbook: handbook,
          template: file,
          candidate: _id,
        },
      },
    });
  };

  console.log(props);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    checkAllFieldsValid({ ...formValues, agreement, handbook });
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
      },
    });
  }, [data.candidate]);

  useEffect(() => {
    const allFormValues = form.getFieldsValue();
    handleFormChange(null, allFormValues);
    checkAllFieldsValid(allFormValues);
  }, [file, agreement, handbook]);

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
      },
    });
  };

  const handleAgreementChange = () => {
    setAgreement((prevState) => !prevState);
  };

  const handleHandbookChange = () => {
    setHandbook((prevState) => !prevState);
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
      fullName = '',
      position = '',
      employeeType: { name: classificationName = '' } = {},
      workLocation: { name: workLocationName = '' } = {},
      department: { name: departmentName = '' } = {},
      title: { name: jobTitle = '' } = {},
      reportingManager: { generalInfo: { firstName = '', lastName = '' } = {} } = {},
    } = data;
    const formValues = form.getFieldsValue();
    const { compensation, currency, timeoff } = formValues;

    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        compensationType: compensation,
        amountIn: currency,
        timeOffPolicy: timeoff,
        hiringAgreements: agreement,
        companyHandbook: handbook,
        candidate: _id,
        currentStep: nextStep,
        // offerLetter: templateId,
      },
    });

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        data: {
          ...data,
          compensationType: compensation,
          amountIn: currency,
          timeOffPolicy: timeoff,
          hiringAgreements: agreement,
          companyHandbook: handbook,
          candidate: _id,
        },
      },
    });

    const offerData = {
      candidateId: candidate,
      templateId,
      fullname: fullName,
      position,
      classification: classificationName,
      workLocation: workLocationName,
      department: departmentName,
      jobTitle,
      reportManager: `${firstName} ${lastName}`,
    };

    if (dispatch) {
      dispatch({
        type: 'candidateInfo/createFinalOfferEffect',
        payload: offerData,
      }).then((res) => {
        const { statusCode, data: { _id: templateID = '' } = {} } = res;
        if (statusCode !== 200) {
          return;
        }

        dispatch({
          type: 'candidateInfo/updateByHR',
          payload: {
            candidate,
            currentStep: nextStep,
            offerLetter: templateID,
            // offerTemplate: templateId,
          },
        });

        dispatch({
          type: 'candidateInfo/save',
          payload: {
            currentStep: nextStep,
          },
        });
      });
    }
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
          <Col span={16}>
            <div className={styles.bottomBar__status}>{_renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              <Row gutter={12}>
                <Col span={12}>
                  <Button
                    type="secondary"
                    onClick={onClickPrev}
                    className={styles.bottomBar__button__secondary}
                  >
                    Previous
                  </Button>
                </Col>
                <Col span={12}>
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
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Form
      form={form}
      initialValues={{
        includeOffer: includeOfferProp,
        agreement: agreementProp,
        compensation: compensationProp,
        handbook: handbookProp,
        currency: currencyProp,
        timeoff: timeoffProp,
        // template: templateProp,
      }}
      onValuesChange={handleFormChange}
    >
      <div className={styles.offerDetailContainer}>
        <div className={styles.offerDetail}>
          <div className={styles.top}>
            <h3 className={styles.header}>
              {formatMessage({ id: 'component.offerDetail.title' })}
            </h3>

            <p>{formatMessage({ id: 'component.offerDetail.subtitle' })}</p>
          </div>

          <div className={styles.middle}>
            <p>{formatMessage({ id: 'component.offerDetail.offerLetter' })}</p>

            <Form.Item name="includeOffer">
              <Radio.Group className={styles.radioGroup} disabled={disableAll}>
                <Radio value={false}>
                  {formatMessage({ id: 'component.offerDetail.notInclude' })}
                </Radio>
                <Radio value>{formatMessage({ id: 'component.offerDetail.include' })}</Radio>
              </Radio.Group>
            </Form.Item>

            {displayTemplate && (
              <div className={styles.wrapper1}>
                {/* <Form.Item name="template"> */}
                <Select
                  value={
                    <>
                      <FileIcon type={getFileType(file.name)} />
                      {file.name}
                    </>
                  }
                  className={styles.select}
                  onChange={(value, option) => handleTemplateChange(value, option)}
                  // onSelect={(option) => console.log(option)}
                  disabled={disableAll}
                >
                  {templateList.map((fileItem) => {
                    const { _id = '123', attachment: { name = '' } = {} } = fileItem;
                    return (
                      <Option value={name} key={_id}>
                        <div className={styles.iconWrapper}>
                          <span>{name}</span>
                        </div>
                      </Option>
                    );
                  })}
                  {/* {fileArr.map((file, index) => {
                    const { name } = file;
                    return (
                      <Option value={name} key={index}>
                        <div className={styles.iconWrapper}>
                          <span>{name}</span>
                        </div>
                      </Option>
                    );
                  })} */}
                </Select>
                {/* </Form.Item> */}

                <Alert display type="remind" header="reminder">
                  <p>
                    {formatMessage({ id: 'component.offerDetail.alertContent1' })}
                    <strong>{formatMessage({ id: 'component.offerDetail.phase3' })}</strong>
                    {formatMessage({ id: 'component.offerDetail.alertContent2' })}
                  </p>
                </Alert>
              </div>
            )}

            <p className={styles.agreement}>
              {formatMessage({ id: 'component.offerDetail.agreementTitle' })}
            </p>

            <Checkbox
              className="checkbox"
              checked={agreement}
              onChange={(e) => handleAgreementChange(e.target.value)}
              disabled={disableAll}
            >
              {formatMessage({ id: 'component.offerDetail.agreement' })}
            </Checkbox>

            <p className={styles.handbook}>
              {formatMessage({ id: 'component.offerDetail.handbookTitle' })}
            </p>

            <Checkbox
              checked={handbook}
              onChange={(e) => handleHandbookChange(e.target.value)}
              disabled={disableAll}
            >
              {formatMessage({ id: 'component.offerDetail.handbook' })}
            </Checkbox>

            <div className={styles.wrapper2}>
              <div className={styles.compensationWrapper}>
                <p className={styles.compensation}>
                  {formatMessage({ id: 'component.offerDetail.compensationTitle' })}
                </p>

                <Form.Item name="compensation">
                  <Select className={styles.select} disabled={disableAll}>
                    <Option value="salary">Salary</Option>
                    <Option value="salary2">Stock</Option>
                    <Option value="salary3">Other Non-cash benefit</Option>
                  </Select>
                </Form.Item>
              </div>
              <Alert display type="info">
                <p>
                  {formatMessage({ id: 'component.offerDetail.alertContent3' })}
                  <a> {formatMessage({ id: 'component.offerDetail.alertContent4' })}</a>
                </p>
              </Alert>
            </div>

            <p className={styles.amount}>
              {formatMessage({ id: 'component.offerDetail.amountTitle' })}
            </p>

            <Form.Item name="currency">
              <Select className={styles.select} disabled={disableAll}>
                {currencyArr.map(({ name, value }, index) => (
                  <Option value={value} key={index}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className={styles.wrapper3}>
              <div className={styles.timeoffWrapper}>
                <p className={styles.timeoff}>
                  {' '}
                  {formatMessage({ id: 'component.offerDetail.timeoffTitle' })}
                </p>

                <Form.Item name="timeoff">
                  <Select className={styles.select} disabled={disableAll}>
                    {timeoffArr.map(({ name, value }, index) => (
                      <Option value={value} key={index}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <Alert display={displayTimeoffAlert} type="caution">
                <p>{formatMessage({ id: 'component.offerDetail.alertContent5' })}</p>
              </Alert>
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
  );
};

// export default connect(({ info: { offerDetail = {} } = {} }) => ({
//   offerDetail,
// }))(OfferDetail);
export default connect(
  ({ candidateInfo: { data, checkMandatory, currentStep, tempData } = {}, loading }) => ({
    data,
    checkMandatory,
    currentStep,
    tempData,
    loading1: loading.effects['candidateInfo/createFinalOfferEffect'], // Loading for generating offer service
  }),
)(OfferDetail);
