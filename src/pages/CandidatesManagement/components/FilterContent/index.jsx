import { Form, Input, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { filteredArr } from '@/utils/utils';
import styles from './index.less';
import { getCurrentTenant } from '@/utils/authority';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const { dispatch, statusList = [], filter = [], onFilter = () => {}, setForm = () => {} } = props;

  const formatProcessStatus = filteredArr(
    statusList.map((item) => {
      return {
        label: item,
        value: item,
      };
    }),
  );

  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
    form.setFieldsValue({
      ...filter,
    });
  }, [JSON.stringify(filter)]);

  useEffect(() => {
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
      type: 'candidatesManagement/fetchCandidatesList',
      payload: { tenantId: getCurrentTenant(), ...filterTemp },
    });
    onFilter(filterTemp);
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    let result = [...allValues.processStatus];
    if (allValues.processStatus.includes('all')) {
      result = formatProcessStatus.map((x) => x.value);
      form.setFieldsValue({
        processStatus: result,
      });
      onFinishDebounce(result);
    } else onFinishDebounce(allValues);
  };

  return (
    <Form
      layout="vertical"
      name="filter"
      onValuesChange={onValuesChange}
      form={form}
      className={styles.FilterContent}
    >
      <Form.Item label="Progress Status" name="processStatus">
        <Select
          placeholder="Enter status"
          mode="multiple"
          allowClear
          showArrow
          style={{ width: '100%' }}
        >
          <Select.Option value="all">Select All</Select.Option>
          {formatProcessStatus.map((x) => {
            return (
              <Select.Option value={x.value} key={x.value}>
                {x.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default connect(({ candidatesManagement: { statusList = [] } = {} }) => ({
  statusList,
}))(FilterContent);
