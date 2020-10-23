import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect, formatMessage } from 'umi';
import { filteredArr } from '@/utils/utils';
import styles from './index.less';
import CheckList from '../CheckList';

@connect(({ employeesManagement, employee }) => ({
  employeesManagement,
  employee,
}))
class TabFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      EmploymentState: 'Employment Type',
      locationState: 'Location',
      departmentState: 'Department',
      all: 'All',
      text: '',
      clearText: '',
      reset: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchEmployeeType',
    });
    dispatch({
      type: 'employee/fetchLocation',
    });
    dispatch({
      type: 'employee/fetchDepartment',
    });
  }

  toggle = () => {
    const { onToggle } = this.props;
    onToggle();
  };

  handleChange = (e) => {
    const { onHandleChange, dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/offClearName',
    });
    const inputvalue = e.target.value;
    this.setState({ text: inputvalue });
    onHandleChange(inputvalue);
  };

  handleReset = () => {
    this.setState({ text: '', reset: true });
    const { onHandleChange, dispatch } = this.props;
    const { clearText } = this.state;
    onHandleChange(clearText);
    dispatch({
      type: 'employeesManagement/ClearFilter',
    });
    setTimeout(() => {
      this.setState({ reset: false });
    }, 5);
  };

  render() {
    const { Sider } = Layout;
    const { locationState, departmentState, all, EmploymentState, text, reset } = this.state;
    const {
      employee: { location = [], department = [], employeetype = [] },
      employeesManagement: { clearName = false },
      collapsed,
      changeTab,
    } = this.props;
    const formatDataLocation = location.map((item) => {
      const { name: label, id: value } = item;
      return {
        label,
        value,
      };
    });
    const formatDataEmployeeType = employeetype.map((item) => {
      const { name: label, _id: value } = item;
      return {
        label,
        value,
      };
    });

    const formatDataDepartment = department.map((item) => {
      const { name: label, _id: value } = item;
      return {
        label,
        value,
      };
    });

    return (
      <div className={styles.TabFilter}>
        <Sider width="244px" trigger={null} collapsed={collapsed} collapsedWidth="0">
          <div className={styles.PaddingFilter}>
            <div className={styles.topFilter}>
              <div className={styles.textFilters}>
                {formatMessage({ id: 'pages.directory.tableFilter.filter' })}
              </div>
              <div className={styles.resetHide}>
                <p onClick={this.handleReset}>
                  {formatMessage({ id: 'pages.directory.tableFilter.reset' })}
                </p>
              </div>
            </div>
            <p className={styles.textName}>
              {formatMessage({ id: 'pages.directory.tableFilter.name' })}
            </p>
            {changeTab ? (
              ''
            ) : (
              <Input
                value={clearName ? '' : text}
                className={styles.formInput}
                onChange={this.handleChange}
              />
            )}

            {reset || changeTab ? (
              ''
            ) : (
              <CheckList
                key={EmploymentState}
                name={EmploymentState}
                all={all}
                data={filteredArr(formatDataEmployeeType)}
              />
            )}
            {reset || changeTab ? (
              ''
            ) : (
              <CheckList
                key={departmentState}
                name={departmentState}
                all={all}
                data={filteredArr(formatDataDepartment)}
              />
            )}
            {reset || changeTab ? (
              ''
            ) : (
              <CheckList
                key={locationState}
                name={locationState}
                all={all}
                data={formatDataLocation}
              />
            )}
          </div>
        </Sider>
      </div>
    );
  }
}

export default TabFilter;
