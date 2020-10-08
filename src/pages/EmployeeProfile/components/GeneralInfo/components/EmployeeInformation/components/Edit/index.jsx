import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Radio, Button } from 'antd';
import { connect, formatMessage } from 'umi';
import UploadImage from '@/components/UploadImage';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      AdhaarCard = {},
      idCurrentEmployee = '',
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
    upload: { employeeInformationURL = '' },
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    generalDataOrigin,
    generalData,
    employeeInformationURL,
    idCurrentEmployee,
    AdhaarCard,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (changedValues) => {
    const { dispatch, generalData, generalDataOrigin } = this.props;
    const generalInfo = {
      ...generalData,
      ...changedValues,
    };
    const isModified = JSON.stringify(generalInfo) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: generalInfo },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  processDataChanges = () => {
    const { generalData: generalDataTemp } = this.props;
    const {
      urlFile = '',
      legalGender = '',
      legalName = '',
      DOB = '',
      employeeId = '',
      workEmail = '',
      workNumber = '',
      adhaarCardNumber = '',
      uanNumber = '',
      _id: id = '',
    } = generalDataTemp;
    const payloadChanges = {
      id,
      urlFile,
      legalGender,
      legalName,
      DOB,
      employeeId,
      workEmail,
      workNumber,
      adhaarCardNumber,
      uanNumber,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { generalData } = this.props;
    const newObj = { ...generalData };
    const listKey = [
      'urlFile',
      'legalGender',
      'legalName',
      'DOB',
      'employeeId',
      'workEmail',
      'workNumber',
      'adhaarCardNumber',
      'uanNumber',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch } = this.props;
    const payload = this.processDataChanges() || {};
    const dataTempKept = this.processDataKept() || {};
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openEmployeeInfor',
    });
  };

  handleGetUpLoad = (resp) => {
    const { dispatch, idCurrentEmployee, AdhaarCard, generalDataOrigin, generalData } = this.props;
    const { data = [] } = resp;
    const [first] = data;
    const value = { id: first.id, url: first.url };
    const url = { urlFile: value };
    this.handleChange(url);
    const { adhaarCardNumber: adhaarCardNumberOrigin } = generalDataOrigin;
    const { adhaarCardNumber: adhaarCardNumberTemp } = generalData;
    const getNewAdhaarCard =
      adhaarCardNumberTemp !== adhaarCardNumberOrigin
        ? adhaarCardNumberTemp
        : adhaarCardNumberOrigin;
    if (AdhaarCard === null) {
      dispatch({
        type: 'employeeProfile/fetchDocumentAdd',
        payload: {
          key: 'Adhaar Card',
          attachment: first.id,
          employeeGroup: 'Identity',
          parentEmployeeGroup: 'Indentification Documents',
          employee: idCurrentEmployee,
        },
      }).then((id) => this.handleAdd(id));
    } else {
      dispatch({
        type: 'employeeProfile/fetchAdhaarcardUpdate',
        payload: {
          attachment: first.id,
          id: AdhaarCard._id,
          adhaarNumber: getNewAdhaarCard,
        },
      });
    }
  };

  handleAdd = (id) => {
    const { dispatch, generalData, idCurrentEmployee } = this.props;
    if (!generalData.adhaarCardNumber) return;
    const { adhaarCardNumber } = generalData;
    dispatch({
      type: 'employeeProfile/fetchAdhaarcardAdd',
      payload: {
        document: id,
        employee: idCurrentEmployee,
        adhaarNumber: adhaarCardNumber,
      },
    });
  };

  handleCanCelIcon = () => {
    const { dispatch, generalData, generalDataOrigin } = this.props;
    const item = { ...generalData, urlFile: '' };
    const isModified = JSON.stringify(item) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: item },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  render() {
    const { generalData, loading, handleCancel = () => {} } = this.props;
    const {
      urlFile = '',
      legalName = '',
      DOB = '',
      legalGender = '',
      employeeId = '',
      workEmail = '',
      workNumber = '',
      adhaarCardNumber = '',
      uanNumber = '',
    } = generalData;
    const nameFile = urlFile ? urlFile.url.split('/') : '';
    const splitURL = nameFile[nameFile.length - 1];
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
    };
    const formatDate = DOB && moment(DOB);
    const dateFormat = 'Do MMM YYYY';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={{
            legalName,
            legalGender,
            employeeId,
            workEmail,
            workNumber,
            adhaarCardNumber,
            uanNumber,
            DOB: formatDate,
          }}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
          onFinish={this.handleSave}
        >
          <Form.Item
            label="Legal Name"
            name="legalName"
            rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="Date of Birth" name="DOB">
            <DatePicker format={dateFormat} className={styles.dateForm} />
          </Form.Item>
          <Form.Item label="Legal Gender" name="legalGender">
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Employee ID" name="employeeId">
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Work Email"
            name="workEmail"
            rules={[
              {
                pattern: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateEmail' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Work Number"
            name="workNumber"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <div className={styles.styleUpLoad}>
            <Form.Item
              label="Adhaar Card Number"
              name="adhaarCardNumber"
              rules={[
                {
                  pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                  message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
            <>
              {urlFile === '' ? (
                <div className={styles.textUpload}>
                  <UploadImage
                    content="Choose file"
                    name="adhaarCard"
                    getResponse={(resp) => this.handleGetUpLoad(resp)}
                  />
                </div>
              ) : (
                <div className={styles.viewUpLoadData}>
                  <a
                    href={urlFile ? urlFile.url : ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewUpLoadDataURL}
                  >
                    fileName
                  </a>
                  <p className={styles.viewUpLoadDataText}>Uploaded</p>
                  <img
                    src={cancelIcon}
                    alt=""
                    onClick={this.handleCanCelIcon}
                    className={styles.viewUpLoadDataIconCancel}
                  />
                </div>
              )}
            </>
          </div>

          {urlFile !== '' ? (
            <Form.Item label="Adhaar Card:" className={styles.labelUpload}>
              <a
                href={urlFile ? urlFile.url : ''}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlUpload}
              >
                {splitURL}
              </a>
            </Form.Item>
          ) : (
            ''
          )}
          <Form.Item
            label="UAN Number"
            name="uanNumber"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={handleCancel}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              loading={loading}
            >
              Save
            </Button>
          </div>
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
