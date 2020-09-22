import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Radio } from 'antd';
import { connect, formatMessage } from 'umi';
import UploadImage from '@/components/UploadImage';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import styles from './index.less';

@connect(
  ({
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    generalDataOrigin,
    generalData,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { upFile: '' };
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

  handleUpLoadFile = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      this.setState({ upFile: first.url });
    }
  };

  handleCanCelIcon = () => {
    const { dispatch } = this.props;
    this.setState({ upFile: '' });
    dispatch({
      type: 'upload/uploadFile',
    });
  };

  render() {
    const { generalData } = this.props;
    const { upFile } = this.state;
    const {
      legalName = '',
      DOB = '',
      legalGender = '',
      employeeId = '',
      workEmail = '',
      workNumber = '',
      adhaarCardNumber = '',
      uanNumber = '',
    } = generalData;
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
    const splitURL = upFile.split('/');
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
              {upFile === '' ? (
                <div className={styles.textUpload}>
                  <UploadImage content="Choose file" getResponse={this.handleUpLoadFile} />
                </div>
              ) : (
                <div className={styles.viewUpLoadData}>
                  <a
                    href={upFile}
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

          {upFile !== '' ? (
            <Form.Item label="Adhaar Card:" className={styles.labelUpload}>
              <a
                href={upFile}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlUpload}
              >
                {splitURL[6]}
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
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
