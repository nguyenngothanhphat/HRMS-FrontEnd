import { Button, Checkbox, Form, Input, Modal, Select, Skeleton, Tag, Switch, Radio } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import styles from './index.less';

const { Option } = Select;

const state = { selectedRoleIds: [], timeSheetRequired: true };

@connect(
  ({
    loading,
    adminSetting: {
      viewingPosition = {},
      tempData: { listGrades = [], listDepartments = [], listRoles = [] } = {},
    } = {},
  }) => ({
    listDepartments,
    listRoles,
    listGrades,
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

  fetchRoleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchRoleList',
    });
  };

  fetchGradeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchGradeList',
    });
  };

  componentDidMount = () => {
    this.fetchDepartmentList();
    this.fetchRoleList();
    this.fetchGradeList();
  };

  componentDidUpdate = (prevProps) => {
    const { selectedPositionID = '' } = this.props;

    if (selectedPositionID && selectedPositionID !== prevProps.selectedPositionID) {
      this.fetchPositionByID(selectedPositionID);
    }
  };

  fetchPositionByID = async (id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'adminSetting/fetchPositionByID',
      payload: {
        id,
      },
    });
    if (res.statusCode === 200) {
      this.setState({
        selectedRoleIds: res.data.roles || [],
      });
    }
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
    const {
      name = '',
      department = '',
      gradeObj = '',
      timeSheetRequired = false,
      timeSheetAdvancedMode = false,
    } = values;

    const { selectedRoleIds: roles = [] } = this.state;

    const addPosition = async () => {
      const res = await dispatch({
        type: 'adminSetting/addPosition',
        payload: {
          name,
          gradeObj,
          department,
          roles,
          timeSheetRequired,
          timeSheetAdvancedMode,
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
          gradeObj,
          roles,
          timeSheetRequired,
          timeSheetAdvancedMode,
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

    const checkedStatus = (idSync) => {
      let check = false;
      selectedRoleIds.forEach((itemId) => {
        if (itemId === idSync) {
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
          value={role.idSync}
          key={`${index + 1}`}
          disabled={loading}
        >
          <Checkbox
            value={role.idSync}
            onChange={(e) => this.onCheckbox(e, roles)}
            checked={checkedStatus(role.idSync)}
          >
            <div>{role.idSync}</div>
          </Checkbox>
        </Option>
      );
    });
  };

  onAddOption = (idSync) => {
    const { selectedRoleIds } = this.state;
    const listIdsTemp = JSON.parse(JSON.stringify(selectedRoleIds));

    listIdsTemp.push(idSync);

    this.setState({
      selectedRoleIds: listIdsTemp,
    });
  };

  onRemoveOption = (idSync) => {
    const { selectedRoleIds } = this.state;
    let listIdsTemp = JSON.parse(JSON.stringify(selectedRoleIds));

    listIdsTemp = listIdsTemp.filter((item) => item !== idSync);
    this.setState({
      selectedRoleIds: listIdsTemp,
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
    const { selectedRoleIds } = this.state;
    if (selectedRoleIds.length === 0) return '';

    return (
      <div className={styles.listTags}>
        {selectedRoleIds.map((item) => {
          return (
            <Tag
              closable
              key={item}
              className={styles.nameTag}
              onClose={() => this.onRemoveOption(item)}
              closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
            >
              {item}
            </Tag>
          );
        })}
      </div>
    );
  };

  renderGradeList = () => {
    const { listGrades = [] } = this.props;
    return listGrades.map((grade) => <Option value={grade._id}>{grade.name}</Option>);
  };

  render() {
    const {
      visible = false,
      action = '',
      listDepartments = [],
      listRoles = [],
      loadingFetchDepartmentList = false,
      loadingFetchPositionByID = false,
      loadingUpdatePosition = false,
      loadingAddPosition = false,
      viewingPosition: {
        department: departmentProp = '',
        name: nameProp = '',
        gradeObj: gradeObjProp = '',
        timeSheetRequired: timeSheetRequiredProp = false,
        timeSheetAdvancedMode: timeSheetAdvancedModeProp = false,
      } = {},
    } = this.props;

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
                      gradeObj: gradeObjProp?._id || '',
                      timeSheetRequired: timeSheetRequiredProp,
                      timeSheetAdvancedMode: timeSheetAdvancedModeProp,
                    }
              }
            >
              <Form.Item
                rules={[{ required: true, message: 'Please select the department name!' }]}
                label="Department Name"
                name="department"
                labelCol={{ span: 24 }}
              >
                <Select
                  showSearch
                  loading={loadingFetchDepartmentList}
                  placeholder="Select the department name"
                >
                  {listDepartments.map((d) => {
                    return <Option value={d._id}>{d.name}</Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: 'Please enter the position name!' }]}
                label="Position Name"
                name="name"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Select enter position name" />
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
                    this.onAddOption(value, listRoles);
                  }}
                  onDeselect={(value) => {
                    this.onRemoveOption(value, listRoles);
                  }}
                >
                  {this.renderRoles(listRoles)}
                </Select>
                {this.renderRolesName()}
              </Form.Item>

              <Form.Item
                label="Grade Level"
                name="gradeObj"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select the grade level' }]}
              >
                <Select
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  showSearch
                  allowClear
                  placeholder="Select the grade level"
                >
                  {this.renderGradeList()}
                </Select>
              </Form.Item>

              <div className={styles.timeSheetRequired}>
                <Form.Item
                  name="timeSheetRequired"
                  labelCol={{ span: 24 }}
                  valuePropName="checked"
                  style={{
                    display: 'inline',
                    marginBottom: 0,
                  }}
                >
                  <Switch defaultChecked={action === 'add' ? true : timeSheetRequiredProp} />
                </Form.Item>
                <span className={styles.titleText}>Timesheet Required</span>
              </div>

              {/* {timeSheetRequired && ( */}
              <Form.Item name="timeSheetAdvancedMode" labelCol={{ span: 24 }}>
                <Radio.Group defaultValue={timeSheetAdvancedModeProp}>
                  <Radio value={false}>Simple Timesheet</Radio>
                  <Radio value>Complex Timesheet</Radio>
                </Radio.Group>
              </Form.Item>
              {/* )} */}
            </Form>
          )}
        </Modal>
      </>
    );
  }
}

export default EditModal;
