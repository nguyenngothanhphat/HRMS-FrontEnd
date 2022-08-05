import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import UploadIcon from '@/assets/faqPage/upload.svg';
import UrlIcon from '@/assets/faqPage/urlIcon.svg';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
@connect(
  ({
    loading,
    faqs: { listCategory = [], listFAQ = [], selectedCountry } = {},
    user: { currentUser: { employee: { _id: employeeId = '' } = {} } = {} },
  }) => ({
    loadingGetList: loading.effects['faqs/fetchListCategory'],
    loadingAddQuestion: loading.effects['faqs/addQuestion'],
    listCategory,
    employeeId,
    listFAQ,
    selectedCountry,
  }),
)
class AddQuestionAnswer extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = { isImg: false, showLink: true, showUpload: true, uploadFile: {} };
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  onValuesChange = (_, allValues) => {
    const { upFile, upLink } = allValues;
    upFile?.length ? this.setState({ showLink: false }) : this.setState({ showLink: true });
    upLink ? this.setState({ showUpload: false }) : this.setState({ showUpload: true });
  };

  getValueFromEvent = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  beforeUpload = (file) => {
    const fileRegex = /image[/](jpg|jpeg|png)|video[/]|application[/]pdf/gim;
    const checkType = fileRegex.test(file.type);
    if (!checkType) {
      message.error('You can only upload png, jpg, jpeg, video and pdf files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return (checkType && isLt5M) || Upload.LIST_IGNORE;
  };

  // isImageLink = (url) =>
  //   new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = url;
  //     img.onload = () => resolve(true);
  //     img.onerror = () => resolve(false);
  //   }).then((x) => this.setState({ isImg: x }));

  // onChange = (e) => this.isImageLink(e.target.value);

  onFinish = async ({ FaqCategory, question, answer, upLink }, first = {}) => {
    const { dispatch, employeeId = '', onClose = () => {}, selectedCountry = '' } = this.props;
    dispatch({
      type: 'faqs/addQuestion',
      payload: {
        categoryId: FaqCategory,
        employeeId,
        question,
        answer,
        country: [selectedCountry],
        url: upLink,
        attachment: first?.id || null,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
        dispatch({
          type: 'faqs/fetchListFAQ',
          payload: {
            country: [selectedCountry],
          },
        });
        this.setState({ showLink: true, showUpload: true });
      }
    });
  };

  onUpload = (...rest) => {
    const { dispatch } = this.props;
    const { uploadFile, showLink } = this.state;
    const formData = new FormData();
    formData.append('uri', showLink ? null : uploadFile);
    if (!showLink)
      dispatch({
        type: 'upload/uploadFile',
        payload: formData,
        showNotification: false,
      }).then((resp) => {
        const { statusCode: status, data = [] } = resp;
        if (status === 200) {
          const [first] = data;
          this.onFinish(...rest, first);
        }
      });
    else this.onFinish(...rest);
  };

  render() {
    const { visible, loadingAdd, listCategory = [], listFAQ = [] } = this.props;
    const { showLink, showUpload } = this.state;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Add Question</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form
            name="Add FAQ"
            id="addForm"
            ref={this.formRef}
            onFinish={this.onUpload}
            onValuesChange={this.onValuesChange}
          >
            <Form.Item
              rules={[{ required: true, message: 'Please name Categories' }]}
              label="FAQ Categories"
              name="FaqCategory"
              labelCol={{ span: 24 }}
            >
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listCategory.map((val) => (
                  <Option value={val._id}>{val.category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Question"
              name="question"
              labelCol={{ span: 24 }}
              rules={[
                { required: true, message: 'Please enter question Name' },
                () => ({
                  validator(_, value) {
                    const duplicate = listFAQ.find((val) => val.question === value);
                    if (duplicate) {
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject('Question name is exist ');
                    }
                    // eslint-disable-next-line compat/compat
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Answer" name="answer" labelCol={{ span: 24 }}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Upload Media File"
              name="upFile"
              labelCol={{ span: 24 }}
              getValueFromEvent={this.getValueFromEvent}
            >
              <Dragger
                listType="picture"
                className={styles.fileUploadForm}
                maxCount={1}
                disabled={!showUpload}
                beforeUpload={this.beforeUpload}
                // fileList={[...defaultFileList]}
                action={(file) => this.setState({ uploadFile: file })}
              >
                <div className={styles.drapperBlock}>
                  <img src={UploadIcon} alt="upload" />
                  <span className={styles.uploadText}>Drag & drop your file here</span>
                  <p className={styles.text}>
                    or <span className={styles.browseText}>browse</span> to upload a file
                  </p>
                </div>
              </Dragger>
            </Form.Item>
            <div className={styles.separator}>OR</div>
            <Form.Item label="Upload File by URL" name="upLink" labelCol={{ span: 24 }}>
              <Input
                disabled={!showLink}
                className={styles.urlInput}
                placeholder="Type your media link here"
                prefix={<img src={UrlIcon} alt="url Icon" />}
                // onChange={this.onChange}
              />
            </Form.Item>
          </Form>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.AddQuestionAnswer} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={696}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                form="addForm"
                key="submit"
                htmlType="submit"
                loading={loadingAdd}
              >
                Add Question
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default AddQuestionAnswer;
