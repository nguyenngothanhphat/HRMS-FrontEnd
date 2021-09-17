import { Button, Checkbox, Form, Input, Modal, Select, Skeleton, Tag } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import styles from './index.less';

const { Option } = Select;

const state = { selectedRoleIds: [], selectedRolesTags: [] };

@connect(
  ({
    loading,
    adminSetting: { viewingPosition = {}, tempData: { listDepartments = [] } = {} } = {},
  }) => ({
    listDepartments,
    viewingPosition,
    loadingFetchDepartmentList: loading.effects['adminSetting/fetchDepartmentList'],
    loadingFetchPositionByID: loading.effects['adminSetting/fetchPositionByID'],
    loadingAddPosition: loading.effects['adminSetting/addPosition'],
    loadingUpdatePosition: loading.effects['adminSetting/updatePosition'],
  }),
)
class EditModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = state;
  }

  fetchDepartmentList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchDepartmentList',
    });
  };

  componentDidMount = () => {
    this.fetchDepartmentList();
  };

  componentDidUpdate = (prevProps) => {
    const { selectedPositionID = '' } = this.props;

    if (selectedPositionID && selectedPositionID !== prevProps.selectedPositionID) {
      this.fetchPositionByID(selectedPositionID);
    }
  };

  fetchPositionByID = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchPositionByID',
      payload: {
        id,
      },
    });
  };

  renderHeaderModal = () => {
    const { action = 'add' } = this.props;
    let title = 'Add New Position';
    if (action === 'edit') {
      title = 'Edit Position';
    }
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  onFinish = async (values) => {
    const { dispatch, selectedPositionID = '', onRefresh = () => {} } = this.props;
    const { name = '', department = '', grade = '', timesheetRequired = false } = values;

    const addPosition = async () => {
      const res = await dispatch({
        type: 'adminSetting/addPosition',
        payload: {
          name,
          grade,
          department,
          timesheetRequired,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };
    const editPosition = async () => {
      const res = await dispatch({
        type: 'adminSetting/updatePosition',
        payload: {
          id: selectedPositionID,
          name,
          department,
          grade,
          timesheetRequired,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };

    const { action = '' } = this.props;
    if (action === 'add') {
      addPosition();
    }
    if (action === 'edit') {
      editPosition();
    }
  };

  handleCancel = () => {
    const { dispatch, onClose = () => {} } = this.props;
    this.formRef.current.resetFields();
    this.setState(state);
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingPosition: {},
      },
    });

    onClose(false);
  };

  renderRoles = (roles) => {
    const { selectedRoleIds } = this.state;
    const { loading } = this.props;

    const checkedStatus = (id) => {
      let check = false;
      selectedRoleIds.forEach((itemId) => {
        if (itemId === id) {
          check = true;
        }
      });

      return check;
    };

    return roles.map((role, index) => {
      const className = index % 2 === 0 ? styles.evenClass : styles.oddClass;
      return (
        <Option
          className={`${styles.optionSelect} ${className}`}
          value={role._id}
          key={`${index + 1}`}
          disabled={loading}
        >
          <Checkbox
            value={role._id}
            onChange={(e) => this.onCheckbox(e, roles)}
            checked={checkedStatus(role._id)}
          >
            <div>{role.name}</div>
          </Checkbox>
        </Option>
      );
    });
  };

  onAddOption = (id, roles) => {
    const { selectedRoleIds } = this.state;
    const listIdsTemp = JSON.parse(JSON.stringify(selectedRoleIds));

    listIdsTemp.push(id);
    const listTagsTemp = roles.filter((item) => {
      return listIdsTemp.includes(item._id);
    });
    console.log('------- ADD ----------');
    console.log('ids', listIdsTemp);
    console.log('tags', listTagsTemp);

    this.setState({
      selectedRoleIds: listIdsTemp,
      selectedRolesTags: listTagsTemp,
    });
  };

  onRemoveOption = (id, roles) => {
    const { selectedRoleIds, selectedRolesTags } = this.state;
    let listIdsTemp = JSON.parse(JSON.stringify(selectedRoleIds));
    let listTagsTemp = JSON.parse(JSON.stringify(selectedRolesTags));

    listIdsTemp = listIdsTemp.filter((item) => item !== id);
    listTagsTemp = listTagsTemp.filter((item) => item._id !== id);

    console.log('------- REMOVE ----------');
    console.log('ids', listIdsTemp);
    console.log('tags', listTagsTemp);

    this.setState({
      selectedRoleIds: listIdsTemp,
      selectedRolesTags: listTagsTemp,
    });
  };

  onCheckbox = (e, roles) => {
    const { checked, value } = e.target || {};

    if (checked) {
      this.onAddOption(value, roles);
    } else {
      this.onRemoveOption(value);
    }
  };

  renderRolesName = () => {
    const { selectedRolesTags } = this.state;
    if (selectedRolesTags.length === 0) return '';

    return (
      <div className={styles.listTags}>
        {selectedRolesTags.map((item) => {
          return (
            <Tag
              closable
              key={item._id}
              className={styles.nameTag}
              onClose={() => this.onRemoveOption(item._id)}
              closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
            >
              {item?.name}
            </Tag>
          );
        })}
      </div>
    );
  };

  render() {
    const {
      visible = false,
      action = '',
      listDepartments = [],
      loadingFetchDepartmentList = false,
      loadingFetchPositionByID = false,
      loadingUpdatePosition = false,
      loadingAddPosition = false,
      viewingPosition: {
        department: departmentProp = '',
        name: nameProp = '',
        grade: gradeProp = '',
        timeSheetRequired: timeSheetRequiredProp = false,
      } = {},
    } = this.props;
    const roles = [
      {
        _id: 1,
        name: 'Employee',
      },
      {
        _id: 2,
        name: 'HR',
      },
      {
        _id: 3,
        name: 'Admin',
      },
      {
        _id: 4,
        name: 'Manager',
      },
    ];

    const roleClassName = `${styles.InputReportees} ${styles.placeholderReportees}`;

    return (
      <>
        <Modal
          className={styles.EditModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              // disabled={!nameState || !descriptionState || selectedList.length === 0}
              loading={loadingUpdatePosition || loadingAddPosition}
            >
              {action === 'add' ? 'Add' : 'Update'}
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          {loadingFetchPositionByID ? (
            <Skeleton />
          ) : (
            <Form
              name="basic"
              ref={this.formRef}
              id="myForm"
              onFinish={this.onFinish}
              initialValues={
                action === 'add'
                  ? {}
                  : {
                      department: departmentProp,
                      name: nameProp,
                      grade: gradeProp,
                      timeSheetRequired: timeSheetRequiredProp,
                    }
              }
            >
              <Form.Item
                rules={[{ required: true, message: 'Please enter department name!' }]}
                label="Department Name"
                name="department"
                labelCol={{ span: 24 }}
              >
                <Select showSearch loading={loadingFetchDepartmentList}>
                  {listDepartments.map((d) => {
                    return <Option value={d._id}>{d.name}</Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: 'Please enter position name!' }]}
                label="Position Name"
                name="name"
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Roles"
                name="roles"
                labelCol={{ span: 24 }}
                // rules={[{ required: true, message: 'Please select a role' }]}
                className={styles.formItem}
              >
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  className={roleClassName}
                  onSelect={(value) => {
                    this.onAddOption(value, roles);
                  }}
                  onDeselect={(value) => {
                    this.onRemoveOption(value, roles);
                  }}
                >
                  {this.renderRoles(roles)}
                </Select>
                {this.renderRolesName()}
              </Form.Item>

              <Form.Item
                label="Grade Level"
                name="grade"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select Grade Level' }]}
              >
                <Select
                  filterOption={(input, option) => {
                    return (
                      option.children[1].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  showSearch
                  allowClear
                >
                  <Option value="0">0</Option>
                  <Option value="1">1</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timesheetRequired"
                labelCol={{ span: 24 }}
                valuePropName="timeSheetRequiredProp"
              >
                <Checkbox defaultChecked={timeSheetRequiredProp}>Timesheet Required</Checkbox>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </>
    );
  }
}

export default EditModal;
