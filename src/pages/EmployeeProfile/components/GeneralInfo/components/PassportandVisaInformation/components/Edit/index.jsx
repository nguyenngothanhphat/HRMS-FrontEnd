import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Select } from 'antd';
import { connect, formatMessage } from 'umi';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
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
    this.state = { upFile: '', dropdown: false };
  }

  handleDropdown = (open) => {
    this.setState({ dropdown: open });
  };

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
    const { Option } = Select;
    const { generalData } = this.props;
    const { upFile } = this.state;
    const splitURL = upFile.split('/');
    const {
      passportNo = '',
      passportIssueCountry = '',
      passportIssueOn = '',
      passportValidTill = '',
      visaNo = '',
      visaType = '',
      visaCountry = '',
      visaEntryType = '',
      visaIssuedOn = '',
      visaValidTill = '',
    } = generalData;
    const { dropdown } = this.state;
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
    const formatDatePassportIssueOn = passportIssueOn && moment(passportIssueOn);
    const formatDatePassportValidTill = passportValidTill && moment(passportValidTill);
    const formatDateVisaIssuedOn = visaIssuedOn && moment(visaIssuedOn);
    const formatDateVisaValidTill = visaValidTill && moment(visaValidTill);
    const dateFormat = 'Do MMM YYYY';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={{
            passportNo,
            passportIssueCountry,
            passportIssueOn: formatDatePassportIssueOn,
            passportValidTill: formatDatePassportValidTill,
            visaNo,
            visaType,
            visaCountry,
            visaEntryType,
            visaIssuedOn: formatDateVisaIssuedOn,
            visaValidTill: formatDateVisaValidTill,
          }}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
        >
          <div className={styles.styleUpLoad}>
            <Form.Item
              label="Passport Number"
              name="passportNo"
              rules={[
                {
                  pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                  message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
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
          </div>
          {upFile !== '' ? (
            <Form.Item label="Uploaded file:" className={styles.labelUpload}>
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
          <Form.Item label="Issued Country" name="passportIssueCountry">
            <Select
              allowClear
              className={styles.selectForm}
              onDropdownVisibleChange={this.handleDropdown}
              suffixIcon={
                dropdown ? (
                  <UpOutlined className={styles.arrowUP} />
                ) : (
                  <DownOutlined className={styles.arrowDown} />
                )
              }
            >
              <Option value="India">India</Option>
              <Option value="USA">USA</Option>
              <Option value="VietNam">Viet Nam</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Issued On" name="passportIssueOn">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
          <Form.Item label="Valid Till" name="passportValidTill">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>

          <div className={styles.line} />
          <div className={styles.styleUpLoad}>
            <Form.Item
              label="Visa Number"
              name="visaNo"
              rules={[
                {
                  pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                  message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                },
              ]}
            >
              <Input className={styles.inputForm} />
            </Form.Item>
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
          </div>
          {upFile !== '' ? (
            <Form.Item label="Visa:" className={styles.labelUpload}>
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
          <Form.Item label="Visa Type" name="visaType">
            <Select
              allowClear
              className={styles.selectForm}
              onDropdownVisibleChange={this.handleDropdown}
              suffixIcon={
                dropdown ? (
                  <UpOutlined className={styles.arrowUP} />
                ) : (
                  <DownOutlined className={styles.arrowDown} />
                )
              }
            >
              <Option value="India">B1</Option>
              <Option value="nothing">nothing...</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Country" name="visaCountry">
            <Select
              allowClear
              className={styles.selectForm}
              onDropdownVisibleChange={this.handleDropdown}
              suffixIcon={
                dropdown ? (
                  <UpOutlined className={styles.arrowUP} />
                ) : (
                  <DownOutlined className={styles.arrowDown} />
                )
              }
            >
              <Option value="India">India</Option>
              <Option value="USA">USA</Option>
              <Option value="VietNam">Viet Nam</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Entry Type" name="visaEntryType">
            <Select
              allowClear
              className={styles.selectForm}
              onDropdownVisibleChange={this.handleDropdown}
              suffixIcon={
                dropdown ? (
                  <UpOutlined className={styles.arrowUP} />
                ) : (
                  <DownOutlined className={styles.arrowDown} />
                )
              }
            >
              <Option value="India">Single Entry</Option>
              <Option value="nothing">nothing....</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Issued On" name="visaIssuedOn">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
          <Form.Item label="Valid Till" name="visaValidTill">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
