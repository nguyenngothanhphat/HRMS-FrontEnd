import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import UploadIcon from '@/assets/faqPage/upload.svg';
import UrlIcon from '@/assets/faqPage/urlIcon.svg';
import uploadFirebase from '@/services/firebase';
import styles from './index.less';

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
    loadingUpload: loading.effects['upload/addAttachment'],
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
    this.state = { showLink: true, showUpload: true, uploadFile: {} };
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
    const fileRegex = /image[/](gif|jpg|jpeg|png)|video[/]/gim;
    const checkType = fileRegex.test(file.type);
    if (!checkType) {
      message.error('You can only upload png, jpg, jpeg and video files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return (checkType && isLt5M) || Upload.LIST_IGNORE;
  };

  onFinish = async ({ FaqCategory, question, answer, upLink }, data = []) => {
    const { dispatch, employeeId = '', onClose = () => {}, selectedCountry = '' } = this.props;
    const [first] = data;
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
            page: 1,
            limit: 10,
          },
        });
        this.setState({ showLink: true, showUpload: true });
      }
    });
  };

  onUpload = async (...rest) => {
    const { dispatch } = this.props;
    const { uploadFile, showLink, showUpload } = this.state;
    const [first] = rest;
    let file = {};

    if (!showLink) {
      file = await uploadFirebase({ file: uploadFile, typeFile: 'ATTACHMENT' });
    } else if (!showUpload) {
      file = {
        category: 'URL',
        url: first.upLink,
      };
    }
    if (Object.keys(file)?.length) {
      dispatch({
        type: 'upload/addAttachment',
        payload: { attachments: [file] },
        showNotification: false,
      }).then((resp) => {
        const { statusCode: status, data = {} } = resp;
        if (status === 200) {
          this.onFinish(...rest, data);
        }
      });
    } else {
      this.onFinish(...rest);
    }
  };

  render() {
    const {
      visible,
      loadingAddQuestion,
      loadingUpload,
      listCategory = [],
      listFAQ = [],
    } = this.props;
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
            <Form.Item
              label="Upload File by URL"
              name="upLink"
              labelCol={{ span: 24 }}
              rules={[
                {
                  pattern: /(http(s?):\/\/[^\s]+)/g,
                  message: 'URL is invalid',
                },
              ]}
            >
              <Input
                disabled={!showLink}
                className={styles.urlInput}
                placeholder="Type your media link here"
                prefix={<img src={UrlIcon} alt="url Icon" />}
                allowClear
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
                loading={loadingAddQuestion || loadingUpload}
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
