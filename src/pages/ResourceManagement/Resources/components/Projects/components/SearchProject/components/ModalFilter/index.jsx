import React, { PureComponent } from 'react'
import { Button, Divider, Form, Select, Tag } from 'antd';
import moment from 'moment';
// import { connect } from 'umi';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
// import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

// @connect(({ loading, resourceManagement: 
//   { 
//     projectList = [], 
//     employeeList = [], 
//     divisions = [],
//     statusList=[],
//     titleList=[],
//   } = {} }) => ({
//   loading: loading.effects['resourceManagement/getListEmployee'],
//   projectList,
//   employeeList,
//   divisions,
//   statusList,
//   titleList
// }))
class ModalFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      durationFrom: '', 
      durationTo: '', 
      filter: {...props.filter},
    };

    this.formRef = React.createRef();
  }

  componentDidMount() {
  }

  clearFilter = () => {
    this.setState({
      filter: {
        nam: undefined,
        title: [],
        priority: undefined,
        assign: undefined,
        location: [],
        fromDate: null,
        toDate: null,
      },
      durationFrom: '',
      durationTo: '',
    });
    this.formRef.current.resetFields();
  };

  disabledDate = (currentDate, type) => {
    const { durationTo, durationFrom } = this.state;

    if (type === 'fromDate') {
      return (
        (currentDate && currentDate > moment(durationTo)) ||
        moment(currentDate).day() === 0 ||
        moment(currentDate).day() === 6
      );
    }

    return (
      (currentDate && currentDate < moment(durationFrom)) ||
      moment(currentDate).day() === 0 ||
      moment(currentDate).day() === 6
    );
  };

  tagRender = (props) => {
    const { label, closable, onClose } = props;
    return (
      <Tag
        className={styles.tags}
        closable={closable}
        onClose={onClose}
        closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
      >
        {label}
      </Tag>
    );
  };

  onValuesChange = (value) => {
    this.setState({
      filter: {...value}
    });
  };

  onFinish = (value) => {
    const {onFilterChange} = this.props;
    const { filter } = this.state;
    onFilterChange({...filter, ...value})
  };

  render() {
    const { employeeList = [], divisions = [] } = this.props;
    const employees = employeeList.map(x => {
        return {_id: x._id, name: x.generalInfo.legalName}
    })
    const division = divisions.map((x) => {
        return {_id: x, name: x} 
    })

    const fieldsArray = [
      {
        label: 'BY CUSTOMER NAME',
        name: 'name',
        placeholder: 'Select name',
        optionArray: employees,
      },
      {
        label: 'BY PROJECTNAME',
        name: 'tagDivision',
        mode : "multiple",
        placeholder: 'Select priority',
        optionArray: division,
      }
    ];
    const {filter} = this.props
    return (
      <div className={styles.filterForm}>
        <Form
          layout="horizontal"
          className={styles.form}
          initialValues={filter}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          <div className={styles.form__top}>
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
                  tagRender={this.tagRender}
                  placeholder={field.placeholder}
                  dropdownClassName={styles.dropdown}
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
           
          </div>

          <Divider className={styles.divider} />
          <div className={styles.footer}>
            <Button onClick={this.clearFilter} className={styles.footer__clear}>
              Clear
            </Button>
            <Button
              onClick={this.onApply}
              className={styles.footer__apply}
              htmlType="submit"
            >
              Apply
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default ModalFilter;
