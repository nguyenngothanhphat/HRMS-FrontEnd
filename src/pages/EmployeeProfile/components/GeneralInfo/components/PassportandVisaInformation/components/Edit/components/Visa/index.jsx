import React, { Fragment, Component } from 'react';
import { Col, DatePicker, Form, Input, Select, Spin, Tag } from 'antd';
import { DownOutlined, PlusOutlined, UpOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import moment from 'moment';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import ModalReviewImage from '@/components/ModalReviewImage';
import UploadImage from '../../../UploadImage';
import styles from '../../index.less';

@connect(
  ({
    loading,
    upload: { urlImage = '', visa0URL = '', visa1URL = '', loadingVisaTest = [] },
    employeeProfile: {
      idCurrentEmployee,
      countryList,
      originData: { passportData: passportDataOrigin = {}, visaData: visaDataOrigin = [] } = {},
      tempData: { passportData = {}, generalData = {}, visaData = [] } = {},
    } = {},
  }) => ({
    loading: loading.effects['upload/uploadFile'],
    countryList,
    passportDataOrigin,
    passportData,
    generalData,
    visaDataOrigin,
    visaData,
    visa0URL,
    visa1URL,
    urlImage,
    idCurrentEmployee,
    loadingVisaTest,
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
      checkValidate: [{}],
      formCheck: [],
      visible: false,
      linkImage: '',
    };
    // this.handleFieldChange = debounce(this.handleFieldChange, 600);
  }

  handleOpenModalReview = (linkImage) => {
    this.setState({
      visible: true,
      linkImage,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      linkImage: '',
    });
  };

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

  validateDate = (newList, index) => {
    const { formCheck } = this.state;
    const { checkArrayVisa, visaData } = this.props;
    if (newList === []) return;
    const itemVisa = visaData[index];
    const item = newList[index];

    const formatDateVisaIssueOn = itemVisa
      ? itemVisa.visaIssuedOn && moment(itemVisa.visaIssuedOn)
      : '';
    const DateVisaIssueOn = item.visaIssuedOn && moment(item.visaIssuedOn);
    const formatDateVisaValidTill = itemVisa
      ? itemVisa.visaValidTill && moment(itemVisa.visaValidTill)
      : '';
    const DateVisaValidTill = item.visaValidTill && moment(item.visaValidTill);
    const IssuedOn = DateVisaIssueOn || formatDateVisaIssueOn;
    const ValidTill = DateVisaValidTill || formatDateVisaValidTill;

    if (IssuedOn > ValidTill) {
      const getCheck = [...formCheck];
      const setValidate = false;
      getCheck.splice(index, 1, setValidate);
      checkArrayVisa(getCheck);
      this.setState({ formCheck: getCheck });
    } else {
      const getCheck = [...formCheck];
      const setValidate = true;
      getCheck.splice(index, 1, setValidate);
      checkArrayVisa(getCheck);
      this.setState({ formCheck: getCheck });
    }
  };

  handleFieldChange = (index, nameField, fieldValue) => {
    const { dispatch, visaDataOrigin, visaData } = this.props;
    const item = visaData[index];
    const newItem = { ...item, [nameField]: fieldValue };
    const newList = [...visaData];
    newList.splice(index, 1, newItem);
    this.validateDate(newList, index);
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
    const value = { id: first.id, url: first.url };
    this.handleFieldChange(index, 'urlFile', value);
  };

  handleNameDataUpload = (url) => {
    const split1URL = url.split('/');
    const nameData1URL = split1URL[split1URL.length - 1];
    return nameData1URL;
  };

  handleGetSetSizeImage = (index, isLt5M) => {
    const { checkValidate } = this.state;
    const item = checkValidate[index];
    const newItem = { ...item, isLt5M };
    const newList = [...checkValidate];
    newList.splice(index, 1, newItem);
    this.setState({ checkValidate: newList });
  };

  handleShowContent = (index, checkValidate) => {
    const { setConfirmContent = () => {} } = this.props;
    const setContent = checkValidate[index];
    setConfirmContent(setContent);
    if (setContent) {
      if (setContent.isLt5M === false) {
        return 'Retry';
      }
      return 'Choose file';
    }
    return 'Choose file';
  };

  handleSetClass = (index, checkValidate, form, formValidate) => {
    const setClass = checkValidate[index];
    if (setClass) {
      if (setClass.isLt5M === false) {
        return formValidate;
      }
      return form;
    }
    return form;
  };

  tagRender = (props) => {
    const { label, onClose } = props;
    return (
      <Tag
        icon={<CloseCircleOutlined className={styles.iconClose} onClick={onClose} />}
        color="red"
      >
        {label}
      </Tag>
    );
  };

  render() {
    const { Option } = Select;
    const {
      dropdownCountry,
      dropdownType,
      dropdownEntry,
      listItem,
      checkValidate,
      formCheck,
      visible,
      linkImage,
    } = this.state;
    const { countryList, visa0URL, visa1URL, visaData, loading, loadingVisaTest } = this.props;
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
                          pattern: /^[+]*[\d]{0,12}$/,
                          message: formatMessage({
                            id: 'pages.employeeProfile.validateNumber',
                          }),
                        },
                      ]}
                    >
                      <Input
                        defaultValue={item.name}
                        className={this.handleSetClass(
                          index,
                          checkValidate,
                          styles.inputForm,
                          styles.inputFormImageValidate,
                        )}
                        onChange={(event) => {
                          const { value: fieldValue } = event.target;
                          this.handleFieldChange(index, 'visaNumber', fieldValue);
                        }}
                      />
                    </Form.Item>
                    {(visa0URL === '' && index === 0) || (visa1URL === '' && index === 1) ? (
                      <div className={styles.textUpload}>
                        {loadingVisaTest[index] === false ||
                        loadingVisaTest[index] === undefined ? (
                          <UploadImage
                            content={this.handleShowContent(index, checkValidate)}
                            setSizeImageMatch={(isLt5M) =>
                              this.handleGetSetSizeImage(index, isLt5M)}
                            getResponse={(resp) => this.handleGetUpLoad(index, resp)}
                            loading={loading}
                            name="visa"
                            index={index}
                          />
                        ) : (
                          <Spin loading={loadingVisaTest[index]} active="true" />
                        )}
                        {/* <UploadImage
                          content={this.handleShowContent(index, checkValidate)}
                          name={`visa${index}`}
                          setSizeImageMatch={(isLt5M) => this.handleGetSetSizeImage(index, isLt5M)}
                          getResponse={(resp) => this.handleGetUpLoad(index, resp)}
                          loading={loading}
                        /> */}
                      </div>
                    ) : (
                      <div className={styles.viewUpLoadData}>
                        <p
                          onClick={() =>
                            this.handleOpenModalReview(index === 0 ? visa0URL : visa1URL)}
                          className={styles.viewUpLoadDataURL}
                        >
                          fileName
                        </p>
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
                      <p
                        onClick={() =>
                          this.handleOpenModalReview(index === 0 ? visa0URL : visa1URL)}
                        className={styles.urlUpload}
                      >
                        {this.handleNameDataUpload(index)}
                      </p>
                    </Form.Item>
                  ) : (
                    ''
                  )}
                  <Form.Item label="Visa Type" name={`visaType${index}`}>
                    <Select
                      className={styles.selectForm}
                      tagRender={this.tagRender}
                      mode="multiple"
                      showArrow
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                      <Option value="B2">B2</Option>
                      <Option value="B3">B3</Option>
                      <Option value="nothing">nothing...</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Country" name={`visaIssuedCountry${index}`}>
                    <Select
                      className={styles.selectForm}
                      onDropdownVisibleChange={(open) =>
                        this.handleDropdown('visaIssuedCountry', open)}
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
                      initialValue={item.visaNumber}
                      label="Visa Number"
                      name={`visaNumber${index + 1}`}
                      rules={[
                        {
                          pattern: /^[+]*[\d]{0,12}$/,
                          message: formatMessage({
                            id: 'pages.employeeProfile.validateNumber',
                          }),
                        },
                      ]}
                    >
                      <Input
                        className={this.handleSetClass(
                          index,
                          checkValidate,
                          styles.inputForm,
                          styles.inputFormImageValidate,
                        )}
                        onChange={(event) => {
                          const { value: fieldValue } = event.target;
                          this.handleFieldChange(index, 'visaNumber', fieldValue);
                        }}
                      />
                    </Form.Item>

                    {!item.urlFile ? (
                      <div className={styles.textUpload}>
                        {loadingVisaTest[index] === false ||
                        loadingVisaTest[index] === undefined ? (
                          <UploadImage
                            content={this.handleShowContent(index, checkValidate)}
                            setSizeImageMatch={(isLt5M) =>
                              this.handleGetSetSizeImage(index, isLt5M)}
                            getResponse={(resp) => this.handleGetUpLoad(index, resp)}
                            loading={loading}
                            name="visa"
                            index={index}
                          />
                        ) : (
                          <Spin loading={loadingVisaTest[index]} active="true" />
                        )}
                      </div>
                    ) : (
                      <div className={styles.viewUpLoadData}>
                        <p
                          onClick={() =>
                            this.handleOpenModalReview(item.urlFile ? item.urlFile.url : '')}
                          className={styles.viewUpLoadDataURL}
                        >
                          fileName
                        </p>
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
                      <p
                        onClick={() =>
                          this.handleOpenModalReview(item.urlFile ? item.urlFile.url : '')}
                        className={styles.urlUpload}
                      >
                        {this.handleNameDataUpload(item.urlFile.url)}
                      </p>
                    </Form.Item>
                  ) : (
                    ''
                  )}
                  <Form.Item
                    label="Visa Type"
                    name={`visaType${index + 1}`}
                    initialValue={item.visaType}
                  >
                    <Select
                      className={styles.selectForm}
                      tagRender={this.tagRender}
                      mode="multiple"
                      showArrow
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                      <Option value="B2">B2</Option>
                      <Option value="B3">B3</Option>
                      <Option value="nothing">nothing...</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Country"
                    name={`visaIssuedCountry${index + 1}`}
                    initialValue={item.visaIssuedCountry ? item.visaIssuedCountry.name : ''}
                  >
                    <Select
                      className={styles.selectForm}
                      onDropdownVisibleChange={(open) =>
                        this.handleDropdown('visaIssuedCountry', open)}
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
                  <Form.Item
                    label="Entry Type"
                    name={`visaEntryType${index + 1}`}
                    initialValue={item.visaEntryType}
                  >
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
                  <Form.Item
                    label="Issued On"
                    name={`visaIssuedOn${index + 1}`}
                    initialValue={item.visaIssuedOn ? moment(item.visaIssuedOn) : ''}
                  >
                    <DatePicker
                      format={dateFormat}
                      onChange={(dates) => {
                        this.handleFieldChange(index, 'visaIssuedOn', dates);
                      }}
                      className={styles.dateForm}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Valid Till"
                    name={`visaValidTill${index + 1}`}
                    validateStatus={formCheck[index] === false ? 'error' : 'success'}
                    help={
                      formCheck[index] === false
                        ? formatMessage({
                            id: 'pages.employeeProfile.validateDate',
                          })
                        : ''
                    }
                    initialValue={item.visaValidTill ? moment(item.visaValidTill) : ''}
                  >
                    <DatePicker
                      format={dateFormat}
                      onChange={(dates) => {
                        this.handleFieldChange(index, 'visaValidTill', dates);
                      }}
                      className={
                        formCheck[index] === false ? styles.dateFormValidate : styles.dateForm
                      }
                    />
                  </Form.Item>
                  <ModalReviewImage
                    visible={visible}
                    handleCancel={this.handleCancel}
                    link={linkImage}
                  />
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
