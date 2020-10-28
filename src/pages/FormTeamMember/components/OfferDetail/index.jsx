/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import { Radio, Select, Checkbox, Form, Row, Col, Button } from 'antd';

import { connect, formatMessage } from 'umi';
import { currencyArr, timeoffArr, fileArr } from './mockData';

import styles from './index.less';

import FileIcon from './components/FileIcon/index';
import Template from './components/Template/index';
import Alert from './components/Alert/index';
import { getFileType } from './components/utils';

const { Option } = Select;

const OfferDetail = (props) => {
  const { dispatch, checkMandatory, currentStep, data, tempData } = props;
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
  const [form] = Form.useForm();

  // const [includeOffer, setIncludeOffer] = useState(includeOfferProp);
  const [file, setFile] = useState(templateProp || '');
  const [agreement, setAgreement] = useState(agreementProp);
  const [handbook, setHandbook] = useState(handbookProp);
  // const [compensation, setCompensation] = useState(compensationProp);
  // const [currency, setCurrency] = useState(currencyProp);
  // const [timeoff, setTimeoff] = useState(timeoffProp);
  // const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(timeoff !== 'can');
  const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const checkAllFieldsValid = (allFieldsValues) => {
    const keys = Object.keys(allFieldsValues);
    let valid = true;
    keys.map((key) => {
      const value = allFieldsValues[key];
      if (value === null || value === undefined || value.length === 0) {
        valid = false;
      }
      return null;
    });

    setAllFieldsFilled(valid);

    if (dispatch) {
      dispatch({
        type: 'candidateInfo/save',
        payload: {
          checkMandatory: {
            ...checkMandatory,
            filledOfferDetail: valid,
          },
        },
      });
    }
    return valid;
  };

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

  useEffect(() => {
    const formValues = form.getFieldsValue();
    checkAllFieldsValid({ ...formValues, agreement, handbook });
  }, []);

  useEffect(() => {
    const allFormValues = form.getFieldsValue();
    handleFormChange(null, allFormValues);
    checkAllFieldsValid(allFormValues);
  }, [file, agreement, handbook]);

  const handleFileChange = (value) => {
    setFile(value);
  };

  const handleAgreementChange = () => {
    setAgreement((prevState) => !prevState);
  };

  const handleHandbookChange = () => {
    setHandbook((prevState) => !prevState);
  };

  const onClickNext = () => {
    if (!dispatch) {
      return;
    }

    const { _id = '' } = data;
    const formValues = form.getFieldsValue();
    const { compensation, currency, timeoff } = formValues;

    dispatch({
      type: 'candidateInfo/save',
      payload: {
        currentStep: currentStep + 1,
      },
    });

    dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        compensationType: compensation,
        amountIn: currency,
        timeOffPolicy: timeoff,
        hiringAgreements: agreement,
        companyHandbook: handbook,
        candidate: _id,
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
              {' '}
              <Button
                type="primary"
                onClick={onClickNext}
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
              <Radio.Group className={styles.radioGroup}>
                <Radio value={false}>
                  {formatMessage({ id: 'component.offerDetail.notInclude' })}
                </Radio>
                <Radio value>{formatMessage({ id: 'component.offerDetail.include' })}</Radio>
              </Radio.Group>
            </Form.Item>

            <div className={styles.wrapper1}>
              <Select
                value={
                  <>
                    <FileIcon type={getFileType(file)} />
                    {file}
                  </>
                }
                className={styles.select}
                onChange={(value) => handleFileChange(value)}
              >
                {fileArr.map(({ name }, index) => (
                  <Option value={name} key={index}>
                    <div className={styles.iconWrapper}>
                      <span>{name}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              <Alert display type="remind" header="reminder">
                <p>
                  {formatMessage({ id: 'component.offerDetail.alertContent1' })}
                  <strong>{formatMessage({ id: 'component.offerDetail.phase3' })}</strong>
                  {formatMessage({ id: 'component.offerDetail.alertContent2' })}
                </p>
              </Alert>
            </div>

            <p className={styles.agreement}>
              {formatMessage({ id: 'component.offerDetail.agreementTitle' })}
            </p>

            <Checkbox
              className="checkbox"
              checked={agreement}
              onChange={(e) => handleAgreementChange(e.target.value)}
            >
              {formatMessage({ id: 'component.offerDetail.agreement' })}
            </Checkbox>

            <p className={styles.handbook}>
              {formatMessage({ id: 'component.offerDetail.handbookTitle' })}
            </p>

            <Checkbox checked={handbook} onChange={(e) => handleHandbookChange(e.target.value)}>
              {formatMessage({ id: 'component.offerDetail.handbook' })}
            </Checkbox>

            <div className={styles.wrapper2}>
              <div className={styles.compensationWrapper}>
                <p className={styles.compensation}>
                  {formatMessage({ id: 'component.offerDetail.compensationTitle' })}
                </p>

                <Form.Item name="compensation">
                  <Select className={styles.select}>
                    <Option value="salary">Salary</Option>
                    <Option value="salary2">Salary2</Option>
                    <Option value="salary3">Salary3</Option>
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
              <Select className={styles.select}>
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
                  <Select className={styles.select}>
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
          <Template type="default" files={defaultTemplates} />
          <Template files={customTemplates} />
        </div>
      </div>
    </Form>
  );
};

// export default connect(({ info: { offerDetail = {} } = {} }) => ({
//   offerDetail,
// }))(OfferDetail);
export default connect(
  ({ candidateInfo: { data, checkMandatory, currentStep, tempData } = {} }) => ({
    data,
    checkMandatory,
    currentStep,
    tempData,
  }),
)(OfferDetail);
