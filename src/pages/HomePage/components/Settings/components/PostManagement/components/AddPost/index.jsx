import { Card, Col, Form, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { POST_TYPES, POST_TYPE_TEXT } from '@/utils/homePage';
import styles from './index.less';
import AnnouncementContent from './components/AnnouncementContent';
import Preview from './components/Preview';
import BirthdayContent from './components/BirthdayContent';
import ImagesContent from './components/ImagesContent';
import BannerContent from './components/BannerContent';

// A: ANNOUNCEMENT
// B: BIRTHDAY/ANNIVERSARY
// P: POLL
// I: IMAGES

const AddPost = () => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState(POST_TYPE_TEXT.ANNOUNCEMENT);

  // announcement content
  const [uploadFilesA, setUploadFilesA] = useState([]);
  const [descriptionA, setDescriptionA] = useState('');

  // birthday content
  const [uploadFilesB, setUploadFilesB] = useState([]);
  const [descriptionB, setDescriptionB] = useState('');

  // images content
  const [uploadFilesI, setUploadFilesI] = useState([]);
  const [descriptionI, setDescriptionI] = useState('');
  const [titleI, setTitleI] = useState('');

  // banner
  const [uploadFilesBN, setUploadFilesBN] = useState([]);

  // FUNCTIONS
  const onModeChange = (val) => {
    setMode(val);
  };

  useEffect(() => {
    setUploadFilesA([]);
    setDescriptionA('');
    setUploadFilesB([]);
    setDescriptionB('');
    setUploadFilesI([]);
    setDescriptionI('');
    setTitleI('');
    setUploadFilesBN([]);
  }, [mode]);

  // announcements
  const onChange = debounce((fnc, value) => {
    fnc(value);
  }, 1000);

  const onValuesChange = (values) => {
    if (values.descriptionA) {
      onChange(setDescriptionA, values.descriptionA);
    }
    if (values.descriptionB) {
      onChange(setDescriptionB, values.descriptionB);
    }
    if (values.descriptionI) {
      onChange(setDescriptionI, values.descriptionI);
    }
    if (values.titleI) {
      onChange(setTitleI, values.titleI);
    }
  };

  // RENDER UI
  const renderTypeContent = () => {
    switch (mode) {
      case POST_TYPE_TEXT.ANNOUNCEMENT:
        return (
          <AnnouncementContent uploadFilesA={uploadFilesA} setUploadFilesA={setUploadFilesA} />
        );
      case POST_TYPE_TEXT.BIRTHDAY_ANNIVERSARY:
        return <BirthdayContent uploadFilesB={uploadFilesB} setUploadFilesB={setUploadFilesB} />;
      case POST_TYPE_TEXT.IMAGES:
        return <ImagesContent uploadFilesI={uploadFilesI} setUploadFilesI={setUploadFilesI} />;
      case POST_TYPE_TEXT.BANNER:
        return <BannerContent uploadFilesBN={uploadFilesBN} setUploadFilesBN={setUploadFilesBN} />;

      default:
        return '';
    }
  };

  const renderForm = () => {
    return (
      <div className={styles.formContainer}>
        <Form
          layout="vertical"
          name="filter"
          form={form}
          onValuesChange={onValuesChange}
          initialValues={{
            postType: mode,
          }}
        >
          <Form.Item label="Post Type" name="postType">
            <Select showArrow style={{ width: '100%' }} onChange={onModeChange}>
              {POST_TYPES.map((x) => {
                return (
                  <Select.Option value={x} key={x}>
                    {x}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {renderTypeContent()}
        </Form>
      </div>
    );
  };
  const renderPreview = () => {
    return (
      <div className={styles.previewContainer}>
        <p className={styles.title}>Preview post</p>
        <Preview
          mode={mode}
          dataA={{ uploadFilesA, descriptionA }}
          dataB={{
            descriptionB,
            uploadFilesB,
          }}
          dataI={{
            descriptionI,
            uploadFilesI,
            titleI,
          }}
          dataBN={{ uploadFilesBN }}
        />
      </div>
    );
  };
  return (
    <Row className={styles.AddPost} gutter={[24, 24]}>
      <Col xs={24} xl={14}>
        <Card title="Add Post">{renderForm()}</Card>
      </Col>
      <Col xs={24} xl={10}>
        {renderPreview()}
      </Col>
    </Row>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(AddPost);
