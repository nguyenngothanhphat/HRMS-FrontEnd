import { Form, Input, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AttachmentIcon from '@/assets/attachment.svg';
import UploadFileURLIcon from '@/assets/homePage/uploadURLIcon.svg';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import { uploadFirebaseMultiple } from '@/services/firebase';
import styles from './index.less';
import { UPLOAD } from '@/constants/upload';

const { Dragger } = Upload;
const { CATEGORY_NAME } = UPLOAD;

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
    setIsUploadFile = () => {},
  } = props;
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);
  const [isURL, setIsURL] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    setForm(form);
    return () => {
      form.resetFields();
      setIsUploadFile(false);
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
      if (attachments && attachments.length && attachments[0].category === CATEGORY_NAME.URL) {
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

  const onAddNew = async (values, attachmentsList = []) => {
    const payload = {
      postType: POST_TYPE.SOCIAL,
      description: values.description,
      createdBy: employee?._id,
    };

    if ((attachmentsList || []).length) {
      payload.attachments = attachmentsList.map((x) => x._id);
    }

    dispatch({
      type: 'homePage/addPostEffect',
      payload,
    }).then((x) => {
      if (x.statusCode === 200) {
        form.resetFields();
        setIsUploadFile(false);
        setIsVisible(false);
        fetchData(POST_TYPE.SOCIAL, limit, '', STATUS_POST.ACTIVE);
      } else {
        setIsUploadFile(false);
      }
    });
  };

  const onEditPost = async (values, attachmentsList = []) => {
    const payload = {
      id: record?._id,
      postType: POST_TYPE.SOCIAL,
      description: values.description,
      attachments: values.uploadFiles?.fileList?.map((x) => x._id) || [],
    };

    if ((attachmentsList || []).length) {
      const newAttachments = attachmentsList.map((x) => x._id);
      if (attachmentsList[0]?.category === CATEGORY_NAME.URL) {
        payload.attachments = [...newAttachments];
      } else {
        const oldAttachments = values.uploadFiles?.fileList.map((x) => x._id);
        payload.attachments = [...newAttachments, ...oldAttachments];
      }
    }

    dispatch({
      type: 'homePage/updatePostEffect',
      payload,
    }).then((x) => {
      if (x.statusCode === 200) {
        form.resetFields();
        setIsEdit(false);
        setIsUploadFile(false);
        setIsVisible(false);
        fetchData(POST_TYPE.SOCIAL, limit, '', STATUS_POST.ACTIVE);
      } else {
        setIsUploadFile(false);
      }
    });
  };

  const onFinish = async (values) => {
    const data = [];
    const newList = [];
    setIsUploadFile(true);
    fileList.forEach((x) => {
      if (x?.originFileObj) {
        newList.push(x);
      }
    });
    if (values.urlFile) {
      data.push({
        category: CATEGORY_NAME.URL,
        url: values.urlFile,
      });
    } else if (values.uploadFiles?.fileList?.length) {
      const uploads = newList.map((file) => {
        return {
          file: file?.originFileObj,
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
          attachments: data,
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
        } else {
          setIsUploadFile(false);
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
        onFinish={onFinish}
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
        <Form.Item
          label="Upload File by URL"
          name="urlFile"
          rules={[
            {
              pattern: /(http(s?):\/\/[^\s]+)/g,
              message: 'URL is invalid!',
            },
          ]}
        >
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
