import { Checkbox, Form, Input, Radio, Select, Skeleton, Spin, Switch, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import styles from './index.less';

const { Option } = Select;

const EditModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    selectedPositionID = '',
    visible = false,
    action = '',
    listDepartments = [],
    listRoles = [],
    listGrades = [],
    loadingFetchDepartmentList = false,
    loadingFetchPositionByID = false,
    viewingPosition: {
      department: departmentProp = '',
      name: nameProp = '',
      gradeObj: gradeObjProp = '',
      timeSheetRequired: timeSheetRequiredProp = false,
      timeSheetAdvancedMode: timeSheetAdvancedModeProp = false,
      eligibleForCompOff: eligibleForCompOffProp = false,
    } = {},
    viewingPosition = {},
    dispatch,
    onClose = () => {},
    loading = false,
    onRefresh = () => {},
  } = props;

  const [selectedRoleIds, setSelectedRoleIds] = useState([]);

  const fetchDepartmentList = () => {
    dispatch({
      type: 'adminSetting/fetchDepartmentList',
    });
  };

  const fetchRoleList = () => {
    dispatch({
      type: 'adminSetting/fetchRoleList',
    });
  };

  const fetchGradeList = () => {
    dispatch({
      type: 'adminSetting/fetchGradeList',
    });
  };

  useEffect(() => {
    fetchDepartmentList();
    fetchRoleList();
    fetchGradeList();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      department: departmentProp,
      name: nameProp,
      gradeObj: gradeObjProp,
      timeSheetRequired: timeSheetRequiredProp,
      timeSheetAdvancedMode: timeSheetAdvancedModeProp,
      eligibleForCompOff: eligibleForCompOffProp,
    });
  }, [JSON.stringify(viewingPosition)]);

  const fetchPositionByID = async (id) => {
    const res = await dispatch({
      type: 'adminSetting/fetchPositionByID',
      payload: {
        id,
      },
    });
    if (res.statusCode === 200) {
      setSelectedRoleIds(res.data?.roles || []);
    }
  };

  useEffect(() => {
    if (selectedPositionID && visible) {
      fetchPositionByID(selectedPositionID);
    }
  }, [selectedPositionID]);

  const handleDone = () => {
    form.resetFields();
    setSelectedRoleIds([]);
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingPosition: {},
      },
    });

    onClose(false);
  };
  const onFinish = async (values) => {
    const addPosition = async () => {
      const res = await dispatch({
        type: 'adminSetting/addPosition',
        payload: {
          ...values,
          roles: selectedRoleIds,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        handleDone();
      }
    };
    const editPosition = async () => {
      const res = await dispatch({
        type: 'adminSetting/updatePosition',
        payload: {
          ...values,
          id: selectedPositionID,
          roles: selectedRoleIds,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        handleDone();
      }
    };

    if (action === 'add') {
      addPosition();
    }
    if (action === 'edit') {
      editPosition();
    }
  };

  const onAddOption = (idSync) => {
    const listIdsTemp = JSON.parse(JSON.stringify(selectedRoleIds));

    listIdsTemp.push(idSync);
    setSelectedRoleIds(listIdsTemp);
  };

  const onRemoveOption = (idSync) => {
    let listIdsTemp = JSON.parse(JSON.stringify(selectedRoleIds));

    listIdsTemp = listIdsTemp.filter((item) => item !== idSync);
    setSelectedRoleIds(listIdsTemp);
  };

  const onCheckbox = (e, roles) => {
    const { checked, value } = e.target || {};

    if (checked) {
      onAddOption(value, roles);
    } else {
      onRemoveOption(value);
    }
  };

  const renderRoles = (roles) => {
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
            onChange={(e) => onCheckbox(e, roles)}
            checked={checkedStatus(role.idSync)}
          >
            <div>{role.idSync}</div>
          </Checkbox>
        </Option>
      );
    });
  };

  const renderRolesName = () => {
    if (selectedRoleIds.length === 0) return '';

    return (
      <div className={styles.listTags}>
        {selectedRoleIds.map((item) => {
          return (
            <Tag
              closable
              key={item}
              className={styles.nameTag}
              onClose={() => onRemoveOption(item)}
              closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
            >
              {item}
            </Tag>
          );
        })}
      </div>
    );
  };

  const renderGradeList = () => {
    return listGrades.map((grade) => <Option value={grade._id}>{grade.name}</Option>);
  };

  const roleClassName = `${styles.InputReportees} ${styles.placeholderReportees}`;

  return (
    <>
      <div className={styles.EditModalContent}>
        <Spin spinning={loadingFetchPositionByID}>
          <Form name="basic" form={form} id="myForm" onFinish={onFinish}>
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
                  onAddOption(value, listRoles);
                }}
                onDeselect={(value) => {
                  onRemoveOption(value, listRoles);
                }}
              >
                {renderRoles(listRoles)}
              </Select>
              {renderRolesName()}
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
                {renderGradeList()}
              </Select>
            </Form.Item>

            <Form.Item name="eligibleForCompOff" labelCol={{ span: 24 }} valuePropName="checked">
              <Checkbox defaultChecked={eligibleForCompOffProp}>Eligible For Comp Off</Checkbox>
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
        </Spin>
      </div>
    </>
  );
};

export default connect(
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
  }),
)(EditModalContent);
