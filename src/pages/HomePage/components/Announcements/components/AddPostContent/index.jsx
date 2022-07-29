import { Form, Input, message, Upload } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import AttachmentIcon from '@/assets/attachment.svg';
import UploadFileURLIcon from '@/assets/homePage/uploadURLIcon.svg';
import styles from './index.less';
import { POST_TYPE } from '@/utils/homePage';

const { Dragger } = Upload;

const AddPostContent = (props) => {
  const {
    setForm = () => {},
    dispatch,
    currentUser: { employee = {} } = {},
    fetchData = () => {},
    setIsVisible = () => {},
    limit = 5,
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    setForm(form);
  }, []);

  const onUploadFiles = async (files) => {
    if (Array.isArray(files)) {
      return files.map((x) => x.id || x._id);
    }
    const list = [];
    if (Array.isArray(files?.fileList)) {
      if (files?.fileList.length > 0) {
        // eslint-disable-next-line compat/compat
        await Promise.all(
          files.fileList.map(async (x) => {
            if (x.url) {
              list.push({ id: x.id || x._id });
            } else {
              const formData = new FormData();
              formData.append('uri', x.originFileObj);
              const upload = await dispatch({
                type: 'upload/uploadFile',
                payload: formData,
              });
              if (upload.statusCode === 200) {
                list.push(upload.data[0]);
              }
            }
            return x;
          }),
        );
      }
    }
    return list.map((x) => x.id);
  };

  const onAddNew = async (values) => {
    let payload = {};
    const attachment = await onUploadFiles(values.uploadFiles);
    payload = {
      attachment,
      postType: 'EMPLOYEE',
      description: values.description,
      createdBy: employee?._id,
    };
    // onBack();
    dispatch({
      type: 'homePage/addPostEffect',
      payload,
    }).then((x) => {
      if (x.statusCode === 200) setIsVisible(false);
      fetchData(POST_TYPE.SOCIAL, limit);
    });
  };

  const beforeUpload = (file) => {
    let checkType = false;
    switch (file.type) {
      case 'image/png':
      case 'image/jpg':
      case 'image/jpeg':
        checkType = true;
        break;

      default:
        checkType = false;
        break;
    }
    if (!checkType) {
      message.error('You can only upload PNG/JPG/JPEG files');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('File must smaller than 3MB!');
    }
    return (checkType && isLt3M) || Upload.LIST_IGNORE;
  };

  return (
    <div className={styles.AnnouncementContent}>
      <Form layout="vertical" form={form} id="myForm" className={styles.form} onFinish={onAddNew}>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: 'Required field!',
            },
          ]}
        >
          <Input.TextArea
            placeholder="Enter the description"
            autoSize={{
              minRows: 5,
              maxRows: 10,
            }}
            maxLength={100}
            showCount={{
              formatter: ({ count, maxLength }) => {
                return `Character Limit: ${count}/${maxLength}`;
              },
            }}
          />
        </Form.Item>

        <Form.Item label="Media file" name="uploadFiles">
          <Dragger
            listType="picture"
            className={styles.fileUploadForm}
            multiple
            beforeUpload={beforeUpload}
          >
            <div className={styles.drapperBlock}>
              <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />
              <span className={styles.chooseFileText}>Choose files</span>
              <span className={styles.uploadText}>or drop files here</span>
              <p className={styles.description}>
                Maximum file size 3 mb, Supported file format png, jpg & jpeg (Image size 350*300)
              </p>
            </div>
          </Dragger>
        </Form.Item>
        <div className={styles.separator}>OR</div>
        <Form.Item label="Upload File by URL" name="urlFile">
          <Input
            placeholder="Type your media link here"
            allowClear
            prefix={<img src={UploadFileURLIcon} alt="upload-url-icon" />}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ user: { currentUser = {} } = {} }) => ({ currentUser }))(AddPostContent);
