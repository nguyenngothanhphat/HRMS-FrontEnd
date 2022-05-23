import { Col, Divider, Form, Input, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const EditProjectModalContent = (props) => {
  const {
    dispatch,
    onClose = () => {},
    onRefresh = () => {},
    selectedProject: {
      engagementTypeId = '',
      projectName = '',
      projectAlias = '',
      projectManager: { _id: projectManagerId = '' } = {},
      engineeringOwner: { _id: engineeringOwnerId = '' } = {},
      division = '',
      tags = [],
    } = {},
    selectedProject,
    visible = false,
  } = props;

  const {
    projectManagement: {
      projectTypeList = [],
      tagList = [],
      divisionList = [],
      employeeList = [],
    } = {},
    loadingFetchEmployeeList = false,
  } = props;

  const formRef = React.createRef();

  const handleFinish = async (values) => {
    const res = await dispatch({
      type: 'projectManagement/updateProjectEffect',
      payload: {
        id: selectedProject.id,
        engagement_type: values.engagementType,
        project_name: values.projectName,
        project_alias: values.projectAlias,
        project_manager: values.projectManager,
        engineering_owner: values.engineeringOwner,
        division: values.division,
        tags: values.tags || values.tags.tag_name,
      },
    });
    if (res.statusCode === 200) {
      onRefresh();
      onClose();
    }
  };

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'projectManagement/fetchProjectTypeListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchTagListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchDivisionListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchEmployeeListEffect',
      });
    }
  }, [visible]);

  return (
    <div className={styles.EditProjectModalContent}>
      <Form
        name="basic"
        ref={formRef}
        id="myForm"
        onFinish={handleFinish}
        initialValues={{
          engagementType: engagementTypeId,
          projectName,
          projectAlias,
          projectManager: projectManagerId,
          engineeringOwner: engineeringOwnerId,
          division,
          tags: tags.map((item) => item.tag_name),
        }}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[{ required: true, message: 'Select Engagement Type' }]}
              label="Engagement Type"
              name="engagementType"
              fieldKey="engagementType"
              labelCol={{ span: 24 }}
            >
              <Select
                placeholder="Select Engagement Type"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projectTypeList.map((x) => (
                  <Option value={x.id}>{x.type_name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[{ required: true, message: 'Enter Project Name' }]}
              label="Project Name"
              name="projectName"
              fieldKey="projectName"
              labelCol={{ span: 24 }}
            >
              <Input placeholder="Enter Project Name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Project Alias (Optional)"
              name="projectAlias"
              fieldKey="projectAlias"
              labelCol={{ span: 24 }}
            >
              <Input placeholder="Enter Project Alias" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[{ required: true, message: 'Select Project Manager' }]}
              label="Project Manager"
              name="projectManager"
              fieldKey="projectManager"
              labelCol={{ span: 24 }}
            >
              <Select
                loading={loadingFetchEmployeeList}
                placeholder="Select Project Manager"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                disabled={loadingFetchEmployeeList}
              >
                {employeeList.map((x) => (
                  <Option value={x._id}>{x?.generalInfo?.legalName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[{ required: true, message: 'Select Engineering Owner' }]}
              label="Engineering Owner"
              name="engineeringOwner"
              fieldKey="engineeringOwner"
              labelCol={{ span: 24 }}
            >
              <Select
                disabled={loadingFetchEmployeeList}
                loading={loadingFetchEmployeeList}
                placeholder="Select Engineering Owner"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {employeeList.map((x) => (
                  <Option value={x._id}>{x?.generalInfo?.legalName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[{ required: true, message: 'Select Division' }]}
              label="Division"
              name="division"
              fieldKey="division"
              labelCol={{ span: 24 }}
            >
              <Select
                placeholder="Select Division"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {divisionList.map((x) => (
                  <Option value={x.name}>{x.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[{ required: true, message: 'Select Tags' }]}
              label="Tags"
              name="tags"
              fieldKey="tags"
              labelCol={{ span: 24 }}
            >
              <Select
                mode="multiple"
                placeholder="Select Groups"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {tagList.map((x) => (
                  <Option value={x.tag_name}>{x.tag_name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ projectManagement = {}, loading }) => ({
  projectManagement,
  loadingFetchEmployeeList: loading.effects['projectManagement/fetchEmployeeListEffect'],
}))(EditProjectModalContent);
