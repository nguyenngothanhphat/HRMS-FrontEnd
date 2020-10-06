import React, { Fragment, Component } from 'react';
import { Col, DatePicker, Form, Input, Select } from 'antd';
import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import UploadImage from '@/components/UploadImage';
import moment from 'moment';
// import debounce from 'lodash/debounce';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import styles from '../../index.less';

@connect(
  ({
    loading,
    upload: { urlImage = '', visa0URL = '', visa1URL = '' },
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
    visa0URL,
    visa1URL,
    urlImage,
  }),
)
class VisaGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownEntry: false,
      dropdownCountry: false,
      dropdownType: false,
      listItem: [{}],
    };
    // this.handleFieldChange = debounce(this.handleFieldChange, 600);
  }

  handleAddBtn = () => {
    const { visaData, dispatch } = this.props;
    const newList = [...visaData, {}];
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { visaData: newList },
    });
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

  handleCanCelIcon = (index) => {
    const { dispatch, visaDataOrigin, visaData } = this.props;
    const item = visaData[index];
    const newItem = { ...item, urlFile: '' };
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

  handleGetUpLoad = (index, resp) => {
    const { data = [] } = resp;
    const [first] = data;
    const value = { url: first.url, id: first.id };
    this.handleFieldChange(index, 'urlFile', value);
  };

  handleNameDataUpload = (url) => {
    const split1URL = url.split('/');
    const nameData1URL = split1URL[split1URL.length - 1];
    return nameData1URL;
  };

  render() {
    const { Option } = Select;
    const { dropdownCountry, dropdownType, dropdownEntry, listItem } = this.state;
    const { countryList, visa0URL, visa1URL, visaData } = this.props;
    const formatCountryList = countryList.map((item) => {
      const { _id: value, name } = item;
      return {
        value,
        name,
      };
    });
    const dateFormat = 'Do MMM YYYY';
    return (
      <>
        {visaData.length === 0
          ? listItem.map((item, index) => {
              return (
                <Fragment key={`edit${index + 1}`}>
                  <div className={styles.line} />
                  <div className={styles.styleUpLoad}>
                    <Form.Item
                      key={`visaNumber${index + 1}`}
                      label="Visa Number"
                      name={`visaNumber${index}`}
                      rules={[
                        {
                          pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                          message: formatMessage({
                            id: 'pages.employeeProfile.validateWorkNumber',
                          }),
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
                    {(visa0URL === '' && index === 0) || (visa1URL === '' && index === 1) ? (
                      <div className={styles.textUpload}>
                        <UploadImage
                          content="Choose file"
                          name={`visa${index}`}
                          getResponse={(resp) => this.handleGetUpLoad(index, resp)}
                        />
                      </div>
                    ) : (
                      <div className={styles.viewUpLoadData}>
                        <a
                          href={index === 0 ? visa0URL : visa1URL}
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
                          onClick={() => this.handleCanCelIcon(index)}
                          className={styles.viewUpLoadDataIconCancel}
                        />
                      </div>
                    )}
                  </div>
                  {(visa0URL !== '' && index === 0) || (visa1URL !== '' && index === 1) ? (
                    <Form.Item label="Visa:" className={styles.labelUpload}>
                      <a
                        href={index === 0 ? visa0URL : visa1URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.urlUpload}
                      >
                        {this.handleNameDataUpload(index)}
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
                      onDropdownVisibleChange={(open) =>
                        this.handleDropdown('visaIssuedCountry', open)
                      }
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
            })
          : visaData.map((item, index) => {
              return (
                <Fragment key={`visa${index + 1}`}>
                  <div className={styles.line} />
                  <div className={styles.styleUpLoad}>
                    <Form.Item
                      label="Visa Number"
                      name={`visaNumber${index + 1}`}
                      rules={[
                        {
                          pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                          message: formatMessage({
                            id: 'pages.employeeProfile.validateWorkNumber',
                          }),
                        },
                      ]}
                    >
                      <Input
                        defaultValue={item.visaNumber}
                        className={styles.inputForm}
                        onChange={(event) => {
                          const { value: fieldValue } = event.target;
                          this.handleFieldChange(index, 'visaNumber', fieldValue);
                        }}
                      />
                    </Form.Item>
                    {!item.urlFile ? (
                      <div className={styles.textUpload}>
                        <UploadImage
                          content="Choose file"
                          name={`visa${index}`}
                          getResponse={(resp) => this.handleGetUpLoad(index, resp)}
                        />
                      </div>
                    ) : (
                      <div className={styles.viewUpLoadData}>
                        <a
                          href={item.urlFile.url}
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
                          onClick={() => this.handleCanCelIcon(index)}
                          className={styles.viewUpLoadDataIconCancel}
                        />
                      </div>
                    )}
                  </div>
                  {item.urlFile ? (
                    <Form.Item label="Visa:" className={styles.labelUpload}>
                      <a
                        href={item.urlFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.urlUpload}
                      >
                        {this.handleNameDataUpload(item.urlFile.url)}
                      </a>
                    </Form.Item>
                  ) : (
                    ''
                  )}
                  <Form.Item label="Visa Type" name={`visaType${index + 1}`}>
                    <Select
                      defaultValue={item.visaType}
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
                  <Form.Item label="Country" name={`visaIssuedCountry${index + 1}`}>
                    <Select
                      defaultValue={item.visaIssuedCountry ? item.visaIssuedCountry.name : ''}
                      className={styles.selectForm}
                      onDropdownVisibleChange={(open) =>
                        this.handleDropdown('visaIssuedCountry', open)
                      }
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
                  <Form.Item label="Entry Type" name={`visaEntryType${index + 1}`}>
                    <Select
                      defaultValue={item.visaEntryType}
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
                  <Form.Item label="Issued On" name={`visaIssuedOn${index + 1}`}>
                    <DatePicker
                      defaultValue={item.visaIssuedOn ? moment(item.visaIssuedOn) : ''}
                      format={dateFormat}
                      onChange={(dates) => {
                        this.handleFieldChange(index, 'visaIssuedOn', dates);
                      }}
                      className={styles.dateForm}
                    />
                  </Form.Item>
                  <Form.Item label="Valid Till" name={`visaValidTill${index + 1}`}>
                    <DatePicker
                      defaultValue={item.visaValidTill ? moment(item.visaValidTill) : ''}
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
