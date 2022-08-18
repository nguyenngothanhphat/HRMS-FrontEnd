import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import CalendarIcon from '@/assets/calendar_icon.svg';
// import SearchIcon from '@/assets/directory/search.svg';
import { dateFormatAPI } from '@/constants/timeSheet';
import styles from './index.less';
import DebounceSelect from '@/components/DebounceSelect';
import { removeEmptyFields } from '@/utils/utils';

const { Option } = Select;

const FilterContent = (props) => {
  const [form] = Form.useForm();

  const {
    // eslint-disable-next-line no-unused-vars
    dispatch,
    filter = {},
    onFilterChange = () => {},
    statusList = [],
    projectList = [],
    divisions = [],
    titleList = [],
    listSkill = [],
  } = props;

  const onEmployeeSearch = (val) => {
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'resourceManagement/getListEmployee',
      payload: {
        name: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfoInfo?.legalName,
        value: user.generalInfoInfo?.legalName,
      }));
    });
  };

  useEffect(() => {
    if (Object.keys(filter).length === 0) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  const onFinish = (values) => {
    const result = { ...values };
    if (result.startFromDate) {
      result.startFromDate = moment(result.startFromDate).format(dateFormatAPI);
    }
    if (result.startToDate) {
      result.startToDate = moment(result.startToDate).format(dateFormatAPI);
    }
    if (result.tentativeEndDateStart) {
      result.tentativeEndDateStart = moment(result.tentativeEndDateStart).format(dateFormatAPI);
    }
    if (result.tentativeEndDateEnd) {
      result.tentativeEndDateEnd = moment(result.tentativeEndDateEnd).format(dateFormatAPI);
    }

    onFilterChange(result);
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 1000);

  const onValuesChange = (changeValues, allValues) => {
    onFinishDebounce(removeEmptyFields(allValues));
  };

  const division = divisions.map((x) => {
    return { _id: x.name, name: x.name };
  });
  const projects = projectList.map((x) => {
    return { _id: x.id, name: x.projectName };
  });

  const statuses = statusList.map((x) => {
    return { _id: x, name: x };
  });

  const titles = titleList.map((x) => {
    return { _id: x._id, name: x.name };
  });

  const tagDefaultLis = listSkill.map((x) => {
    return { _id: x._id, name: x.name };
  });

  const fieldsArray = [
    {
      label: 'BY DIVISION',
      name: 'tagDivision',
      mode: 'multiple',
      placeholder: 'Select the division',
      optionArray: division,
    },
    {
      label: 'BY DESIGNATION',
      name: 'title',
      mode: 'multiple',
      placeholder: 'Select the designation',
      optionArray: titles,
    },
    {
      label: 'BY SKILL',
      name: 'skills',
      placeholder: 'Select the location',
      mode: 'multiple',
      optionArray: tagDefaultLis,
    },
    {
      label: 'BY CURRENT PROJECT',
      name: 'projects',
      placeholder: 'Select the project',
      mode: 'multiple',
      optionArray: projects,
    },
    {
      label: 'BY BILLING STATUS',
      name: 'statuses',
      placeholder: 'Select the billing status',
      mode: 'multiple',
      optionArray: statuses,
    },
  ];

  return (
    <div className={styles.FilterContent}>
      <Form
        layout="vertical"
        className={styles.form}
        // initialValues={filterProp}
        onValuesChange={onValuesChange}
        id="myForm"
        onFinish={onFinish}
        form={form}
      >
        <div className={styles.form__top}>
          <Form.Item label="BY NAME/USER ID" name="userName">
            <DebounceSelect
              allowClear
              showArrow
              placeholder="Select employee"
              mode="multiple"
              fetchOptions={onEmployeeSearch}
              showSearch
            />
          </Form.Item>
          {fieldsArray.map((field) => (
            <Form.Item key={field.name} label={field.label} name={field.name}>
              <Select
                allowClear
                showArrow
                showSearch
                filterOption={(input, option) => {
                  return (
                    input &&
                    ((option.key && option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0) ||
                      (option.label &&
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0))
                  );
                }}
                mode={field.mode || ''}
                placeholder={field.placeholder}
                loading={field.loading}
                disabled={field.loading}
              >
                {field.optionArray.map((option) => {
                  return (
                    <Option key={option._id} value={option._id} label={option.name}>
                      <span>{option.name}</span>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          ))}

          <Form.Item label="By EXPERIENCE">
            <Row>
              <Col span={11}>
                <Form.Item
                  name="expYearBegin"
                  rules={[
                    {
                      pattern: /^-?\d*(\.\d*)?$/,
                      message: 'Only accept number',
                    },
                  ]}
                >
                  <Input className={styles.experience} placeholder="Years of Exp" />
                </Form.Item>
              </Col>
              <Col span={2} className={styles.separator}>
                <span>to</span>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="expYearEnd"
                  rules={[
                    {
                      pattern: /^-?\d*(\.\d*)?$/,
                      message: 'Only accept number',
                    },
                  ]}
                >
                  <Input className={styles.experience} placeholder="Years of Exp" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="By Start Date">
            <Row>
              <Col span={11}>
                <Form.Item name="startFromDate">
                  <DatePicker
                    format={DATE_FORMAT_MDY}
                    placeholder="From Date"
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={2} className={styles.separator}>
                <span>to</span>
              </Col>
              <Col span={11}>
                <Form.Item name="startToDate">
                  <DatePicker
                    format={DATE_FORMAT_MDY}
                    placeholder="To Date"
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="BY TENTATIVE END DATE">
            <Row>
              <Col span={11}>
                <Form.Item name="tentativeEndDateStart">
                  <DatePicker
                    format={DATE_FORMAT_MDY}
                    placeholder="From Date"
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={2} className={styles.separator}>
                <span>to</span>
              </Col>
              <Col span={11}>
                <Form.Item name="tentativeEndDateEnd">
                  <DatePicker
                    format={DATE_FORMAT_MDY}
                    placeholder="To Date"
                    suffixIcon={
                      <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({
    loading,
    resourceManagement: {
      projectList = [],
      employeeList = [],
      divisions = [],
      statusList = [],
      titleList = [],
      listSkill = [],
    } = {},
  }) => ({
    loadingFetchEmployeeNameList: loading.effects['resourceManagement/getListEmployee'],
    projectList,
    employeeList,
    divisions,
    statusList,
    listSkill,
    titleList,
  }),
)(FilterContent);
