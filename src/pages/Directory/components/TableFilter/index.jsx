import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect } from 'umi';
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
      data: [
        { label: 'Full Time', value: 'Full Time' },
        { label: 'Part Time', value: 'Part Time' },
        { label: 'Interns', value: 'Interns' },
      ],
      locationState: 'Location',
      departmentState: 'Department',
      all: 'All',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
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
    const inputvalue = e.target.value;
    const { onHandleChange } = this.props;
    onHandleChange(inputvalue);
  };

  handleCheckbox = () => {
    // console.log(value);
    // const {handleBoxForm} =this.props;
    // handleBoxForm(value);
  };

  render() {
    const { Sider } = Layout;
    const { locationState, departmentState, all, data, EmploymentState } = this.state;
    const {
      employee: { location = [], department = [] },
      collapsed,
      // onCheckBox,
      FormBox,
    } = this.props;
    const formatDataLocation = location.map((item) => {
      const { name: label, id: value } = item;
      return {
        label,
        value,
      };
    });
    const formatDataDepartment = department.map((item) => {
      const { name: label, name: value } = item;
      return {
        label,
        value,
      };
    });
    const filteredArr = formatDataDepartment.reduce((precur, current) => {
      const x = precur.find((item) => item.label === current.label);
      if (!x) {
        return precur.concat([current]);
      }
      return precur;
    }, []);
    return (
      <div className={styles.TabFilter}>
        <Sider width="410px" trigger={null} collapsed={collapsed} collapsedWidth="0">
          <div className={styles.topFilter}>
            <div className={styles.textFilters}>Filters</div>
            <div className={styles.resetHide}>
              <p>Reset</p>
              <div className={styles.shapeHide} onClick={this.toggle}>
                <span>Hide</span>
              </div>
            </div>
          </div>
          <p className={styles.textName}>Name</p>
          <Input className={styles.formInput} onChange={this.handleChange} />

          <CheckBoxForms
            key={EmploymentState}
            name={EmploymentState}
            all={all}
            data={data}
            onBox={FormBox}
          />
          <CheckBoxForms
            key={departmentState}
            name={departmentState}
            all={all}
            data={filteredArr}
            onBox={FormBox}
          />
          <CheckBoxForms
            key={locationState}
            name={locationState}
            all={all}
            data={formatDataLocation}
            onBox={FormBox}
          />
        </Sider>
      </div>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
