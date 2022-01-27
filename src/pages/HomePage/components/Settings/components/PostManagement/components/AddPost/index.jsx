import { Card, Button, Col, Form, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { TAB_IDS } from '@/utils/homePage';
import styles from './index.less';
import AnnouncementContent from './components/AnnouncementContent';
import Preview from './components/Preview';
import BirthdayContent from './components/BirthdayContent';
import ImagesContent from './components/ImagesContent';
import BannerContent from './components/BannerContent';
import PollContent from './components/PollContent';

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
  {
    id: TAB_IDS.ANNIVERSARY,
    name: 'Birthday/Anniversary',
  },
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

  // redux
  const { dispatch, currentUser: { employee = {} } = {}, loadingAddPost = false } = props;

  const [mode, setMode] = useState(selectedTab || TAB_IDS.ANNOUNCEMENTS);
  const [formValues, setFormValues] = useState({});

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

  // announcements
  const setFormValuesDebounce = debounce((values) => {
    setFormValues(values);
  }, 1000);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    setFormValuesDebounce(values);
  };

  const onUploadFiles = async (files) => {
    const list = [];

    if (files.length > 0) {
      // eslint-disable-next-line compat/compat
      await Promise.all(
        files.map(async (x) => {
          const formData = new FormData();
          formData.append('uri', x.originFileObj);
          const upload = await dispatch({
            type: 'upload/uploadFile',
            payload: formData,
          });
          if (upload.statusCode === 200) {
            list.push(upload.data[0]);
          }
          return upload;
        }),
      );
    }
    return list.map((x) => x.id);
  };

  const onPost = async (values) => {
    let payload = {};

    switch (mode) {
      case TAB_IDS.ANNOUNCEMENTS: {
        const attachments = await onUploadFiles(values.uploadFilesA.fileList);
        payload = {
          attachments,
          postType: TAB_IDS.ANNOUNCEMENTS,
          description: values.descriptionA,
          createdBy: employee?._id,
        };
        break;
      }
      case TAB_IDS.ANNIVERSARY: {
        const attachments = await onUploadFiles(values.uploadFilesB.fileList);
        payload = {
          attachments,
          postType: TAB_IDS.ANNIVERSARY,
          description: values.descriptionB,
          createdBy: employee?._id,
        };
        break;
      }
      case TAB_IDS.IMAGES: {
        const attachments = await onUploadFiles(values.uploadFilesI.fileList);
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
        const attachments = await onUploadFiles(values.uploadFilesBN.fileList);
        payload = {
          attachments,
          postType: TAB_IDS.BANNER,
          createdBy: employee?._id,
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
            startDate: values.startDateP,
            endDate: values.endDateP,
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

  // RENDER UI
  const renderTypeContent = () => {
    switch (mode) {
      case TAB_IDS.ANNOUNCEMENTS:
        return <AnnouncementContent formValues={formValues} setFormValues={setFormValues} />;
      case TAB_IDS.ANNIVERSARY:
        return <BirthdayContent formValues={formValues} setFormValues={setFormValues} />;
      case TAB_IDS.IMAGES:
        return <ImagesContent formValues={formValues} setFormValues={setFormValues} />;
      case TAB_IDS.BANNER:
        return <BannerContent formValues={formValues} setFormValues={setFormValues} />;
      case TAB_IDS.POLL:
        return <PollContent />;
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
          onFinish={onPost}
        >
          <Form.Item label="Post Type" name="postType">
            <Select showArrow style={{ width: '100%' }} onChange={onModeChange}>
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
          <Button className={styles.btnReset} onClick={onReset}>
            Reset
          </Button>
          <Button
            className={styles.btnPost}
            type="primary"
            form="myForm"
            key="submit"
            htmlType="submit"
            loading={loadingAddPost}
          >
            Post
          </Button>
        </div>
      </div>
    );
  };
  const renderPreview = () => {
    return (
      <div className={styles.previewContainer}>
        <p className={styles.title}>Preview post</p>
        <Preview mode={mode} formValues={formValues} />
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
        <Card title="Add Post" extra={renderOptions()}>
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
}))(AddPost);
