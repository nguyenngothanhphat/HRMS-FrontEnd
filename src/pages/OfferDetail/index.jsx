import React, { useState } from 'react';

import { Radio, Select, Checkbox } from 'antd';
const { Option } = Select;

import styles from './index.less';
import './override.less';

import WordIcon from './images/word.png';
import ExcelIcon from './images/excel.png';
import PdfIcon from './images/pdf.png';

const PhoneIcon = (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 513.64 513.64"
    style={{ enableBackground: 'new 0 0 513.64 513.64;' }}
  >
    <g>
      <g>
        <path
          d="M499.66,376.96l-71.68-71.68c-25.6-25.6-69.12-15.359-79.36,17.92c-7.68,23.041-33.28,35.841-56.32,30.72
     c-51.2-12.8-120.32-79.36-133.12-133.12c-7.68-23.041,7.68-48.641,30.72-56.32c33.28-10.24,43.52-53.76,17.92-79.36l-71.68-71.68
     c-20.48-17.92-51.2-17.92-69.12,0l-48.64,48.64c-48.64,51.2,5.12,186.88,125.44,307.2c120.32,120.32,256,176.641,307.2,125.44
     l48.64-48.64C517.581,425.6,517.581,394.88,499.66,376.96z"
        />
      </g>
    </g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
  </svg>
);

const Alert = (props) => {
  const { type, children } = props;

  let classByType;
  let headerByType;

  switch (type) {
    case 'remind':
      classByType = styles.remind;
      headerByType = 'Reminder';
      break;
    case 'info':
      classByType = styles.info;
      headerByType = 'Info';
      break;
    case 'caution':
      classByType = styles.caution;
      headerByType = 'Caution';
      break;
    default:
      classByType = styles.remind;
      headerByType = 'Reminder';
      break;
  }

  return (
    <div className={`${styles.alert} ${classByType}`}>
      <div className={styles.alertHeader}>
        <svg
          className="icon"
          viewBox="64 64 896 896"
          focusable="false"
          class=""
          data-icon="exclamation-circle"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            //   className={styles.icon}
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          ></path>
          <path
            //   className={styles.icon}
            d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"
          ></path>
        </svg>
        <h4>{headerByType}</h4>
      </div>
      <div className={styles.alertContent}>{children}</div>
    </div>
  );
};

const OfferDetail = () => {
  const handleRadio = (e) => {
    const value = e.target.value;
    setRadioValue(value);
  };

  const [radioValue, setRadioValue] = useState('1');

  return (
    <div className={styles.offerDetail}>
      <div className={styles.top}>
        <h3 className={styles.header}>Offer details</h3>

        <p>All documents supporting candidate's employment eligibility will be display here</p>
      </div>

      <div className={styles.middle}>
        <p>Offer letter</p>

        <Radio.Group onChange={handleRadio} value={radioValue} className={styles.radioGroup}>
          <Radio value="1">Do not include offer letter</Radio>
          <Radio value="2">Use an existing offer letter</Radio>
        </Radio.Group>

        <div className={styles.wrapper1}>
          <Select defaultValue="word" className={styles.select}>
            <Option value="word">
              <div className={styles.iconWrapper}>
                <img src={WordIcon} alt="word icon" />
                <span>Template.docx</span>
              </div>
            </Option>
            <Option value="excel">
              <div className={styles.iconWrapper}>
                <img src={ExcelIcon} alt="excel icon" />
                <span>Template.xls</span>
              </div>
            </Option>

            <Option value="pdf">
              <div className={styles.iconWrapper}>
                <img src={PdfIcon} alt="pdf icon" />
                <span>Template.pdf</span>
              </div>
            </Option>
          </Select>

          <Alert type="remind" header="reminder">
            {' '}
            <p>
              This offer letter will be sent in <strong>Phase 3</strong> of the onboarding process.
            </p>
          </Alert>
        </div>

        <p className={styles.agreement}>Hiring agreements</p>

        <Checkbox>Default YC IP / Confidentiality Agreement</Checkbox>

        <p className={styles.handbook}>Company handbook</p>

        <Checkbox>Default YC IP / Confidentiality Agreement</Checkbox>

        <div className={styles.wrapper2}>
          <div className={styles.compensationWrapper}>
            <p className={styles.compensation}>Compensation type</p>

            <Select defaultValue="salary" className={styles.select}>
              <Option value="salary">Salary</Option>
              <Option value="salary1">Salary1</Option>
              <Option value="salary2">Salary2</Option>
            </Select>
          </div>
          <Alert type="info">
            <p>
              To view salary related insights, explore the <a> Compensation Management App </a>
            </p>
          </Alert>
        </div>

        <p className={styles.amount}>Amount in</p>

        <Select defaultValue="dollar" className={styles.select}>
          <Option value="dollar">Dollar</Option>
          <Option value="euro">Euro</Option>
          <Option value="yen">Yen</Option>
        </Select>

        <div className={styles.wrapper3}>
          <div className={styles.timeoffWrapper}>
            <p className={styles.timeoff}>Time off Policy</p>

            <Select defaultValue="can not" className={styles.select}>
              <Option value="can not">Cannot take time off</Option>
              <Option value="can">Can take time off</Option>
            </Select>
          </div>

          <Alert type="caution">
            <p>Are you sure? This hire will not be able to submit any time off requests.</p>
          </Alert>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.note}>*All mandatory fields have been filled.</p>
      </div>
    </div>
  );
};

export default OfferDetail;
