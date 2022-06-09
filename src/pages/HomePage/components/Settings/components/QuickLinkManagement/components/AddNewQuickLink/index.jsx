import { Button, Card, Col, Form, Row, Select } from 'antd';
import { debounce } from 'lodash';
// import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { TAB_IDS_QUICK_LINK } from '@/utils/homePage';
import QuickLinkContent from './components/QuickLinkContent';
import QuickLinkTimeOffContent from './components/QuickLinkTimeOffContent';
import styles from './index.less';

const AddNewQuickLink = (props) => {
  const [form] = Form.useForm();
  const { selectedTab = '', onBack = () => {} } = props;
  // editing post
  const { editing = false, record = {} } = props;

  // redux
  const {
    dispatch,
    currentUser: { employee = {}, location: { _id: locationId = '' } = {} } = {},
    loadingAddQuickLink = false,
    loadingEditQuickLink = false,
    companyLocationList = [],
  } = props;

  const [location, setLocation] = useState([locationId]);
  const [formValues, setFormValues] = useState({});
  const [fileList, setFileList] = useState([]);

  // FUNCTIONS
  // const onModeChange = (val) => {
  //   setMode(val);
  // };

  const handleChangeLocation = (val) => {
    setLocation(val);
  };

  const onReset = () => {
    form.resetFields();
    setFormValues({});
    setLocation([locationId]);
  };

  useEffect(() => {
    onReset();
  }, [selectedTab]);

  useEffect(() => {
    setLocation([locationId]);
  }, [locationId]);

  useEffect(() => {
    if (editing) {
      let tempFormValues = {};
      const { attachmentInfo = [], locationInfo: locationProps = [] } = record;
      const fileListTemp = () => {
        return attachmentInfo.map((x, i) => {
          return {
            uid: i,
            name: x.name,
            status: 'done',
            url: x.url,
            thumbUrl: x.url,
            id: x._id,
          };
        });
      };

      switch (selectedTab) {
        case TAB_IDS_QUICK_LINK.GENERAL:
          tempFormValues = {
            descriptionG: record.description,
            uploadFilesG: [...fileListTemp()],
          };
          break;
        case TAB_IDS_QUICK_LINK.TIMEOFF:
          tempFormValues = {
            descriptionTO: record.description,
            uploadFilesTO: [...fileListTemp()],
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

  const onAddNew = async (values) => {
    let payload = {};

    switch (selectedTab) {
      case TAB_IDS_QUICK_LINK.GENERAL:
        {
          const attachment = await onUploadFiles(values.uploadFilesG);
          payload = {
            attachment,
            type: TAB_IDS_QUICK_LINK.GENERAL.toLowerCase(),
            description: values.descriptionG,
            employee: employee?._id,
            locations: values.location,
          };
        }
        break;
      case TAB_IDS_QUICK_LINK.TIMEOFF:
        {
          const attachment = await onUploadFiles(values.uploadFilesTO);
          payload = {
            attachment,
            type: TAB_IDS_QUICK_LINK.TIMEOFF.toLowerCase(),
            description: values.descriptionTO,
            employee: employee?._id,
            locations: values.location,
          };
        }
        break;
      default:
        break;
    }

    const res = await dispatch({
      type: 'homePage/addQuickLinkEffect',
      payload,
    });
    if (res?.statusCode === 200) {
      onBack();
    }
  };

  const onEdit = async (values) => {
    let payload = {};
    switch (selectedTab) {
      case TAB_IDS_QUICK_LINK.GENERAL:
        {
          const attachment = await onUploadFiles(values.uploadFilesG);
          payload = {
            attachment,
            description: values.descriptionG,
            locations: values.location,
          };
        }
        break;
      case TAB_IDS_QUICK_LINK.TIMEOFF:
        {
          const attachment = await onUploadFiles(values.uploadFilesTO);
          payload = {
            attachment,
            description: values.descriptionTO,
            locations: values.location,
          };
        }
        break;
      default:
        break;
    }

    const res = await dispatch({
      type: 'homePage/updateQuickLinkEffect',
      payload: {
        ...payload,
        id: record._id,
      },
    });
    if (res?.statusCode === 200) {
      onBack();
    }
  };

  const renderTypeContent = () => {
    switch (selectedTab) {
      case TAB_IDS_QUICK_LINK.GENERAL:
        return <QuickLinkContent defaultFileList={fileList} />;
      case TAB_IDS_QUICK_LINK.TIMEOFF:
        return <QuickLinkTimeOffContent defaultFileList={fileList} />;
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
            responsesP: [{}, {}, {}],
            location,
          }}
          onFinish={editing ? onEdit : onAddNew}
        >
          <Form.Item
            label="Locations"
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
              {companyLocationList.map((x) => {
                return (
                  <Select.Option value={x._id} key={x._id}>
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
            className={styles.btnSave}
            type="primary"
            form="myForm"
            key="submit"
            htmlType="submit"
            loading={loadingAddQuickLink || loadingEditQuickLink}
          >
            {editing ? 'Update' : 'Save'}
          </Button>
        </div>
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
    <Row className={styles.AddQuickLink} gutter={[24, 24]}>
      <Col xs={24} xl={14}>
        <Card title={editing ? 'Edit Quick Link' : 'New Quick Link'} extra={renderOptions()}>
          {renderForm()}
        </Card>
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
    loadingAddQuickLink:
      loading.effects['homePage/addQuickLinkHomePageEffect'] ||
      loading.effects['upload/uploadFile'],
    loadingEditQuickLink:
      loading.effects['homePage/updateQuickLinkHomePageEffect'] ||
      loading.effects['upload/uploadFile'],
  }),
)(AddNewQuickLink);
