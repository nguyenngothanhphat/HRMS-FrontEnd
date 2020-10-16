/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import { Radio, Select, Checkbox, Form } from 'antd';

import { connect, formatMessage } from 'umi';
import { currencyArr, timeoffArr, fileArr } from './mockData';

import styles from './index.less';

import FileIcon from './components/FileIcon/index';
import Template from './components/Template/index';
import Alert from './components/Alert/index';
import { getFileType } from './components/utils';

const { Option } = Select;

const OfferDetail = (props) => {
  const { dispatch, offerDetail } = props;
  const [form] = Form.useForm();
  // Get default value from "info" store
  const {
    includeOffer: includeOfferProp,
    file: fileProp,
    // agreement: agreementProp,
    // handbook: handbookProp,
    currency: currencyProp,
    timeoff: timeoffProp,
    compensation: compensationProp,
  } = offerDetail;

  // const [includeOffer, setIncludeOffer] = useState(includeOfferProp);
  const [file, setFile] = useState(fileProp);
  const [agreement, setAgreement] = useState(true);
  const [handbook, setHandbook] = useState(true);
  // const [compensation, setCompensation] = useState(compensationProp);
  // const [currency, setCurrency] = useState(currencyProp);
  // const [timeoff, setTimeoff] = useState(timeoffProp);
  // const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(timeoff !== 'can');
  const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(false);

  // Trigger dispatch save changes to "info" store
  // useEffect(() => {
  //   if (dispatch) {
  //     dispatch({
  //       type: 'info/save',
  //       payload: {
  //         offerDetail: {
  //           ...offerDetail,
  //           includeOffer,
  //           file,
  //           agreement,
  //           handbook,
  //           currency,
  //           compensation,
  //           timeoff,
  //         },
  //       },
  //     });
  //   }
  // }, [includeOffer, file, agreement, handbook, compensation, currency, timeoff]);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    console.log(formValues);
    // console.log(form.getFieldValue('agreement'));
  }, []);

  const handleRadio = (e) => {
    const { value } = e.target;
    // setIncludeOffer(value);
  };

  const handleTimeoffChange = (value) => {
    // if (value === 'can not') {
    //   setDisplayTimeoffAlert(true);
    // } else {
    //   setDisplayTimeoffAlert(false);
    // }
    // setTimeoff(value);
  };

  const handleFileChange = (value) => {
    setFile(value);
  };

  const handleAgreementChange = () => {
    setAgreement((prevState) => !prevState);
  };

  const handleHandbookChange = () => {
    setHandbook((prevState) => !prevState);
  };

  const handleCurrencyChange = (value) => {
    // setCurrency(value);
  };

  const handleCompensationChange = (value) => {
    // setCompensation(value);
  };

  return (
    <Form
      form={form}
      initialValues={{
        includeOffer: false,
        agreement: true,
        compensation: 'salary2',
        handbook: true,
        currency: 'dollar',
        timeoff: 'can',
      }}
      // onFieldsChange={(changedFields, allFields) => {
      //   console.log(changedFields);
      //   console.log(allFields);
      // }}
      onValuesChange={(changedValues, allFieldsValues) => {
        console.log(changedValues);
        console.log(allFieldsValues);

        const { timeoff } = allFieldsValues;
        if (timeoff === 'can not') {
          setDisplayTimeoffAlert(true);
        } else {
          setDisplayTimeoffAlert(false);
        }
      }}
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
              <Radio.Group
                // onChange={handleRadio}
                className={styles.radioGroup}
              >
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

            {/* <Form.Item name="agreement"> */}
            <Checkbox
              className="checkbox"
              checked={agreement}
              onChange={(e) => handleAgreementChange(e.target.value)}
            >
              {formatMessage({ id: 'component.offerDetail.agreement' })}
            </Checkbox>
            {/* </Form.Item> */}

            <p className={styles.handbook}>
              {formatMessage({ id: 'component.offerDetail.handbookTitle' })}
            </p>
            {/* <Form.Item name="handbook"> */}
            <Checkbox checked={handbook} onChange={(e) => handleHandbookChange(e.target.value)}>
              {formatMessage({ id: 'component.offerDetail.handbook' })}
            </Checkbox>
            {/* </Form.Item> */}

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
                  <Select
                    // value={timeoff}
                    className={styles.select}
                  >
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
        </div>

        <div className={styles.rightCol}>
          <Template type="default" files={['Offer letter 1', 'Offer letter 2', 'Offer letter 3']} />
          <Template files={['Offer letter 4', 'Offer letter 5', 'Offer letter 6']} />
        </div>
      </div>
    </Form>
  );
};

export default connect(({ info: { offerDetail = {} } = {} }) => ({
  offerDetail,
}))(OfferDetail);
