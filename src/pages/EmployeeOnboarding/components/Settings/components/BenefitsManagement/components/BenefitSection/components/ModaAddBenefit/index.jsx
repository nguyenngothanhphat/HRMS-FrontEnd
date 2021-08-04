import React, { Component } from 'react';
import {
  message,
  Button,
  Spin,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Upload,
  Tooltip,
} from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';

import CalendarIcon from '@/assets/calendar-v2.svg';
import AttachmentIcon from '@/assets/attachment.svg';
import TrashIcon from '@/assets/trash.svg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';

import styles from './index.less';

const { Option } = Select;
const formatDate = 'YYYY-MM-DD';
const { Dragger } = Upload;

@connect(({ onboardingSettings: { listBenefitDefault = [] } = {}, loading }) => ({
  listBenefitDefault,
  loadingFetchListBenefitDefault: loading.effects['onboardingSettings/fetchListBenefitDefault'],
  loadingUploadAttachment: loading.effects['upload/uploadFile'],
  loadingAddDocument: loading.effects['onboardingSettings/addBenefit'],
}))
class ModalAddBenefit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deductionDate: '',
      validTill: '',
      listBenefitCategory: [],
      uploadedFileList: [],
      fileNameList: [],
    };
  }

  componentDidMount = () => {
    this.getInitValueByActiveTab();
  };

  componentDidUpdate = (prevProps) => {
    const { listBenefitDefault = [], activeKeyTab } = this.props;
    if (
      JSON.stringify(prevProps.listBenefitDefault) !== JSON.stringify(listBenefitDefault) ||
      JSON.stringify(prevProps.activeKeyTab) !== JSON.stringify(activeKeyTab)
    ) {
      this.getInitValueByActiveTab();
    }
  };

  identifyImageOrPdf = (fileNameList) => {
    const parts = fileNameList.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'webp':
      case 'tiff':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      case 'doc':
      case 'docx':
        return 2;

      default:
        return 0;
    }
  };

  onChangeBenefitType = (value) => {
    const { listBenefitDefault = [] } = this.props;

    let getListBenefit = listBenefitDefault.map((item) => {
      if (item.benefitType === value) {
        return item.benefitCategory;
      }
      return null;
    });

    getListBenefit = getListBenefit.filter((item) => item !== null);

    if (getListBenefit) {
      this.setState({ listBenefitCategory: getListBenefit[0] });
    }
  };

  getInitValueByActiveTab = () => {
    const { activeKeyTab, listBenefitDefault = [] } = this.props;
    const key = +activeKeyTab - 1;
    let defaultCategoryList = [];

    listBenefitDefault.forEach((item, index) => {
      if (key === index) {
        defaultCategoryList = item.benefitCategory;
      }
    });

    this.setState({ listBenefitCategory: defaultCategoryList });
  };

  destroyOnClose = () => {
    const { handleCandelModal = () => {} } = this.props;
    handleCandelModal();
  };

  handlePreview = (nameFile, idFile) => {
    const { fileNameList } = this.state;
    const arrFileName = [...fileNameList];
    arrFileName.push({ nameFile, idFile });

    this.setState({
      fileNameList: arrFileName,
    });
  };

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      this.identifyImageOrPdf(file.name) === 0 || this.identifyImageOrPdf(file.name) === 1;
    if (!checkType) {
      message.error('You can only upload image and PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }
    setTimeout(() => {
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }, 2000);
    return checkType && isLt5M;
  };

  handleUpload = (file) => {
    const { dispatch } = this.props;
    const { uploadedFileList } = this.state;
    const arrFile = [...uploadedFileList];
    const formData = new FormData();
    formData.append('uri', file);

    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      const { data = [] } = resp;
      const fileUploaded = data.length > 0 ? data[0] : {};
      arrFile.push(fileUploaded);
      const { name = '', id } = fileUploaded;

      this.setState({ uploadedFileList: arrFile });
      this.handlePreview(name, id);
    });
  };

  handleRemove = (idFile) => {
    const { uploadedFileList = [], fileNameList = [] } = this.state;
    const filterUploadedFile = uploadedFileList.filter((item) => item.id !== idFile);
    const filterFileName = fileNameList.filter((item) => item.idFile !== idFile);

    this.setState({ uploadedFileList: filterUploadedFile, fileNameList: filterFileName });
  };

  onValuesChange = (value) => {
    if ('deductionDate' in value) {
      const deductionDate = moment(value.deductionDate).format(formatDate);
      this.setState({ deductionDate });
    }

    if ('validTill' in value) {
      const validTill = moment(value.validTill).format(formatDate);
      this.setState({ validTill });
    }
  };

  onFinish = (value) => {
    const { countryId, dispatch, handleCandelModal = () => {} } = this.props;
    const { validTill, deductionDate, uploadedFileList = [] } = this.state;

    const documents = uploadedFileList?.map((item) => {
      const { id = '', url = '', name = '' } = item;
      return {
        attachment: id,
        attachmentName: name,
        attachmentUrl: url,
      };
    });

    const payload = {
      ...value,
      validTill,
      deductionDate,
      country: countryId,
      documents,
    };

    if (!isEmpty(uploadedFileList)) {
      dispatch({
        type: 'onboardingSettings/addBenefit',
        payload,
      }).then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.setState({ uploadedFileList: [], fileNameList: [] });
          handleCandelModal();
        }
      });
    } else {
      message.error('Please choose file');
    }
  };

  getValueField = (activeKeyTab) => {
    const { listBenefitDefault = [] } = this.props;
    const key = +activeKeyTab - 1;
    let defaultType = null;

    listBenefitDefault.forEach((item, index) => {
      if (key === index) {
        defaultType = item.benefitType;
      }
    });
    return defaultType;
  };

  render() {
    const {
      visible = false,
      loadingFetchListBenefitDefault = false,
      loadingUploadAttachment = false,
      listBenefitDefault = [],
      activeKeyTab,
      loadingAddDocument,
    } = this.props;

    const valueType = this.getValueField(activeKeyTab, 'type');

    const { listBenefitCategory, fileNameList } = this.state;

    return (
      <Modal
        visible={visible}
        className={styles.addBenefitModal}
        title={false}
        onCancel={this.destroyOnClose}
        destroyOnClose={this.destroyOnClose}
        footer={false}
      >
        <div className={styles.addBenefit}>
          <div className={styles.addBenefit__header}>
            <div className={styles.addBenefit__header__title}>Add a Benefit</div>
          </div>
          {loadingFetchListBenefitDefault ? (
            <div className={styles.loadingModal}>
              <Spin />
            </div>
          ) : (
            <Form
              initialValues={{ type: valueType }}
              onFinish={this.onFinish}
              onValuesChange={this.onValuesChange}
            >
              <div className={styles.addBenefit__body}>
                <div className={styles.addBenefit__body_label}>Benefit Type</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item
                    name="type"
                    rules={[
                      {
                        required: true,
                        message: 'Please input field Benefit Type!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      allowClear
                      suffixIcon={null}
                      placeholder="Select benefit type"
                      onChange={this.onChangeBenefitType}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {listBenefitDefault.map((item) => (
                        <Option key={item.benefitType} value={item.benefitType}>
                          {item.benefitType}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Benefit Category</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: 'Please input field Benefit Category!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      allowClear
                      suffixIcon={null}
                      placeholder="Select benefit category"
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {listBenefitCategory.map((item) => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Name of the Benefit Plan</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        pattern: /^[\W\S_]{0,120}$/,
                        message: 'Only fill up to 120 characters !',
                      },
                      {
                        required: true,
                        message: 'Please input field !',
                      },
                    ]}
                  >
                    <Input placeholder="Type the name of the Benefit Plan" />
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Deduction Date</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="deductionDate">
                    <DatePicker
                      suffixIcon={<img alt="calendar-icon" src={CalendarIcon} />}
                      dropdownClassName={styles.calendar}
                    />
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Annual Cost</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="annualCost">
                    <Select
                      showSearch
                      suffixIcon={<span>₹</span>}
                      allowClear
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {[
                        { value: '10000', name: '10,000' },
                        { value: '15000', name: '15,000' },
                        { value: '20000', name: '20,000' },
                      ].map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Employee Contribution</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="employeeContribution">
                    <Select
                      showSearch
                      suffixIcon={<span>₹</span>}
                      allowClear
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {[
                        { value: '5000', name: '5,000' },
                        { value: '10000', name: '10,000' },
                        { value: '15000', name: '15,000' },
                      ].map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Employer&lsquo;s Contribution</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="employerContribution">
                    <Select
                      showSearch
                      suffixIcon={<span>₹</span>}
                      allowClear
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {[
                        { value: '10000', name: '10,000' },
                        { value: '15000', name: '15,000' },
                        { value: '20000', name: '20,000' },
                      ].map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Valid Till</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="validTill">
                    <DatePicker
                      suffixIcon={<img alt="calendar-icon" src={CalendarIcon} />}
                      dropdownClassName={styles.calendar}
                    />
                  </Form.Item>
                </div>
                <div className={styles.documentSection}>
                  <Dragger
                    beforeUpload={this.beforeUpload}
                    showUploadList={false}
                    action={(file) => this.handleUpload(file)}
                    multiple
                  >
                    {isEmpty(fileNameList) ? (
                      <>
                        {loadingUploadAttachment ? (
                          <Spin />
                        ) : (
                          <div className={styles.chooseFile}>
                            <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
                            <span className={styles.chooseFileText}>Choose file</span>
                            <span className={styles.uploadText}>or drop file here</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={styles.fileUploadedContainer}>
                        <div className={styles.dragAndDrop}>
                          <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
                          <span className={styles.chooseFileText}>Choose file</span>
                          <span className={styles.uploadText}>or drop file here</span>
                        </div>
                      </div>
                    )}
                  </Dragger>
                  <>
                    {fileNameList.map((item) => (
                      <div className={styles.fileUploadedContainer__listFiles}>
                        <div className={styles.fileUploadedContainer__listFiles__files}>
                          <p className={styles.previewIcon}>
                            {this.identifyImageOrPdf(item.nameFile) === 1 ? (
                              <img src={PDFIcon} alt="pdf" />
                            ) : (
                              <img src={ImageIcon} alt="img" />
                            )}
                          </p>
                          <p className={styles.fileName}>
                            Uploaded: <a>{item.nameFile}</a>
                          </p>
                        </div>
                        <Tooltip title="Remove">
                          <img
                            onClick={() => this.handleRemove(item.idFile)}
                            className={styles.trashIcon}
                            src={TrashIcon}
                            alt="remove"
                          />
                        </Tooltip>
                      </div>
                    ))}
                  </>
                </div>
              </div>
              <div className={styles.addBenefit__bottom}>
                <Button
                  onClick={this.destroyOnClose}
                  className={`${styles.addBenefit__bottom_btn} ${styles.cancelBtn}`}
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  className={`${styles.addBenefit__bottom_btn} ${styles.addBtn}`}
                  loading={loadingAddDocument}
                >
                  Add
                </Button>
              </div>
            </Form>
          )}
        </div>
      </Modal>
    );
  }
}

export default ModalAddBenefit;
