/* eslint-disable react/jsx-curly-newline */
import { Form, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { VIEW_TYPE } from '@/utils/timeSheet';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    timeSheet: { projectTypeList = [], projectList = [], employeeNameList = [] } = {},
    type: viewType = '',
    loadingFetchEmployeeNameList = false,
    loadingFetchProjectTypeList = false,
    loadingFetchProjectList = false,
    setApplied,
    setForm,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'timeSheet/fetchProjectTypeListEffect',
    });
    dispatch({
      type: 'timeSheet/fetchProjectListEffect',
    });
    dispatch({
      type: 'timeSheet/fetchEmployeeNameListEffect',
    });
    setForm(form);
  }, []);

  // FUNCTIONALITY
  const onFinish = (values) => {
    const newValues = { ...values };

    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const filterTemp = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0 || !v
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );

    // dispatch action
    dispatch({
      type: 'timeSheet/save',
      payload: { filterFinance: filterTemp },
    });
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    const filteredObj = Object.entries(values).filter(
      ([key, value]) => value !== undefined && value.length > 0,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    onFinishDebounce(values);
  };

  return (
    <Form
      layout="vertical"
      name="filter"
      // onFinish={onFinish}
      onValuesChange={onValuesChange}
      form={form}
      className={styles.FilterContent}
    >
      <Form.Item label="By Project" name="projectName">
        <Select
          allowClear
          showSearch
          mode="multiple"
          loading={loadingFetchProjectList}
          style={{ width: '100%' }}
          placeholder="Search by Project"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
        >
          {projectList.map((x) => {
            return (
              <Select.Option value={x.id} key={x.id}>
                {x.projectName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By type" name="engagementType">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Type"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
          loading={loadingFetchProjectTypeList}
        >
          {projectTypeList.map((x) => (
            <Select.Option value={x.id}>{x.type_name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      {viewType === VIEW_TYPE.W && (
        <Form.Item label="By resources" name="resourceList">
          <Select
            allowClear
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Search by Resources"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showArrow
            loading={loadingFetchEmployeeNameList}
          >
            {employeeNameList.map((x) => {
              const { generalInfo: { legalName = '' } = {}, _id: employeeId = '' } = x;
              return (
                <Select.Option value={employeeId} key={employeeId}>
                  {legalName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      )}
    </Form>
  );
};

export default connect(({ loading, timeSheet }) => ({
  timeSheet,
  loadingFetchEmployeeNameList: loading.effects['timeSheet/fetchEmployeeNameListEffect'],
  loadingFetchProjectList: loading.effects['timeSheet/fetchProjectListEffect'],
  loadingFetchProjectTypeList: loading.effects['timeSheet/fetchProjectTypeListEffect'],
}))(FilterContent);
