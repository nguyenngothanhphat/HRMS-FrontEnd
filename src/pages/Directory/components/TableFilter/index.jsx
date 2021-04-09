import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect, formatMessage } from 'umi';
import {
  getCurrentCompany,
  getCurrentLocation,
  getCurrentTenant,
  isOwner,
} from '@/utils/authority';
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
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    const checkIsOwner = isOwner();

    if (company) {
      dispatch({
        type: checkIsOwner ? 'employee/fetchOwnerLocation' : 'employee/fetchLocation',
        // type: 'employee/fetchLocation',
        payload: { company, tenantId },
      });
    }

    dispatch({
      type: 'employee/fetchDepartment',
      payload: { company, tenantId },
    });
    // dispatch({
    //   type: 'employee/fetchListEmployeeMyTeam',
    // });
  }

  toggle = () => {
    const { onToggle } = this.props;
    onToggle();
  };

  handleChange = (e) => {
    const { onHandleChange, dispatch } = this.props;
    dispatch({
      type: 'employee/offClearName',
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

  handleCheckShowLocation = (formatDataLocation, locationState, all) => {
    const { tabName, checkLocation } = this.props;
    const checkIsOwner = isOwner();
    const currentLocation = getCurrentLocation();

    if (
      checkIsOwner &&
      (!currentLocation || currentLocation === 'undefined') &&
      (tabName === 'active' || tabName === 'inActive')
    ) {
      return (
        <CheckBoxForms
          key={locationState}
          name={locationState}
          all={all}
          data={filteredArr(formatDataLocation)}
        />
      );
    }
    return '';
  };

  render() {
    const { Sider } = Layout;
    const { departmentState, all, EmploymentState, text, reset, locationState } = this.state;
    const {
      employee: { department = [], employeetype = [], location = [], clearName = false },
      collapsed,
      changeTab,
      tabName,
    } = this.props;

    const currentCompany = getCurrentCompany();

    const formatDataLocation = location.map((item) => {
      const {
        name: label = '',
        _id: value = '',
        company: { _id: parentCompId = '', name: parentCompName = '' } = {},
      } = item;
      return {
        label:
          parentCompId && currentCompany !== parentCompId ? `${parentCompName} - ${label}` : label,
        // label,
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
                {/* <div className={styles.shapeHide} onClick={this.toggle}>
                <span>Hide</span>
              </div> */}
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

            {tabName !== 'myTeam' && (
              <>
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
                {/* {reset || changeTab
                  ? ''
                  : this.handleCheckShowLocation(formatDataLocation, locationState, all)} */}
                {this.handleCheckShowLocation(formatDataLocation, locationState, all)}
              </>
            )}
          </div>
        </Sider>
      </div>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
