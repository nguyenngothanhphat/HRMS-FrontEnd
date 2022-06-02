import { Col, Select, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { connect } from 'umi';
import CustomTag from '../../../CustomTag';
import styles from './index.less';

const { Option } = Select;
const colors = ['#006BEC', '#FF6CA1', '#6236FF', '#FE5D27'];

const EditResourceTypeContent = (props) => {
  const [form] = Form.useForm();
  const {
    visible = false,
    dispatch,
    editRecord: {
      estimatedEffort = '',
      billingStatus = '',
      noOfResources = '',
      division = '',
      comments = '',
      resourceType: { _id = '' } = {},
      id = '',
    } = {},
    projectDetails: {
      divisionList = [],
      skillList = [],
      titleList = [],
      projectDetail = {},
      billingStatusList = [],
    } = {},
    loadingFetchTitleList = false,
    onClose = () => {},
    refreshData = () => {},
    employee: { generalInfo: { legalName: ownerName = '' } = {} } = {} || {},
  } = props;

  const { projectId = '', projectName = '', engagementType = '', tags = [] } = projectDetail;

  // functions
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'projectDetails/fetchTitleListEffect',
      });
      dispatch({
        type: 'projectDetails/fetchSkillListEffect',
      });
      dispatch({
        type: 'projectDetails/fetchDivisionListEffect',
        payload: {
          name: 'Engineering',
        },
      });
      dispatch({
        type: 'projectDetails/fetchBillingStatusListEffect',
      });
    }
  }, [visible]);

  // search
  const onSearchDebounce = debounce((value) => {
    dispatch({
      type: 'projectDetails/fetchTitleListEffect',
      payload: {
        name: value,
      },
    });
  }, 500);

  const onTitleSearch = (value) => {
    onSearchDebounce(value);
  };

  const handleFinish = async (values) => {
    const res = await dispatch({
      type: 'projectDetails/editResourceTypeEffect',
      payload: {
        ...values,
        projectId,
        ownerName,
        id,
      },
    });
    if (res.statusCode === 200) {
      form.resetFields();
      onClose();
      refreshData();
    }
  };

  return (
    <div className={styles.EditResourceTypeContent}>
      <Form
        name="basic"
        form={form}
        id="myForm"
        onFinish={handleFinish}
        initialValues={{
          division,
          resourceType: _id,
          noOfResources,
          billingStatus,
          estimatedEffort,
          comments,
        }}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={7}>
            <div className={styles.item}>
              <span className={styles.label}>Project Name:</span>
              <span className={styles.value}>{projectName}</span>
            </div>
          </Col>
          <Col xs={24} md={7}>
            <div className={styles.item}>
              <span className={styles.label}>Engagement Type:</span>
              <span className={styles.value}>{engagementType}</span>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <div className={styles.item}>
              <span className={styles.label}>Tags:</span>
              <div className={styles.tags}>
                {typeof tags === 'object'
                  ? tags.map((t, i) => <CustomTag color={getColor(i)}>{t.tag_name}</CustomTag>)
                  : tags.map((t, i) => <CustomTag color={getColor(i)}>{t}</CustomTag>)}
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 0]} className={styles.belowPart}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Division"
              name="division"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Select placeholder="Select Division">
                {divisionList.map((x) => (
                  <Option value={x.name}>{x.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Resource Type"
              name="resourceType"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Select
                loading={loadingFetchTitleList}
                allowClear
                filterOption={false}
                placeholder="Select Resource Type"
                onSearch={onTitleSearch}
                showSearch
              >
                {titleList.map((x) => (
                  <Option value={x._id}>{x.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="No. of Resources"
              name="noOfResources"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="Enter No. of Resources" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Billing Status"
              name="billingStatus"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Select placeholder="Select Billing Status">
                {billingStatusList.map((x) => (
                  <Option value={x}>{x}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Estimated effort"
              name="estimatedEffort"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input addonAfter={<span>month/resource</span>} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Technologies Used" name="technologies" labelCol={{ span: 24 }}>
              <Select mode="multiple" placeholder="Select Technologies Used">
                {skillList.map((x) => (
                  <Option value={x._id}>{x.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Comments/Notes" name="comments" labelCol={{ span: 24 }}>
              <Input.TextArea placeholder="Add comments/notes" autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(
  ({ loading, projectDetails, user: { currentUser: { employee = {} } = {} } }) => ({
    employee,
    projectDetails,
    loadingFetchTitleList: loading.effects['projectDetails/fetchTitleListEffect'],
  }),
)(EditResourceTypeContent);
