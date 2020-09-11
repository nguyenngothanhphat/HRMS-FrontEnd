import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect } from 'umi';
import { filteredArr } from '@/utils/utils';
import styles from './index.less';
import CheckBoxForms from '../CheckboxForm';

@connect(({ loading, employee }) => ({
  loading: loading.effects['login/login'],
  employee,
}))
class TableFilter extends PureComponent {
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
    dispatch({
      type: 'employee/fetchListEmployeeMyTeam',
    });
  }

  toggle = () => {
    const { onToggle } = this.props;
    onToggle();
  };

  handleChange = (e) => {
    const { onHandleChange, dispatch } = this.props;
    dispatch({
      type: 'employee/offClearFilter',
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
      type: 'employee/ClearFilter',
    });
    setTimeout(() => {
      this.setState({ reset: false });
    }, 5);
  };

  render() {
    const { Sider } = Layout;
    const { locationState, departmentState, all, EmploymentState, text, reset } = this.state;
    const {
      employee: { location = [], department = [], employeetype = [], clearFilter = false },
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
        <Sider width="300px" trigger={null} collapsed={collapsed} collapsedWidth="0">
          <div className={styles.topFilter}>
            <div className={styles.textFilters}>Filters</div>
            <div className={styles.resetHide}>
              <p onClick={this.handleReset}>Reset</p>
              {/* <div className={styles.shapeHide} onClick={this.toggle}>
                <span>Hide</span>
              </div> */}
            </div>
          </div>
          <p className={styles.textName}>Name</p>
          {changeTab ? (
            ''
          ) : (
            <Input
              value={clearFilter ? '' : text}
              className={styles.formInput}
              onChange={this.handleChange}
            />
          )}

          {reset || changeTab ? (
            ''
          ) : (
            <CheckBoxForms
              key={EmploymentState}
              name={EmploymentState}
              all={all}
              data={filteredArr(formatDataEmployeeType)}
            />
          )}
          {reset || changeTab ? (
            ''
          ) : (
            <CheckBoxForms
              key={departmentState}
              name={departmentState}
              all={all}
              data={filteredArr(formatDataDepartment)}
            />
          )}
          {reset || changeTab ? (
            ''
          ) : (
            <CheckBoxForms
              key={locationState}
              name={locationState}
              all={all}
              data={formatDataLocation}
            />
          )}
        </Sider>
      </div>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
