import React, { Component } from 'react'
import { Button, Checkbox, DatePicker, Divider, Form, Select, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
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
                processStatus: undefined,
                title: undefined,
                location: undefined,
                fromDate: undefined,
                toDate: undefined,
            },
            isFilter: false, // check enable|disable button Apply
            checkAll: false,
        };

        this.formRef = React.createRef();
    }

    validateFilterFields = (filter) => {
    };

    clearFilter = () => {
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

    };

    checkBoxStatusChecked = (id, field) => {

    };

    onValuesChange = (value) => {
    };

    onFinish = (value) => {
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
                label: 'BY NAME',
                name: 'name',
                placeholder: 'Select name',
                optionArray: TicketsList,
            },
            {
                label: 'BY REQUEST TYPE',
                name: 'requestType',
                placeholder: 'Select request type',
                optionArray: TicketsList,
            },
            {
                label: 'BY PRIORITY',
                name: 'priority',
                placeholder: 'Select priority',
                optionArray: TicketsList,
            },
            {
                label: 'BY LOCATION',
                name: 'loacation',
                placeholder: 'Select location',
                optionArray: locationList,
            },
            {
                label: 'BY ASSIGN',
                name: 'assign',
                placeholder: 'Select assign',
                optionArray: locationList,
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
