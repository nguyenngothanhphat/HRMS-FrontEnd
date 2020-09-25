import React, { Fragment, Component } from 'react';
import { Col, DatePicker, Form, Input, Select } from 'antd';
import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import UploadImage from '@/components/UploadImage';
// import moment from 'moment';
// import debounce from 'lodash/debounce';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import styles from '../../index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      countryList,
      originData: { passportData: passportDataOrigin = {}, visaData: visaDataOrigin = [] } = {},
      tempData: { passportData = {}, generalData = {}, visaData = [] } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updatePassPortVisa'],
    countryList,
    passportDataOrigin,
    passportData,
    generalData,
    visaDataOrigin,
    visaData,
  }),
)
class VisaGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upFile: '',
      dropdownEntry: false,
      dropdownCountry: false,
      dropdownType: false,
      listItem: [{}],
    };
    // this.handleFieldChange = debounce(this.handleFieldChange, 600);
  }

  handleAddBtn = () => {
    const { listItem } = this.state;
    const newList = [...listItem, {}];
    this.setState({ listItem: newList });
  };

  handleDropdown = (name, open) => {
    switch (name) {
      case 'visaIssuedCountry':
        this.setState({ dropdownCountry: open });
        break;
      case 'visaEntryType':
        this.setState({ dropdownEntry: open });
        break;
      case 'visaType':
        this.setState({ dropdownType: open });
        break;

      default:
        break;
    }
  };

  handleUpLoadFile = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      this.setState({ upFile: first.url });
    }
  };

  handleCanCelIcon = () => {
    this.setState({ upFile: '' });
  };

  handleFieldChange = (index, nameField, fieldValue) => {
    const { dispatch, visaDataOrigin, visaData } = this.props;
    const item = visaData[index];
    const newItem = { ...item, [nameField]: fieldValue };
    const newList = [...visaData];
    newList.splice(index, 1, newItem);
    const isModified = JSON.stringify(newList) !== JSON.stringify(visaDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { visaData: newList },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  render() {
    const { Option } = Select;
    const { dropdownCountry, dropdownType, dropdownEntry, upFile, listItem } = this.state;
    const { countryList } = this.props;
    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });
    const splitURL = upFile.split('/');
    const dateFormat = 'Do MMM YYYY';
    return (
      <>
        {listItem.map((item, index) => {
          return (
            <Fragment key={`${index + 1}`}>
              <div className={styles.line} />
              <div className={styles.styleUpLoad}>
                <Form.Item
                  label="Visa Number"
                  name={`visaNumber${index}`}
                  rules={[
                    {
                      pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                      message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
                    },
                  ]}
                >
                  <Input
                    defaultValue={item.name}
                    className={styles.inputForm}
                    onChange={(event) => {
                      const { value: fieldValue } = event.target;
                      this.handleFieldChange(index, 'visaNumber', fieldValue);
                    }}
                  />
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
              <Form.Item label="Visa Type" name={`visaType${index}`}>
                <Select
                  className={styles.selectForm}
                  onDropdownVisibleChange={(open) => this.handleDropdown('visaType', open)}
                  onChange={(value) => {
                    this.handleFieldChange(index, 'visaType', value);
                  }}
                  suffixIcon={
                    dropdownType ? (
                      <UpOutlined className={styles.arrowUP} />
                    ) : (
                      <DownOutlined className={styles.arrowDown} />
                    )
                  }
                >
                  <Option value="B1">B1</Option>
                  <Option value="nothing">nothing...</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Country" name={`visaIssuedCountry${index}`}>
                <Select
                  className={styles.selectForm}
                  onDropdownVisibleChange={(open) => this.handleDropdown('visaIssuedCountry', open)}
                  onChange={(value) => {
                    this.handleFieldChange(index, 'visaIssuedCountry', value);
                  }}
                  suffixIcon={
                    dropdownCountry ? (
                      <UpOutlined className={styles.arrowUP} />
                    ) : (
                      <DownOutlined className={styles.arrowDown} />
                    )
                  }
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
              <Form.Item label="Entry Type" name={`visaEntryType${index}`}>
                <Select
                  className={styles.selectForm}
                  onDropdownVisibleChange={(open) => this.handleDropdown('visaEntryType', open)}
                  onChange={(value) => {
                    this.handleFieldChange(index, 'visaEntryType', value);
                  }}
                  suffixIcon={
                    dropdownEntry ? (
                      <UpOutlined className={styles.arrowUP} />
                    ) : (
                      <DownOutlined className={styles.arrowDown} />
                    )
                  }
                >
                  <Option value="Single Entry">Single Entry</Option>
                  <Option value="nothing">nothing....</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Issued On" name={`visaIssuedOn${index}`}>
                <DatePicker
                  format={dateFormat}
                  onChange={(dates) => {
                    this.handleFieldChange(index, 'visaIssuedOn', dates);
                  }}
                  className={styles.dateForm}
                />
              </Form.Item>
              <Form.Item label="Valid Till" name={`visaValidTill${index}`}>
                <DatePicker
                  format={dateFormat}
                  onChange={(dates) => {
                    this.handleFieldChange(index, 'visaValidTill', dates);
                  }}
                  className={styles.dateForm}
                />
              </Form.Item>
            </Fragment>
          );
        })}
        <Col span={9} offset={1} className={styles.addMoreButton}>
          <div onClick={this.handleAddBtn}>
            <PlusOutlined className={styles.addMoreButtonIcon} />
            Add more
          </div>
        </Col>
      </>
    );
  }
}

export default VisaGeneral;
