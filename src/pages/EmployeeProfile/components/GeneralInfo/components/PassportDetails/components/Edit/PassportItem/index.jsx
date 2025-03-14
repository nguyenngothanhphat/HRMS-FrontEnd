/* eslint-disable react/jsx-props-no-spreading */
import { DatePicker, Form, Input, Select, Spin } from 'antd';
import React, { Component } from 'react';
// import moment from 'moment';
import { connect, formatMessage } from 'umi';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import UploadImage from '../../UploadImage';
import removeIcon from '../assets/removeIcon.svg';
import s from '../index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    upload: { loadingPassportTest = [] },
    employeeProfile: { employee, tempData: { passportData = [] } = {} } = {},
  }) => ({
    employee,

    passportData,
    loadingPassportTest,
    loading: loading.effects['upload/uploadFile'],
  }),
)
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

  handleRemove = (id, index) => {
    const { passportData = [], dispatch, onRemove, employee } = this.props;
    const newPassportData = [...passportData];
    newPassportData.splice(index, 1);

    dispatch({
      type: 'employeeProfile/removePassPort',
      payload: { id, employee },
    });
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: newPassportData },
    });
    onRemove();
  };

  render() {
    const {
      index = 0,
      isLt5M,
      loadingPassportTest,
      loading,
      formatCountryList = [],
      field,
      passportData,
      validatePassPort,
      getHandleChange,
    } = this.props;
    const id = passportData[index] ? passportData[index]._id : '';
    const dateFormat = 'Do MMMM YYYY';
    const { urlFile, document: { attachment: { url: urlFile2 = '' } = {} || {} } = {} || {} } =
      passportData[index] || {};

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
              onChange={(event) => {
                const { value: fieldValue } = event.target;
                getHandleChange(index, 'passportNumber', fieldValue);
              }}
            />
          </Form.Item>

          {index >= 1 ? (
            <div>
              <img
                className={s.removeIcon}
                onClick={() => this.handleRemove(id, index)}
                src={removeIcon}
                alt="remove"
              />
            </div>
          ) : null}

          {!urlFile || !urlFile2 ? (
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
            <span
              onClick={() => this.handleOpenModalReview(urlFile ? urlFile.url : '')}
              className={s.urlUpload}
            >
              {this.handleNameDataUpload(urlFile.url)}
            </span>
          </Form.Item>
        ) : (
          ''
        )}
        {urlFile2 && !urlFile ? (
          <Form.Item label="Uploaded file:" className={s.labelUpload}>
            <span onClick={() => this.handleOpenModalReview(urlFile2)} className={s.urlUpload}>
              {this.handleNameDataUpload(urlFile2)}
            </span>
          </Form.Item>
        ) : (
          ''
        )}
        <Form.Item
          // {...field}
          label="Issued By Country"
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
            onChange={(value) => {
              getHandleChange(index, 'passportIssuedCountry', value);
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
              getHandleChange(index, 'passportIssuedOn', dates);
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
              getHandleChange(index, 'passportValidTill', dates);
            }}
            className={validatePassPort === false ? s.dateFormValidate : s.dateForm}
          />
        </Form.Item>
      </div>
    );
  }
}
export default PassportItem;
