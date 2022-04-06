/* eslint-disable react/jsx-curly-newline */
import { Form, Select, AutoComplete, Input, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchIcon from '@/assets/directory/search.svg';
import { VIEW_TYPE } from '@/utils/timeSheet';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    timeSheet: { financeViewList = [], projectTypeList = [], resourceList = [] } = {},
    type: viewType = '',
    loadingFetchProjectnameList = false,
  } = props;

  const [projectNameListState, setProjectNameListState] = useState([]);

  const [searchIcons, setSearchIcons] = useState({
    projectName: false,
  });

  useEffect(() => {
    setProjectNameListState(
      financeViewList.map((x) => {
        return {
          value: x?.projectName,
          label: x?.projectName,
        };
      }),
    );
  }, [JSON.stringify(projectNameListState)]);

  useEffect(() => {
    dispatch({
      type: 'timeSheet/fetchProjectTypeListEffect',
    });
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
    onFinishDebounce(values);
  };

  const onSearchEmployeeDebounce = debounce((type, value) => {
    let typeTemp = '';
    switch (type) {
      case 'projectName':
        typeTemp = 'timeSheet/fetchFinanceTimesheetEffect';
        break;
      default:
        break;
    }
    if (typeTemp && value) {
      dispatch({
        type: typeTemp,
        payload: {
          search: value,
        },
      });
    }
    if (!value) {
      switch (type) {
        case 'projectName':
          setProjectNameListState([]);
          break;
        default:
          break;
      }
    }
  }, 1000);

  const handleEmployeeSearch = (type, value) => {
    onSearchEmployeeDebounce(type, value);
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
      <Form.Item label="by project name" name="projectName">
        <AutoComplete
          dropdownMatchSelectWidth={252}
          notFoundContent={loadingFetchProjectnameList ? <Spin /> : 'No matches'}
          options={projectNameListState}
          onSearch={(val) => handleEmployeeSearch('projectName', val)}
          onFocus={() => setSearchIcons({ ...searchIcons, id: true })}
          onBlur={() => setSearchIcons({ ...searchIcons, id: false })}
        >
          <Input
            placeholder="Search by Project Name"
            prefix={searchIcons.id ? <img src={SearchIcon} alt="search" /> : null}
            allowClear
          />
        </AutoComplete>
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
        >
          {projectTypeList.map((x) => (
            <Select.Option value={x.id}>{x.type_name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      {viewType === VIEW_TYPE.W && (
        <Form.Item label="By resources" name="resources">
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
          >
            {resourceList.map((x) => {
              return (
                <Select.Option value={x} key={x}>
                  {x}
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
  loadingFetchProjectnameList: loading.effects['timeSheet/fetchFinanceTimesheetEffect'],
}))(FilterContent);
