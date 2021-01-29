import React, { Component } from 'react';
import { Input, Form, DatePicker, Select, Spin } from 'antd';
import moment from 'moment';
import { formatMessage, connect } from 'umi';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import removeIcon from '../assets/removeIcon.svg';
import UploadImage from '../../UploadImage';
import s from './index.less';

const { Option } = Select;

@connect(({ loading, upload: { loadingPassportTest = [] } }) => ({
  loadingPassportTest,
  loading: loading.effects['upload/uploadFile'],
}))
class PassportItem extends Component {
  render() {
    const {
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
      urlFile = '',
      index = 0,
      isLt5M,
      loadingPassportTest,
      loading,
      isDate,
      formatCountryList = [],
    } = this.props;

    const formatDatePassportIssueOn = passportIssuedOn && moment(passportIssuedOn);
    const formatDatePassportValidTill = passportValidTill && moment(passportValidTill);

    const dateFormat = 'Do MMM YYYY';

    return (
      <div key={`passport${index + 1}`} className={s.PassportItem}>
        {index > 0 ? <div className={s.line} /> : null}

        <div className={s.styleUpLoad}>
          <Form.Item
            label="Passport Number"
            name={`passportNumber ${index}`}
            rules={[
              {
                pattern: /^[a-zA-Z0-9]{0,12}$/,
                message: formatMessage({
                  id: 'pages.employeeProfile.validatePassPortNumber',
                }),
              },
            ]}
          >
            <Input
              className={isLt5M ? s.inputForm : s.inputFormImageValidate}
              defaultValue={passportNumber}
              onChange={(event) => {
                const { value: fieldValue } = event.target;
                this.handleChange(index, 'passportNumber', fieldValue);
              }}
            />
          </Form.Item>
          {index >= 1 ? (
            <div>
              <img
                className={s.removeIcon}
                onClick={() => this.onRemoveCondition(index)}
                src={removeIcon}
                alt="remove"
              />
            </div>
          ) : null}

          {!urlFile ? (
            <div className={s.textUpload}>
              {loadingPassportTest[index] === false || loadingPassportTest[index] === undefined ? (
                <UploadImage
                  content={isLt5M ? 'Choose file' : `Retry`}
                  setSizeImageMatch={(isImage5M) => this.handleGetSetSizeImage(index, isImage5M)}
                  getResponse={(resp) => this.handleGetUpLoad(index, resp)}
                  loading={loading}
                  index={index}
                  name="passport"
                />
              ) : (
                <Spin loading={loadingPassportTest[index]} active="true" />
              )}
            </div>
          ) : (
            <div className={s.viewUpLoadData}>
              <p
                onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
                className={s.viewUpLoadDataURL}
              >
                fileName
              </p>
              <p className={s.viewUpLoadDataText}>Uploaded</p>
              <img
                src={cancelIcon}
                alt=""
                onClick={() => this.handleCanCelIcon(index)}
                className={s.viewUpLoadDataIconCancel}
              />
            </div>
          )}
        </div>
        {urlFile ? (
          <Form.Item label="Uploaded file:" className={s.labelUpload}>
            <p
              onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
              className={s.urlUpload}
            >
              {this.handleNameDataUpload(urlFile.url)}
            </p>
          </Form.Item>
        ) : (
          ''
        )}
        <Form.Item label="Issued Country" name={`passportIssuedCountry ${index}`}>
          <Select
            showArrow
            className={s.selectForm}
            defaultValue={passportIssuedCountry ? passportIssuedCountry._id : ''}
            onChange={(value) => {
              this.handleChange(index, 'passportIssuedCountry', value);
            }}
          >
            {formatCountryList.map((itemCountry) => {
              return (
                <Option key={itemCountry.value} value={itemCountry.value}>
                  {itemCountry.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Issued On" name={`passportIssuedOn ${index}`}>
          <DatePicker
            format={dateFormat}
            defaultValue={formatDatePassportIssueOn}
            onChange={(dates) => {
              this.handleChange(index, 'passportIssuedOn', dates);
            }}
            className={s.dateForm}
          />
        </Form.Item>
        <Form.Item
          label="Valid Till"
          name={`passportValidTill ${index}`}
          validateStatus={isDate === false ? 'error' : 'success'}
          help={
            isDate === false
              ? formatMessage({
                  id: 'pages.employeeProfile.validateDate',
                })
              : ''
          }
        >
          <DatePicker
            format={dateFormat}
            defaultValue={formatDatePassportValidTill}
            onChange={(dates) => {
              this.handleChange(index, 'passportValidTill', dates);
            }}
            className={isDate === false ? s.dateFormValidate : s.dateForm}
          />
        </Form.Item>
      </div>
    );
  }
}
export default PassportItem;
