import { Form, Select } from 'antd';
import React, { PureComponent } from 'react';
import style from './index.less';

const { Option } = Select;
class MenuFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.refForm = React.createRef();
  }

  componentDidMount = () => {
    const { setForm = () => {} } = this.props;
    setForm(this.refForm.current);
  };

  handleChange = () => {
    console.log('acacadfadf');
  };

  render() {
    const { listStatus = [] } = this.props;
    let { companyList = [] } = this.props;
    const yesNo = [
      <Select.Option key="yes">Yes</Select.Option>,
      <Select.Option key="no">No</Select.Option>,
    ];
    const { onSubmit = () => {}, onSearch = () => {} } = this.props;
    companyList = companyList.map((company) => company.legalName);
    companyList = [...new Set(companyList)];
    return (
      <div className={style.menuFilter}>
        <Form
          ref={this.refForm}
          layout="vertical"
          name="filter"
          onValuesChange={(value) => {
            onSearch(value);
          }}
          // onFinish={(values) => {
          //   onSubmit(values);
          // }}
        >
          <Form.Item label="By Status" name="byStatus">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {listStatus}
            </Select>
          </Form.Item>
          <Form.Item label="By Company" name="byCompany">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {companyList.map((company, index) => (
                <Option key={index} value={company}>
                  {company}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="By Open Leads" name="byOpenLeads">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {yesNo}
            </Select>
          </Form.Item>
          <Form.Item label="By Pending Tickets" name="byPendingTickets">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {yesNo}
            </Select>
          </Form.Item>
          <Form.Item label="By Pending Tasks" name="byPendingTasks">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {yesNo}
            </Select>
          </Form.Item>
          <Form.Item label="By Active Projects" name="byActiveProjects">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handleChange}
            >
              {yesNo}
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default MenuFilter;
