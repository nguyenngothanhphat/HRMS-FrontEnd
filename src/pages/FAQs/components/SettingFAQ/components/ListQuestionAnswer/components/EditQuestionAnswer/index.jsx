import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import UploadIcon from '@/assets/faqPage/upload.svg';
import UrlIcon from '@/assets/faqPage/urlIcon.svg';
import uploadFirebase from '@/services/firebase';
import styles from './index.less';

const EditQuestionAnswer = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const { Dragger } = Upload;
  const [form] = Form.useForm();
  const {
    dispatch,
    item: { id = '', question = '', categoryId = '', answer = '', attachment = [], url = '' } = {},
    employeeId = '',
    onClose = () => {},
    selectedCountry = '',
    loadingUpdate = false,
    loadingUpload = false,
    visible = false,
    listCategory = [],
  } = props;
  const [showLink, setShowLink] = useState(true);
  const [showUpload, setShowUpload] = useState(true);
  const [uploadFile, setUploadFile] = useState({});
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        faqCategory: categoryId,
        question,
        answer,
      });
      if (attachment?.length) {
        if (attachment[0].category === 'URL') {
          form.setFieldsValue({ upLink: attachment[0].url });
          setShowUpload(false);
        }
        if (attachment[0].category === 'ATTACHMENT') {
          setFileList(attachment);
          setShowLink(false);
        }
      }
    }
    return () => {
      form.resetFields();
      setShowLink(true);
      setShowUpload(true);
    };
  }, [visible]);

  const handleCancel = () => {
    onClose();
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

  const onValuesChange = (_, allValues) => {
    const { upFile, upLink } = allValues;
    upFile?.length ? setShowLink(false) : setShowLink(true);
    upLink ? setShowUpload(false) : setShowUpload(true);
  };

  const getValueFromEvent = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setFileList(e && e.fileList);
    return e && e.fileList;
  };

  const handleFinish = (
    { question: quest = '', faqCategory = '', answer: newAnswer = '', upLink = '' },
    data = [],
  ) => {
    const [first] = data;
    dispatch({
      type: 'faqs/updateQuestion',
      payload: {
        id,
        employeeId,
        categoryId: faqCategory,
        question: quest,
        answer: newAnswer,
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
        payload: { data: [file] },
        showNotification: false,
      }).then((resp) => {
        const { statusCode: status, data = {} } = resp;
        if (status === 200) {
          handleFinish(...rest, data);
        }
      });
    } else {
      handleFinish(...rest);
    }
  };

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>Edit Question</p>
      </div>
    );
  };
  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          name="Edit FAQ"
          id="editForm"
          form={form}
          onFinish={onUpload}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            rules={[{ required: true, message: 'Please name Categories' }]}
            label="FAQ Categories"
            name="faqCategory"
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

          <Form.Item label="Question" name="question" labelCol={{ span: 24 }}>
            <Input />
          </Form.Item>
          <Form.Item label="Answer" name="answer" labelCol={{ span: 24 }}>
            <TextArea rows={4} />
          </Form.Item>
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
              fileList={fileList}
              action={(file) => setUploadFile(file)}
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
        className={`${styles.EditQuestionAnswer} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={696}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="editForm"
              key="submit"
              htmlType="submit"
              loading={loadingUpdate || loadingUpload}
            >
              Save Change
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
};

export default connect(
  ({
    loading,
    faqs: { listCategory = [], selectedCountry } = {},
    user: { currentUser: { employee: { _id: employeeId = '' } = {} } = {} },
  }) => ({
    loadingGetList: loading.effects['faqs/fetchListCategory'],
    loadingUpdate: loading.effects['faqs/updateQuestion'],
    loadingUpload: loading.effects['upload/addAttachment'],
    listCategory,
    employeeId,
    selectedCountry,
  }),
)(EditQuestionAnswer);
