import React, { Component } from 'react'
import { Button, Checkbox, DatePicker, Divider, Form, Select, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { isEmpty } from '@umijs/deps/compiled/lodash';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            durationFrom: '', // validate date
            durationTo: '', // validate date
            filter: {
                // store data
                name: undefined,
                title: undefined,
                priority: undefined,
                location: undefined,
                assign: undefined,
                fromDate: undefined,
                toDate: undefined,
            },
            isFilter: false, // check enable|disable button Apply
            checkAll: false,
        };

        this.formRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        const { filter } = this.state;
        if (JSON.stringify(prevState.filter) !== JSON.stringify(filter)) {
            this.validateFilterFields(filter);
        }
    }

    validateFilterFields = (filter) => {
        if (!filter.fromDate && !filter.toDate) {
            // in case without filter date
            const isEmptyValue = Object.values(filter).every(isEmpty);
            this.setState({
                isFilter: !isEmptyValue, // if all fields value is empty => means not filtering
            });
        } else if (filter.fromDate && filter.toDate) {
            // in case filter date, must select 2 date fields
            this.setState({
                isFilter: true,
            });
        } else {
            this.setState({
                isFilter: false,
            });
        }
    };

    clearFilter = () => {
        this.setState({
            filter: {
                name: undefined,
                title: [],
                priority: undefined,
                assign: undefined,
                location: [],
                fromDate: null,
                toDate: null,
            },
            isFilter: false,
            checkAll: false,
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

    onChangeDate = (currentDate, type) => {
        switch (type) {
            case 'fromDate':
                if (currentDate === null) {
                    this.setState({
                        durationFrom: '',
                    });
                } else {
                    this.setState({
                        durationFrom: currentDate,
                    });
                }
                break;

            case 'toDate':
                if (currentDate === null) {
                    this.setState({
                        durationTo: '',
                    });
                } else {
                    this.setState({
                        durationTo: currentDate,
                    });
                }
                break;

            default:
                break;
        }
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

    checkBoxStatusChecked = (id, field) => {
        const { filter } = this.state;
        let check = false;

        if (isEmpty(filter[field])) return check;

        filter[field].forEach((itemId) => {
            if (itemId === id) {
                check = true;
            }
        });

        return check;
    };

    onValuesChange = (value) => {
        const { filter } = this.state;

        this.setState({
            isFilter: true,
            filter: {
                ...filter,
                ...value,
            },
        });
    };

    onFinish = (value) => {
        const { filter } = this.state;
        const payload = { ...value, ...filter };
    };

    handleCheckAll = (e) => {
    };

    handleSelect = (value) => {
    };

    onSelectAll = (valueAll) => {
    };

    render() {
        const { TicketsList = [], locationList = [], currentStatus = '' } = this.props;
        const { isFilter, filter, checkAll } = this.state;
        const dateFormat = 'MMM DD, YYYY';
        const fieldsArray = [
            {
                label: 'BY NAME/USER ID',
                name: 'name',
                placeholder: 'Select name',
                optionArray: TicketsList,
            },
            {
                label: 'BY AVAILABLE STATUS',
                name: 'requestType',
                placeholder: 'Select request type',
                optionArray: TicketsList,
            },
            {
                label: 'BY DIVISION',
                name: 'priority',
                placeholder: 'Select priority',
                optionArray: TicketsList,
            },
            {
                label: 'BY DESIGNATION',
                name: 'loacation',
                placeholder: 'Select location',
                optionArray: locationList,
            },
            {
                label: 'BY SKILL',
                name: 'loacation',
                placeholder: 'Select location',
                optionArray: locationList,
            },
            {
                label: 'BY CURRENT PROJECT',
                name: 'loacation',
                placeholder: 'Select location',
                optionArray: locationList,
            },
            {
                label: 'BY BILLING STATUS',
                name: 'loacation',
                placeholder: 'Select location',
                optionArray: locationList,
            },
            {
                label: 'BY ASSIGN',
                name: 'assign',
                placeholder: 'Select assign',
                optionArray: TicketsList,
            },
        ];

        return (
          <div className={styles.filterForm}>
            <Form
              layout="horizontal"
              className={styles.form}
              onValuesChange={this.onValuesChange}
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
                                        const arrChild = option.props.children[1];
                                        return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                    }}
                      mode="multiple"
                      tagRender={this.tagRender}
                      placeholder={field.placeholder}
                      dropdownClassName={styles.dropdown}
                    >
                      {field.optionArray.map((option) => {
                                        return (
                                          <Option key={option._id} value={option._id}>
                                            <Checkbox
                                              value={option._id}
                                              checked={this.checkBoxStatusChecked(option._id, field.name)}
                                            />
                                            <span>{option.name}</span>
                                          </Option>
                                        );
                                    })}
                    </Select>
                  </Form.Item>
                        ))}
                <div className={styles.doj}>
                  <div className={styles.doj__label}>
                    <div className={styles.labelText}>BY REQUEST DATE</div>
                  </div>
                  <div className={styles.doj__date}>
                    <Form.Item name="fromDate">
                      <DatePicker
                        disabledDate={(currentDate) => this.disabledDate(currentDate, 'fromDate')}
                        format={dateFormat}
                        placeholder="From Date"
                        onChange={(value) => {
                                            this.onChangeDate(value, 'fromDate');
                                        }}
                        suffixIcon={
                          <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                                        }
                      />
                    </Form.Item>
                    <div className={`${styles.labelText} ${styles.labelTo}`}>to</div>
                    <Form.Item name="toDate">
                      <DatePicker
                        disabledDate={(currentDate) => this.disabledDate(currentDate, 'toDate')}
                        format={dateFormat}
                        placeholder="To Date"
                        onChange={(value) => {
                                            this.onChangeDate(value, 'toDate');
                                        }}
                        suffixIcon={
                          <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
                                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <Divider className={styles.divider} />
              <div className={styles.footer}>
                <Button onClick={this.clearFilter} className={styles.footer__clear}>
                  Clear
                </Button>
                <Button
                  onClick={this.onApply}
                            // disabled={!isFilter}
                  className={styles.footer__apply}
                  htmlType="submit"
                >
                  Apply
                </Button>
              </div>
            </Form>
          </div>
        )
    }
}

export default FilterForm
