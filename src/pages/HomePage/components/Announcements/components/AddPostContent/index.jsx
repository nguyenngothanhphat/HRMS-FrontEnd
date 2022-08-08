import { Form, Input, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import AttachmentIcon from '@/assets/attachment.svg';
import UploadFileURLIcon from '@/assets/homePage/uploadURLIcon.svg';
import styles from './index.less';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import uploadFirebase, { uploadFirebaseMultiple } from '@/services/firebase';

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
    setIsEdit = () => {},
  } = props;
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);
  const [isURL, setIsURL] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    setForm(form);
    return () => {
      form.resetFields();
    };
  }, []);

  useEffect(() => {
    if (isEdit) {
      const { description = '', attachments = [] } = record;

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
      if (attachments && attachments.length && attachments[0].category === 'URL') {
        setIsURL(true);
        form.setFieldsValue({
          description,
          urlFile: attachments[0].url,
        });
      } else if (!attachments.length) {
        setIsUpload(false);
        setIsURL(false);
        form.setFieldsValue({
          description,
        });
      } else {
        setIsUpload(true);
        form.setFieldsValue({
          description,
          uploadFiles: { fileList: [...fileListTemp()] },
        });
        setFileList([...fileListTemp()]);
      }
    }
  }, [isEdit]);

  const onAddNew = async (values, data = {}) => {
    const payload = {
      postType: POST_TYPE.SOCIAL,
      description: values.description,
      createdBy: employee?._id,
    };

    if (Object.keys(data)?.length) {
      payload.attachments = data.map((x) => x.id);
    }

    dispatch({
      type: 'homePage/addPostEffect',
      payload,
    }).then((x) => {
      if (x.statusCode === 200) {
        form.resetFields();
        setIsVisible(false);
        fetchData(POST_TYPE.SOCIAL, limit, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const onEditPost = async (values, data = {}) => {
    const payload = {
      id: record?._id,
      postType: POST_TYPE.SOCIAL,
      description: values.description,
    };

    if (Object.keys(data)?.length) {
      payload.attachments = data.map((x) => x.id);
    }

    dispatch({
      type: 'homePage/updatePostEffect',
      payload,
    }).then((x) => {
      if (x.statusCode === 200) {
        form.resetFields();
        setIsEdit(false);
        setIsVisible(false);
        fetchData(POST_TYPE.SOCIAL, limit, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const onUploadFiles = async (values) => {
    const data = [];
    console.log(fileList);
    if (values.urlFile) {
      data.push({
        fileName: uuidv4(),
        category: 'URL',
        url: values.urlFile,
      });
    } else if (values.uploadFiles?.fileList?.length) {
      const uploads = fileList.map((file) => {
        return {
          file,
          typeFile: 'ATTACHMENT',
        };
      });
      const attachment = await uploadFirebaseMultiple(uploads);
      data.push(...attachment);
    }
    if (data.length > 0) {
      dispatch({
        type: 'upload/addAttachment',
        payload: {
          data,
        },
        showNotification: false,
      }).then((resp) => {
        const { statusCode, data: listAttachments = {} } = resp;
        if (statusCode === 200) {
          if (!isEdit) {
            onAddNew(values, listAttachments);
          } else {
            onEditPost(values, listAttachments);
          }
        }
      });
    } else if (isEdit) {
      onEditPost(values);
    } else {
      onAddNew(values);
    }
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
        onFinish={onUploadFiles}
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
