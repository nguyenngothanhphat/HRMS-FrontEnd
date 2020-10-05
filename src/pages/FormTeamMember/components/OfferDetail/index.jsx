/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import { Radio, Select, Checkbox } from 'antd';

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

  const [includeOffer, setIncludeOffer] = useState(includeOfferProp);
  const [file, setFile] = useState(fileProp);
  const [agreement, setAgreement] = useState(true);
  const [handbook, setHandbook] = useState(true);
  const [compensation, setCompensation] = useState(compensationProp);
  const [currency, setCurrency] = useState(currencyProp);
  const [timeoff, setTimeoff] = useState(timeoffProp);
  const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(timeoff !== 'can');

  // Trigger dispatch save changes to "info" store
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'info/save',
        payload: {
          offerDetail: {
            ...offerDetail,
            includeOffer,
            file,
            agreement,
            handbook,
            currency,
            compensation,
            timeoff,
          },
        },
      });
    }
  }, [includeOffer, file, agreement, handbook, compensation, currency, timeoff]);

  const handleRadio = (e) => {
    const { value } = e.target;
    setIncludeOffer(value);
  };

  const handleTimeoffChange = (value) => {
    if (value === 'can not') {
      setDisplayTimeoffAlert(true);
    } else {
      setDisplayTimeoffAlert(false);
    }
    setTimeoff(value);
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
    setCurrency(value);
  };

  const handleCompensationChange = (value) => {
    setCompensation(value);
  };

  return (
    <div className={styles.offerDetailContainer}>
      <div className={styles.offerDetail}>
        <div className={styles.top}>
          <h3 className={styles.header}>{formatMessage({ id: 'component.offerDetail.title' })}</h3>

          <p>{formatMessage({ id: 'component.offerDetail.subtitle' })}</p>
        </div>

        <div className={styles.middle}>
          <p>{formatMessage({ id: 'component.offerDetail.offerLetter' })}</p>

          <Radio.Group onChange={handleRadio} value={includeOffer} className={styles.radioGroup}>
            <Radio value={false}>{formatMessage({ id: 'component.offerDetail.notInclude' })}</Radio>
            <Radio value>{formatMessage({ id: 'component.offerDetail.include' })}</Radio>
          </Radio.Group>

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
            disabled
            className="checkbox"
            checked={agreement}
            onChange={(e) => handleAgreementChange(e.target.value)}
          >
            {formatMessage({ id: 'component.offerDetail.agreement' })}
          </Checkbox>

          <p className={styles.handbook}>
            {formatMessage({ id: 'component.offerDetail.handbookTitle' })}
          </p>

          <Checkbox
            disabled
            checked={handbook}
            onChange={(e) => handleHandbookChange(e.target.value)}
          >
            {formatMessage({ id: 'component.offerDetail.handbook' })}
          </Checkbox>

          <div className={styles.wrapper2}>
            <div className={styles.compensationWrapper}>
              <p className={styles.compensation}>
                {formatMessage({ id: 'component.offerDetail.compensationTitle' })}
              </p>

              <Select
                className={styles.select}
                value={compensation}
                onChange={(value) => handleCompensationChange(value)}
              >
                <Option value="salary">Salary</Option>
                <Option value="salary2">Salary2</Option>
                <Option value="salary3">Salary3</Option>
              </Select>
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

          <Select
            className={styles.select}
            value={currency}
            onChange={(value) => handleCurrencyChange(value)}
          >
            {currencyArr.map(({ name, value }, index) => (
              <Option value={value} key={index}>
                {name}
              </Option>
            ))}
          </Select>

          <div className={styles.wrapper3}>
            <div className={styles.timeoffWrapper}>
              <p className={styles.timeoff}>
                {' '}
                {formatMessage({ id: 'component.offerDetail.timeoffTitle' })}
              </p>

              <Select
                value={timeoff}
                className={styles.select}
                onChange={(value) => handleTimeoffChange(value)}
              >
                {timeoffArr.map(({ name, value }, index) => (
                  <Option value={value} key={index}>
                    {name}
                  </Option>
                ))}
              </Select>
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
  );
};

export default connect(({ info: { offerDetail = {} } = {} }) => ({
  offerDetail,
}))(OfferDetail);
