/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Input, Form, DatePicker, Select, Spin } from 'antd';
// import moment from 'moment';
import { formatMessage, connect } from 'umi';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import removeIcon from '../assets/removeIcon.svg';
import UploadImage from '../../UploadImage';
import s from '../index.less';

const { Option } = Select;

@connect(({ loading, upload: { loadingPassportTest = [] } }) => ({
  loadingPassportTest,
  loading: loading.effects['upload/uploadFile'],
}))
class PassportItem extends Component {
  handleGetUpLoad = (index, resp) => {
    const { getDataImage } = this.props;
    const { data = [] } = resp;
    const [first] = data;
    const value = { id: first ? first.id : '', url: first ? first.url : '' };
    getDataImage(index, 'urlFile', value);
  };

  handleGetSetSizeImage = (index, isLt5M) => {
    const { getSizeImage } = this.props;
    getSizeImage(index, isLt5M);
  };

  handleNameDataUpload = (url) => {
    const split1URL = url.split('/');
    const nameData1URL = split1URL[split1URL.length - 1];
    return nameData1URL;
  };

  handleOpenModalReview = (linkImage) => {
    const { getShowModal } = this.props;
    getShowModal(linkImage);
  };

  handleCanCelIcon = (index) => {
    const { getCancelImage } = this.props;
    getCancelImage(index);
  };

  handleChange = (index, name, value) => {
    const { getHandleChange } = this.props;
    getHandleChange(index, name, value);
  };

  render() {
    const {
      index = 0,
      isLt5M,
      loadingPassportTest,
      loading,
      formatCountryList = [],
      field,
      onRemove,
      passportData,
      validatePassPort,
    } = this.props;

    const dateFormat = 'MM.DD.YY';

    return (
      <div
        // key={`passport${field.key + 1}`}
        // key={key}
        className={s.PassportItem}
      >
        {field.fieldKey > 0 ? <div className={s.line} /> : null}

        <div className={s.styleUpLoad}>
          <Form.Item
            {...field}
            label="Passport Number"
            name={[field.name, 'passportNumber']}
            fieldKey={[field.fieldKey, 'passportNumber']}
            // name={`passportNumber ${index}`}
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
              // defaultValue={passportNumber}
              // onChange={(event) => {
              //   const { value: fieldValue } = event.target;
              //   this.handleChange(index, 'passportNumber', fieldValue);
              // }}
            />
          </Form.Item>

          {index >= 1 ? (
            <div>
              <img
                className={s.removeIcon}
                onClick={() => onRemove()}
                src={removeIcon}
                alt="remove"
              />
            </div>
          ) : null}

          {!passportData[index]?.urlFile ? (
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
                onClick={() =>
                  this.handleOpenModalReview(
                    passportData[index]?.urlFile ? passportData[index].urlFile.url : '',
                  )}
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
        {passportData[index]?.urlFile ? (
          <Form.Item label="Uploaded file:" className={s.labelUpload}>
            <p
              onClick={() =>
                this.handleOpenModalReview(
                  passportData[index]?.urlFile ? passportData[index].urlFile.url : '',
                )}
              className={s.urlUpload}
            >
              {this.handleNameDataUpload(passportData[index].urlFile.url)}
            </p>
          </Form.Item>
        ) : (
          ''
        )}
        <Form.Item
          // {...field}
          label="Issued Country"
          // name={`passportIssuedCountry ${index}`}
          name={[field.name, 'passportIssuedCountry']}
          fieldKey={[field.fieldKey, 'passportIssuedCountry']}
        >
          <Select
            showArrow
            className={s.selectForm}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
               option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            // defaultValue={passportIssuedCountry ? passportIssuedCountry._id : ''}
            // onChange={(value) => {
            //   this.handleChange(index, 'passportIssuedCountry', value);
            // }}
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

        <Form.Item
          // {...field}
          label="Issued On"
          name={[field.name, 'passportIssuedOn']}
          fieldKey={[field.fieldKey, `passportIssuedOn`]}
          // name={`passportIssuedOn ${index}`}
        >
          <DatePicker
            format={dateFormat}
            // defaultValue={formatDatePassportIssueOn}
            onChange={(dates) => {
              this.handleChange(index, 'passportIssuedOn', dates);
            }}
            className={s.dateForm}
          />
        </Form.Item>

        <Form.Item
          {...field}
          label="Valid Till"
          // name={`passportValidTill ${index}`}
          name={[field.name, 'passportValidTill']}
          fieldKey={[field.fieldKey, 'passportValidTill']}
          validateStatus={validatePassPort === false ? 'error' : 'success'}
          help={
            validatePassPort === false
              ? formatMessage({
                  id: 'pages.employeeProfile.validateDate',
                })
              : ''
          }
        >
          <DatePicker
            format={dateFormat}
            // defaultValue={formatDatePassportValidTill}
            onChange={(dates) => {
              this.handleChange(index, 'passportValidTill', dates);
            }}
            className={validatePassPort === false ? s.dateFormValidate : s.dateForm}
          />
        </Form.Item>
      </div>
    );
  }
}
export default PassportItem;
