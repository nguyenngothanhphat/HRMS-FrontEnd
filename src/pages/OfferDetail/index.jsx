import React, { useState, useEffect } from 'react';

import { Radio, Select, Checkbox } from 'antd';
const { Option } = Select;

import { currencyArr, timeoffArr, fileArr } from './mockData';

import styles from './index.less';

import FileIcon from './components/FileIcon/index.js';
import Template from './components/Template/index.js';
import Alert from './components/Alert/index.js';
import getFileType from './components/utils';

import './override.less';

const OfferDetail = () => {
  const [includeOffer, setIncludeOffer] = useState(false);
  const [file, setFile] = useState('Template.docx');
  const [agreement, setAgreement] = useState(false);
  const [handbook, setHandbook] = useState(false);
  const [compensationType, setCompensationType] = useState('salary');
  const [currency, setCurrency] = useState('dollar');

  const [displayTimeoffAlert, setDisplayTimeoffAlert] = useState(true);

  let timeoffAlertRef = null;

  const handleRadio = (e) => {
    const value = e.target.value;
    setIncludeOffer(value);
  };

  const handleTimeoffChange = (value) => {
    if (value === 'can not') {
      setDisplayTimeoffAlert(true);
    } else {
      setDisplayTimeoffAlert(false);
    }
  };

  const handleFileChange = (value) => {
    setFile(value);
  };

  const handleAgreementChange = (value) => {
    setAgreement(!agreement);
  };

  const handleHandbookChange = (value) => {
    setHandbook(!handbook);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  return (
    <div className={styles.offerDetailContainer}>
      <div className={styles.offerDetail}>
        <div className={styles.top}>
          <h3 className={styles.header}>Offer details</h3>

          <p>All documents supporting candidate's employment eligibility will be display here</p>
        </div>

        <div className={styles.middle}>
          <p>Offer letter</p>

          <Radio.Group onChange={handleRadio} value={includeOffer} className={styles.radioGroup}>
            <Radio value={false}>Do not include offer letter</Radio>
            <Radio value={true}>Use an existing offer letter</Radio>
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

            <Alert display={true} type="remind" header="reminder">
              <p>
                This offer letter will be sent in <strong>Phase 3</strong> of the onboarding
                process.
              </p>
            </Alert>
          </div>

          <p className={styles.agreement}>Hiring agreements</p>

          <Checkbox
            className="checkbox"
            value={agreement}
            onChange={(e) => handleAgreementChange(e.target.value)}
          >
            Default YC IP / Confidentiality Agreement
          </Checkbox>

          <p className={styles.handbook}>Company handbook</p>

          <Checkbox value={handbook} onChange={(e) => handleHandbookChange(e.target.value)}>
            My company's handbook
          </Checkbox>

          <div className={styles.wrapper2}>
            <div className={styles.compensationWrapper}>
              <p className={styles.compensation}>Compensation type</p>

              <Select className={styles.select} value={compensationType} disabled>
                <Option value="salary">Salary</Option>
                <Option value="salary2">Salary2</Option>
                <Option value="salary3">Salary3</Option>
              </Select>
            </div>
            <Alert display={true} type="info">
              <p>
                To view salary related insights, explore the <a> Compensation Management App </a>
              </p>
            </Alert>
          </div>

          <p className={styles.amount}>Amount in</p>

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
              <p className={styles.timeoff}>Time off Policy</p>

              <Select
                defaultValue="can not"
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

            <Alert
              display={displayTimeoffAlert}
              ref={(ref) => (timeoffAlertRef = ref)}
              type="caution"
            >
              <p>Are you sure? This hire will not be able to submit any time off requests.</p>
            </Alert>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.note}>*All mandatory fields have been filled.</p>
        </div>
      </div>

      <div className={styles.rightCol}>
        <Template type="default" files={['Offer letter 1', 'Offer letter 2', 'Offer letter 3']} />
        <Template files={['Offer letter 4', 'Offer letter 5', 'Offer letter 6']} />
      </div>
    </div>
  );
};

export default OfferDetail;
