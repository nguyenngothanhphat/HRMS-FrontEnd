import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import UploadIcon from '@/assets/faqPage/upload.svg';
import UrlIcon from '@/assets/faqPage/urlIcon.svg';

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
    visible = false,
    listCategory = [],
  } = props;
  const [showLink, setShowLink] = useState(true);
  const [showUpload, setShowUpload] = useState(true);
  const [uploadFile, setUploadFile] = useState({});
  // const [isImg, setIsImg] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        faqCategory: categoryId,
        question,
        answer,
        upLink: url || '',
      });
      setFileList([...attachment]);
      url && setShowUpload(false);
      attachment?.length && setShowLink(false);
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

  // const isImageLink = (url) =>
  //   new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = url;
  //     img.onload = () => resolve(true);
  //     img.onerror = () => resolve(false);
  //   }).then((x) => setIsImg(x));

  // const onChange = (e) => isImageLink(e.target.value);

  const handleFinish = (
    { question: quest = '', faqCategory = '', answer: newAnswer = '', upLink = '' },
    first = {},
  ) => {
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
          },
        });
        setShowLink(true);
        setShowUpload(true);
      }
    });
  };

  const onUpload = (...rest) => {
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
          handleFinish(...rest, first);
        }
      });
    else handleFinish(...rest);
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
              fileList={[...fileList]}
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
          <Form.Item label="Upload File by URL" name="upLink" labelCol={{ span: 24 }}>
            <Input
              disabled={!showLink}
              className={styles.urlInput}
              placeholder="Type your media link here"
              prefix={<img src={UrlIcon} alt="url Icon" />}
              // onChange={onChange}
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
              loading={loadingUpdate}
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
    listCategory,
    employeeId,
    selectedCountry,
  }),
)(EditQuestionAnswer);
