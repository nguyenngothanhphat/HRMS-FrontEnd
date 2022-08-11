import { Form, Input, message, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AttachmentIcon from '@/assets/attachment.svg';
import UrlIcon from '@/assets/faqPage/urlIcon.svg';
import uploadFirebase from '@/services/firebase';
import styles from './index.less';
import { HELP_TYPE } from '@/utils/helpPage';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const AddQuestionModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    refreshData = () => {},
    dispatch,
    employeeId = '',
    onClose = () => {},
    visible = false,
    loadingGetList = false,
    helpPage: { categoryList = [], helpData = [], selectedCountry = '', helpType = '' } = {},
  } = props;

  const [showLink, setShowLink] = useState(true);
  const [showUpload, setShowUpload] = useState(true);
  const [uploadFile, setUploadFile] = useState({});

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'helpPage/fetchHelpCategoryList',
        payload: {
          country: [selectedCountry],
        },
      });
    }
  }, [visible]);

  const onValuesChange = (_, allValues) => {
    const { upFile, upLink } = allValues;
    setShowLink(!upFile?.length);
    setShowUpload(!upLink);
  };

  const getValueFromEvent = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const beforeUpload = (file) => {
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

  const onFinish = async ({ category, question, answer, upLink }, data = []) => {
    const [first] = data;
    dispatch({
      type: 'helpPage/addQuestion',
      payload: {
        categoryId: category,
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
        refreshData();
        setShowLink(true);
        setShowUpload(true);
      }
    });
  };

  const onUpload = async (...rest) => {
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
          onFinish(...rest, data);
        }
      });
    } else {
      onFinish(...rest);
    }
  };

  return (
    <div className={styles.AddQuestionModalContent}>
      <Form
        name="Add FAQ"
        id="addForm"
        form={form}
        onFinish={onUpload}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          rules={[{ required: true, message: 'Required field!' }]}
          label={helpType === HELP_TYPE.FAQ ? 'FAQ Category' : 'Help Center Category'}
          name="category"
          labelCol={{ span: 24 }}
        >
          <Select
            showSearch
            placeholder="Select the category"
            loading={loadingGetList}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {categoryList.map((val) => (
              <Option value={val._id}>{val.category}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={helpType === HELP_TYPE.FAQ ? 'Question' : 'Topic'}
          name="question"
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Required field!' },
            () => ({
              validator(_, value) {
                const duplicate = helpData.find((val) => val.question === value);
                if (duplicate) {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('This question is exist');
                }
                // eslint-disable-next-line compat/compat
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            placeholder={helpType === HELP_TYPE.FAQ ? 'Enter the question' : 'Enter the topic'}
          />
        </Form.Item>
        {helpType === HELP_TYPE.FAQ ? (
          <Form.Item label="Answer" name="answer" labelCol={{ span: 24 }}>
            <TextArea rows={4} placeholder="Enter the answer" />
          </Form.Item>
        ) : (
          <Form.Item label="Description" name="answer" labelCol={{ span: 24 }}>
            <TextArea rows={4} placeholder="Enter the description" />
          </Form.Item>
        )}
        <Form.Item
          label="Upload Media File"
          name="upFile"
          labelCol={{ span: 24 }}
          getValueFromEvent={getValueFromEvent}
        >
          <Dragger
            listType="picture"
            className={styles.fileUploadForm}
            maxCount={1}
            disabled={!showUpload}
            beforeUpload={beforeUpload}
            // fileList={[...defaultFileList]}
            action={(file) => setUploadFile(file)}
          >
            <div className={styles.drapperBlock}>
              <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
              <span className={styles.chooseFileText}>Choose files</span>
              <span className={styles.uploadText}>or drop files here</span>
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

export default connect(
  ({
    loading,
    user: { currentUser: { employee: { _id: employeeId = '' } = {} } = {} },
    helpPage,
  }) => ({
    loadingGetList: loading.effects['helpPage/fetchHelpCategoryList'],
    employeeId,
    helpPage,
  }),
)(AddQuestionModalContent);
