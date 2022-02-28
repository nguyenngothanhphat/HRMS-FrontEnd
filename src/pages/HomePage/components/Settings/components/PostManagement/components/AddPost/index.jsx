import { Button, Card, Col, Form, Row, Select } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { TAB_IDS } from '@/utils/homePage';
import AnnouncementContent from './components/AnnouncementContent';
import BannerContent from './components/BannerContent';
import BirthdayContent from './components/BirthdayContent';
import ImagesContent from './components/ImagesContent';
import PollContent from './components/PollContent';
import Preview from './components/Preview';
import styles from './index.less';

// A: ANNOUNCEMENT
// B: BIRTHDAY/ANNIVERSARY
// P: POLL
// I: IMAGES
// BN: BANNER

const TABS = [
  {
    id: TAB_IDS.ANNOUNCEMENTS,
    name: 'Announcement',
  },
  // {
  //   id: TAB_IDS.ANNIVERSARY,
  //   name: 'Birthday/Anniversary',
  // },
  {
    id: TAB_IDS.IMAGES,
    name: 'Images',
  },
  {
    id: TAB_IDS.BANNER,
    name: 'Banner',
  },
  {
    id: TAB_IDS.POLL,
    name: 'Poll',
  },
];

const AddPost = (props) => {
  const [form] = Form.useForm();
  const { selectedTab = '', onBack = () => {} } = props;

  // editing post
  const { editing = false, record = {} } = props;

  // redux
  const {
    dispatch,
    currentUser: { employee = {} } = {},
    loadingAddPost = false,
    loadingEditPost = false,
  } = props;

  const [mode, setMode] = useState(selectedTab || TAB_IDS.ANNOUNCEMENTS);
  const [formValues, setFormValues] = useState({});
  const [fileList, setFileList] = useState([]);

  // FUNCTIONS
  const onModeChange = (val) => {
    setMode(val);
  };

  const onReset = () => {
    form.resetFields();
    setFormValues({});
  };

  useEffect(() => {
    onReset();
  }, [mode]);

  useEffect(() => {
    if (editing) {
      let tempFormValues = {};
      const fileListTemp = () => {
        const { attachments = [] } = record;
        return attachments.map((x, i) => {
          return {
            uid: i,
            name: x.name,
            status: 'done',
            url: x.url,
            thumbUrl: x.url,
            id: x.id,
          };
        });
      };

      switch (mode) {
        case TAB_IDS.ANNOUNCEMENTS: {
          tempFormValues = {
            postType: TAB_IDS.ANNOUNCEMENTS,
            descriptionA: record.description,
            uploadFilesA: [...fileListTemp()],
          };
          break;
        }
        case TAB_IDS.ANNIVERSARY: {
          tempFormValues = {
            postType: TAB_IDS.ANNIVERSARY,
            descriptionB: record.description,
            uploadFilesB: [...fileListTemp()],
          };

          break;
        }
        case TAB_IDS.IMAGES: {
          tempFormValues = {
            postType: TAB_IDS.IMAGES,
            titleI: record.title,
            descriptionI: record.description,
            uploadFilesI: [...fileListTemp()],
          };
          break;
        }
        case TAB_IDS.BANNER: {
          tempFormValues = {
            postType: TAB_IDS.BANNER,
            uploadFilesBN: [...fileListTemp()],
          };
          break;
        }
        case TAB_IDS.POLL:
          tempFormValues = {
            postType: TAB_IDS.POLL,
            questionP: record.pollDetail?.question,
            responsesP: [
              {
                response: record.pollDetail?.response1,
              },
              {
                response: record.pollDetail?.response2,
              },
              {
                response: record.pollDetail?.response3,
              },
            ],
            startDateP: moment.utc(record.pollDetail?.startDate).startOf('day'),
            endDateP: moment.utc(record.pollDetail?.endDate).startOf('day'),
          };
          break;
        default:
          break;
      }

      form.setFieldsValue(tempFormValues);
      setFileList(fileListTemp());
      setFormValues(tempFormValues);
    }
  }, [editing]);

  // announcements
  const setFormValuesDebounce = debounce((values) => {
    setFormValues(values);
  }, 1000);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    setFormValuesDebounce(values);
  };

  const onUploadFiles = async (files) => {
    if (Array.isArray(files)) {
      return files.map((x) => x.id);
    }
    const list = [];
    if (Array.isArray(files?.fileList)) {
      if (files?.fileList.length > 0) {
        // eslint-disable-next-line compat/compat
        await Promise.all(
          files.fileList.map(async (x) => {
            if (x.url) {
              list.push({ id: x.id });
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

  const onPost = async (values) => {
    let payload = {};

    switch (mode) {
      case TAB_IDS.ANNOUNCEMENTS: {
        const attachments = await onUploadFiles(values.uploadFilesA);
        payload = {
          attachments,
          postType: TAB_IDS.ANNOUNCEMENTS,
          description: values.descriptionA,
          createdBy: employee?._id,
        };
        break;
      }
      case TAB_IDS.ANNIVERSARY: {
        const attachments = await onUploadFiles(values.uploadFilesB);
        payload = {
          attachments,
          postType: TAB_IDS.ANNIVERSARY,
          description: values.descriptionB,
          createdBy: employee?._id,
        };
        break;
      }
      case TAB_IDS.IMAGES: {
        const attachments = await onUploadFiles(values.uploadFilesI);
        payload = {
          attachments,
          postType: TAB_IDS.IMAGES,
          title: values.titleI,
          description: values.descriptionI,
          createdBy: employee?._id,
        };
        break;
      }
      case TAB_IDS.BANNER: {
        const attachments = await onUploadFiles(values.uploadFilesBN);
        payload = {
          attachments,
          postType: TAB_IDS.BANNER,
          createdBy: employee?._id,
          position: record?.position,
        };
        break;
      }
      case TAB_IDS.POLL:
        payload = {
          postType: TAB_IDS.POLL,
          createdBy: employee?._id,
          pollDetail: {
            question: values.questionP,
            response1: values.responsesP[0]?.response,
            response2: values.responsesP[1]?.response,
            response3: values.responsesP[2]?.response,
            startDate: moment.utc(values.startDateP).startOf('day'),
            endDate: moment.utc(values.endDateP).startOf('day'),
          },
        };
        break;
      default:
        break;
    }

    const res = await dispatch({
      type: 'homePage/addPostEffect',
      payload,
    });
    if (res?.statusCode === 200) {
      onBack();
    }
  };

  const onEdit = async (values) => {
    let payload = {};

    switch (mode) {
      case TAB_IDS.ANNOUNCEMENTS: {
        const attachments = await onUploadFiles(values.uploadFilesA);
        payload = {
          attachments,
          postType: TAB_IDS.ANNOUNCEMENTS,
          description: values.descriptionA,
        };
        break;
      }
      case TAB_IDS.ANNIVERSARY: {
        const attachments = await onUploadFiles(values.uploadFilesB);
        payload = {
          attachments,
          postType: TAB_IDS.ANNIVERSARY,
          description: values.descriptionB,
        };
        break;
      }
      case TAB_IDS.IMAGES: {
        const attachments = await onUploadFiles(values.uploadFilesI);
        payload = {
          attachments,
          postType: TAB_IDS.IMAGES,
          title: values.titleI,
          description: values.descriptionI,
        };
        break;
      }
      case TAB_IDS.BANNER: {
        const attachments = await onUploadFiles(values.uploadFilesBN);
        payload = {
          attachments,
          postType: TAB_IDS.BANNER,
        };
        break;
      }
      case TAB_IDS.POLL:
        payload = {
          postType: TAB_IDS.POLL,
          pollDetail: {
            question: values.questionP,
            response1: values.responsesP[0]?.response,
            response2: values.responsesP[1]?.response,
            response3: values.responsesP[2]?.response,
            startDate: moment.utc(values.startDateP).startOf('day'),
            endDate: moment.utc(values.endDateP).startOf('day'),
          },
        };
        break;
      default:
        break;
    }

    const res = await dispatch({
      type: 'homePage/updatePostEffect',
      payload: {
        ...payload,
        id: record._id,
      },
    });
    if (res?.statusCode === 200) {
      onBack();
    }
  };

  // RENDER UI
  const renderTypeContent = () => {
    switch (mode) {
      case TAB_IDS.ANNOUNCEMENTS:
        return <AnnouncementContent defaultFileList={fileList} />;
      case TAB_IDS.ANNIVERSARY:
        return <BirthdayContent defaultFileList={fileList} />;
      case TAB_IDS.IMAGES:
        return <ImagesContent defaultFileList={fileList} />;
      case TAB_IDS.BANNER:
        return <BannerContent defaultFileList={fileList} />;
      case TAB_IDS.POLL:
        return <PollContent form={form} />;
      default:
        return '';
    }
  };

  const renderForm = () => {
    return (
      <div className={styles.formContainer}>
        <Form
          layout="vertical"
          name="myForm"
          form={form}
          className={styles.form}
          onValuesChange={onValuesChange}
          initialValues={{
            postType: mode,
            responsesP: [{}, {}, {}],
          }}
          onFinish={editing ? onEdit : onPost}
        >
          <Form.Item label="Post Type" name="postType">
            <Select disabled={editing} showArrow style={{ width: '100%' }} onChange={onModeChange}>
              {TABS.map((x) => {
                return (
                  <Select.Option value={x.id} key={x.id}>
                    {x.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {renderTypeContent()}
        </Form>
        <div className={styles.footer}>
          {!editing && (
            <Button className={styles.btnReset} onClick={onReset}>
              Reset
            </Button>
          )}
          <Button
            className={styles.btnPost}
            type="primary"
            form="myForm"
            key="submit"
            htmlType="submit"
            loading={loadingAddPost || loadingEditPost}
          >
            {editing ? 'Update' : 'Post'}
          </Button>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className={styles.previewContainer}>
        <p className={styles.title}>Preview post</p>
        <Preview mode={mode} editing={editing} formValues={formValues} />
      </div>
    );
  };

  const renderOptions = () => {
    return (
      <Button className={styles.backBtn} onClick={onBack}>
        Cancel
      </Button>
    );
  };

  return (
    <Row className={styles.AddPost} gutter={[24, 24]}>
      <Col xs={24} xl={14}>
        <Card title={editing ? 'Edit Post' : 'Add Post'} extra={renderOptions()}>
          {renderForm()}
        </Card>
      </Col>
      <Col xs={24} xl={10}>
        {renderPreview()}
      </Col>
    </Row>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {}, loading }) => ({
  currentUser,
  permissions,
  loadingAddPost: loading.effects['homePage/addPostEffect'] || loading.effects['upload/uploadFile'],
  loadingEditPost:
    loading.effects['homePage/updatePostEffect'] || loading.effects['upload/uploadFile'],
}))(AddPost);
