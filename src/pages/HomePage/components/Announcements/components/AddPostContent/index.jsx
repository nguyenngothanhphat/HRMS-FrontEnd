import { Form, Input, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AttachmentIcon from '@/assets/attachment.svg';
import UploadFileURLIcon from '@/assets/homePage/uploadURLIcon.svg';
import styles from './index.less';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';

const { Dragger } = Upload;

const AddPostContent = (props) => {
  const {
    setForm = () => {},
    dispatch,
    currentUser: { employee = {} } = {},
    fetchData = () => {},
    setIsVisible = () => {},
    limit = 5,
    record = {},
    isEdit = false,
  } = props;
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);
  const [isURL, setIsURL] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    setForm(form);
  }, []);

  useEffect(() => {
    if (isEdit) {
      const { description = '', attachments = [] } = record;

      if (attachments && attachments.length) {
        setIsUpload(true);
      }

      const fileListTemp = () => {
        return attachments.map((x, i) => {
          return {
            ...x,
            uid: i,
            name: x.name,
            status: 'done',
            url: x.url,
            thumbUrl: x.url,
            id: x._id,
          };
        });
      };
      form.setFieldsValue({
        description,
        uploadFiles: { fileList: [...fileListTemp()] },
      });
      setFileList([...fileListTemp()]);
    }
    return () => {
      form.resetFields();
    };
  }, [isEdit]);

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
    const attachments = await onUploadFiles(values.uploadFiles);
    dispatch({
      type: 'homePage/addPostEffect',
      payload: {
        attachments,
        postType: POST_TYPE.SOCIAL,
        description: values.description,
        createdBy: employee?._id,
      },
    }).then((x) => {
      if (x.statusCode === 200) {
        setIsVisible(false);
        fetchData(POST_TYPE.SOCIAL, limit, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const onEditPost = async (values) => {
    const attachments = await onUploadFiles(values.uploadFiles);
    dispatch({
      type: 'homePage/updatePostEffect',
      payload: {
        id: record?._id,
        attachments,
        postType: POST_TYPE.SOCIAL,
        description: values.description,
      },
    }).then((x) => {
      if (x.statusCode === 200) {
        setIsVisible(false);
        fetchData(POST_TYPE.SOCIAL, limit, '', STATUS_POST.ACTIVE);
      }
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

  const onValuesChange = (changedValues, allValues) => {
    if (allValues.urlFile) {
      setIsURL(true);
    } else {
      setIsURL(false);
    }

    if (allValues.uploadFiles?.fileList?.length) {
      setIsUpload(true);
    } else {
      setIsUpload(false);
    }

    const tempAllValues = { ...allValues };
    const commonFunc = (name) => {
      let { fileList: fileListTemp = [] } = tempAllValues[name] || {};
      fileListTemp = fileListTemp.filter((x) => beforeUpload(x));
      setFileList([...fileListTemp]);
      if (tempAllValues[name]) {
        tempAllValues[name].fileList = fileListTemp;
      }
      return tempAllValues;
    };
    return commonFunc('uploadFiles');
  };

  return (
    <div className={styles.AnnouncementContent}>
      <Form
        layout="vertical"
        form={form}
        id="myForm"
        className={styles.form}
        onValuesChange={onValuesChange}
        onFinish={isEdit ? onEditPost : onAddNew}
      >
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
            fileList={[...fileList]}
            beforeUpload={beforeUpload}
            multiple
            disabled={isURL}
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
            disabled={isUpload}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))(AddPostContent);
