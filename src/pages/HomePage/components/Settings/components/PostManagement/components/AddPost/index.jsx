import { Button, Card, Col, Form, Row, Select } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { TAB_IDS } from '@/constants/homePage';
import { FILE_TYPE } from '@/constants/upload';
import { beforeUpload, compressImage } from '@/utils/upload';
import { getCurrentCompanyObj } from '@/utils/utils';
import AnnouncementContent from './components/AnnouncementContent';
import { DATE_FORMAT_YMD } from '@/constants/dateFormat';
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
    currentUser: { employee = {}, location: { _id: locationId = '' } = {} } = {},
    loadingAddPost = false,
    loadingEditPost = false,
    companyLocationList = [],
  } = props;

  const [mode, setMode] = useState(selectedTab || TAB_IDS.ANNOUNCEMENTS);
  const [location, setLocation] = useState([locationId]);
  const [formValues, setFormValues] = useState({});
  const [fileList, setFileList] = useState([]);

  // FUNCTIONS
  const onModeChange = (val) => {
    setMode(val);
  };

  const handleChangeLocation = (val) => {
    let result = [...val];
    if (val.includes('all')) {
      result = companyLocationList.map((x) => x._id);
    }
    form.setFieldsValue({
      location: result,
    });
  };

  const onReset = () => {
    form.resetFields();
    setFormValues({});
    setLocation([locationId]);
  };

  useEffect(() => {
    onReset();
  }, [mode]);

  useEffect(() => {
    setLocation([locationId]);
  }, [locationId]);

  useEffect(() => {
    if (editing) {
      let tempFormValues = {};
      const { attachments = [], location: locationProps = [], postAsCompany = false } = record;
      const fileListTemp = () => {
        return attachments.map((x, i) => {
          return {
            ...x,
            uid: i,
            name: x.name,
            status: 'done',
            url: x.url,
            thumbUrl: x.url,
            id: x.id || x._id,
          };
        });
      };

      switch (mode) {
        case TAB_IDS.ANNOUNCEMENTS: {
          tempFormValues = {
            postType: TAB_IDS.ANNOUNCEMENTS,
            descriptionA: record.description,
            uploadFilesA: { fileList: [...fileListTemp()] },
            postAsCompany,
          };
          break;
        }
        case TAB_IDS.ANNIVERSARY: {
          tempFormValues = {
            postType: TAB_IDS.ANNIVERSARY,
            descriptionB: record.description,
            uploadFilesB: { fileList: [...fileListTemp()] },
          };

          break;
        }
        case TAB_IDS.IMAGES: {
          tempFormValues = {
            postType: TAB_IDS.IMAGES,
            titleI: record.title,
            descriptionI: record.description,
            uploadFilesI: { fileList: [...fileListTemp()] },
          };
          break;
        }
        case TAB_IDS.BANNER: {
          tempFormValues = {
            postType: TAB_IDS.BANNER,
            uploadFilesBN: { fileList: [...fileListTemp()] },
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
            startDateP: moment(new Date(record.pollDetail?.startDate)).utc(0),
            endDateP: moment(new Date(record.pollDetail?.endDate)).utc(0),
          };
          break;
        default:
          break;
      }

      tempFormValues.location = locationProps.map((x) => x._id);

      form.setFieldsValue(tempFormValues);
      setFileList(fileListTemp());
      setFormValues(tempFormValues);
    }
  }, [editing]);

  // announcements
  const setFormValuesDebounce = debounce((values) => {
    setFormValues(values);
  }, 1000);

  const checkUploadFiles = (allValues) => {
    const tempAllValues = { ...allValues };

    const commonFunc = (name) => {
      let { fileList: fileListTemp = [] } = tempAllValues[name] || {};
      fileListTemp = fileListTemp.filter((x) => beforeUpload(x, [FILE_TYPE.IMAGE]));
      setFileList([...fileListTemp]);
      if (tempAllValues[name]) {
        tempAllValues[name].fileList = fileListTemp;
      }
      return tempAllValues;
    };

    switch (mode) {
      case TAB_IDS.ANNOUNCEMENTS: {
        return commonFunc('uploadFilesA');
      }
      case TAB_IDS.ANNIVERSARY: {
        return commonFunc('uploadFilesB');
      }
      case TAB_IDS.IMAGES: {
        return commonFunc('uploadFilesI');
      }
      case TAB_IDS.BANNER: {
        return commonFunc('uploadFilesBN');
      }

      default:
        return tempAllValues;
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    const newValues = checkUploadFiles(allValues);
    setFormValuesDebounce(newValues);
  };

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
              const compressedFile = await compressImage(x.originFileObj);
              const formData = new FormData();
              formData.append('blob', compressedFile, x.originFileObj?.name);
              const upload = await dispatch({
                type: 'upload/uploadFile',
                payload: formData,
                showNotification: false,
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
          location: values.location,
          postAsCompany: values.postAsCompany,
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
          location: values.location,
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
          location: values.location,
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
            startDate: moment(new Date(values.startDateP)).format(DATE_FORMAT_YMD),
            endDate: moment(new Date(values.endDateP)).format(DATE_FORMAT_YMD),
          },
          location: values.location,
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
          location: values.location,
          postAsCompany: values.postAsCompany,
        };
        break;
      }
      case TAB_IDS.ANNIVERSARY: {
        const attachments = await onUploadFiles(values.uploadFilesB);
        payload = {
          attachments,
          postType: TAB_IDS.ANNIVERSARY,
          description: values.descriptionB,
          location: values.location,
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
          location: values.location,
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
          location: values.location,
          pollDetail: {
            question: values.questionP,
            response1: values.responsesP[0]?.response,
            response2: values.responsesP[1]?.response,
            response3: values.responsesP[2]?.response,
            startDate: moment(new Date(values.startDateP)).format(DATE_FORMAT_YMD),
            endDate: moment(new Date(values.endDateP)).format(DATE_FORMAT_YMD),
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
        return (
          <AnnouncementContent
            defaultFileList={fileList}
            company={getCurrentCompanyObj()}
            employee={employee}
          />
        );
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
            location,
            createBy: employee?.generalInfo?.legalName,
            postAsCompany: false,
          }}
          onFinish={editing ? onEdit : onPost}
        >
          <Form.Item label="Post Type" name="postType">
            <Select disabled showArrow style={{ width: '100%' }} onChange={onModeChange}>
              {TABS.map((x) => {
                return (
                  <Select.Option value={x.id} key={x.id}>
                    {x.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {[TAB_IDS.ANNOUNCEMENTS, TAB_IDS.IMAGES, TAB_IDS.POLL].includes(mode) && (
            <Form.Item
              label="Show in Locations"
              name="location"
              rules={[{ required: true, message: 'Please select the location!' }]}
              placeholder="Enter location"
            >
              <Select
                mode="tags"
                allowClear
                showArrow
                style={{ width: '100%' }}
                onChange={handleChangeLocation}
              >
                <Select.Option value="all">All Location</Select.Option>
                {companyLocationList.map((x) => {
                  return (
                    <Select.Option value={x._id} key={x._id}>
                      {x.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
          {renderTypeContent()}
        </Form>
        <div className={styles.footer}>
          {!editing && (
            <CustomSecondaryButton onClick={onReset}>
              <span style={{ color: '#ffa100' }}>Reset</span>
            </CustomSecondaryButton>
          )}
          <CustomPrimaryButton
            type="primary"
            form="myForm"
            key="submit"
            htmlType="submit"
            loading={loadingAddPost || loadingEditPost}
          >
            {editing ? 'Update' : 'Post'}
          </CustomPrimaryButton>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    let owner = {};
    if (editing) {
      owner = {
        generalInfo: record?.createdBy?.generalInfoInfo,
        titleInfo: record?.createdBy?.titleInfo,
      };
    } else {
      owner = {
        generalInfo: employee?.generalInfo,
        titleInfo: employee?.title,
      };
    }
    return (
      <div className={styles.previewContainer}>
        <p className={styles.title}>Preview post</p>
        <Preview
          mode={mode}
          editing={editing}
          formValues={formValues}
          owner={owner}
          company={getCurrentCompanyObj()}
        />
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

export default connect(
  ({
    user: { currentUser = {}, permissions = {} } = {},
    loading,
    location: { companyLocationList = [] } = {},
  }) => ({
    currentUser,
    permissions,
    companyLocationList,
    loadingAddPost:
      loading.effects['homePage/addPostEffect'] || loading.effects['upload/uploadFile'],
    loadingEditPost:
      loading.effects['homePage/updatePostEffect'] || loading.effects['upload/uploadFile'],
  }),
)(AddPost);
