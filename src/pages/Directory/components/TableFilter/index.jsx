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

@connect(
  ({
    loading,
    employee,
    employee: { filterList = {}, filter: checkedFilterList = [] } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
  }) => ({
    loading: loading.effects['login/login'],
    employee,
    listLocationsByCompany,
    filterList,
    checkedFilterList,
  }),
)
class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      EmploymentState: 'Employment Type',
      StateState: 'State',
      CountryState: 'Country',
      DepartmentState: 'Department',
      CompanyState: 'Company',
      formatDataState: [], // dynamic state on country
      all: 'All',
      text: '',
      clearText: '',
      reset: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    // const checkIsOwner = isOwner();
    dispatch({
      type: 'employee/fetchFilterList',
      payload: {
        id: company,
        tenantId,
      },
    }).then((res) => {
      if (res?.statusCode === 200) {
        this.getStateByCheckedCountry(res?.data?.listCountry);
      }
    });
    dispatch({
      type: 'employee/fetchEmployeeType',
    });
  }

  componentDidUpdate = (prevProps) => {
    const { checkedFilterList = [], filterList: { listCountry = [] } = {} } = this.props;
    if (JSON.stringify(checkedFilterList) !== JSON.stringify(prevProps.checkedFilterList)) {
      this.getStateByCheckedCountry(listCountry);
    }
  };

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

  getStateByCheckedCountry = (listCountry) => {
    const { checkedFilterList = [] } = this.props;
    const checkedList =
      checkedFilterList.find((filter) => {
        return filter?.actionFilter?.name === 'Country';
      })?.checkedList || [];

    let formatDataState = listCountry.map((item) => {
      const { state = '', country = '' } = item;
      if (checkedList.length === 0 || checkedList.includes(country)) {
        return {
          label: state,
          value: state,
        };
      }
      return null;
    });

    formatDataState = formatDataState.filter((val) => val !== null);
    formatDataState = [...new Set(formatDataState)];
    this.setState({
      formatDataState,
    });
  };

  render() {
    const { Sider } = Layout;
    const {
      DepartmentState,
      all,
      EmploymentState,
      text,
      reset,
      CountryState,
      StateState,
      CompanyState,
      formatDataState,
    } = this.state;
    const {
      employee: { employeetype = [], clearName = false },
      collapsed,
      changeTab,
      tabName,
      filterList: { listCountry = [], listDepartmentName = [], listCompany = [] } = {},
    } = this.props;
    const currentLocation = getCurrentLocation();
    let formatDataCountry = listCountry.map((item) => {
      const { country = '' } = item;
      return {
        label: country,
        value: country,
      };
    });
    formatDataCountry = [...new Set(formatDataCountry)];

    const formatDataEmployeeType = employeetype.map((item) => {
      const { name: label, _id: value } = item;
      return {
        label,
        value,
      };
    });

    const formatDataCompany = listCompany.map((item) => {
      const { name: label, _id: value } = item;
      return {
        label,
        value,
      };
    });

    const formatDataDepartment = listDepartmentName.map((item) => {
      return {
        label: item,
        value: item,
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
                  <>
                    {!currentLocation && (
                      <CheckBoxForms
                        key={CompanyState}
                        name={CompanyState}
                        all={all}
                        data={filteredArr(formatDataCompany)}
                      />
                    )}
                  </>
                )}
                {reset || changeTab ? (
                  ''
                ) : (
                  <CheckBoxForms
                    key={DepartmentState}
                    name={DepartmentState}
                    all={all}
                    data={filteredArr(formatDataDepartment)}
                  />
                )}

                {/* {reset || changeTab
                  ? ''
                  : this.handleCheckShowLocation(formatDataLocation, locationState, all)} */}
                {reset || changeTab ? (
                  ''
                ) : (
                  <CheckBoxForms
                    key={CountryState}
                    name={CountryState}
                    all={all}
                    data={filteredArr(formatDataCountry)}
                  />
                )}

                {reset || changeTab ? (
                  ''
                ) : (
                  <CheckBoxForms
                    key={StateState}
                    name={StateState}
                    all={all}
                    data={filteredArr(formatDataState)}
                  />
                )}
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
