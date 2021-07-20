import React, { PureComponent } from 'react';
import { Layout, Input, Select } from 'antd';
import { connect, formatMessage } from 'umi';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { filteredArr } from '@/utils/utils';

import styles from './index.less';
import CheckBoxForms from '../CheckboxForm';

@connect(
  ({
    loading,
    employee,
    employee: { filterList = {}, filter: checkedFilterList = [] } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
    employeeProfile: { listSkill = [] } = {},
  }) => ({
    loading: loading.effects['login/login'],
    employee,
    listLocationsByCompany,
    filterList,
    checkedFilterList,
    listSkill,
  }),
)
class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      EmploymentState: 'Employment Type',
      StateState: 'State',
      CountryState: 'Country',
      // DepartmentState: 'Department',
      CompanyState: 'Company',
      // SkillState: 'Skill',
      // TitleState: 'Title',
      formatDataState: [], // dynamic state on country
      formatDataTitle: [], // dynamic title on department
      all: 'All',
      text: '',
      clearText: '',
      reset: false,
      titleSelected: [],
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
        // for title selectbox
        this.getTitleByCheckedDepartment(res?.data?.listTitle);
      }
    });
    dispatch({
      type: 'employee/fetchEmployeeType',
    });
  }

  componentDidUpdate = (prevProps) => {
    const { checkedFilterList = [], filterList: { listCountry = [], listTitle = [] } = {} } =
      this.props;
    if (JSON.stringify(checkedFilterList) !== JSON.stringify(prevProps.checkedFilterList)) {
      this.getStateByCheckedCountry(listCountry);
      this.getTitleByCheckedDepartment(listTitle);

      // for title selectbox
      let newFilterList = [];
      checkedFilterList.forEach((f) => {
        if (f.actionFilter?.name === 'Title') {
          newFilterList = [...f.checkedList];
        }
      });
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        titleSelected: newFilterList.length > 0 ? newFilterList : [],
      });
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

  // for title + department + skill selectbox
  handleSelectChange = (value, name) => {
    const { dispatch } = this.props;

    if (name === 'Title') {
      dispatch({
        type: 'employee/saveFilter',
        payload: { name, checkedList: value ? [value] : [] },
      });
      this.setState({
        titleSelected: [value],
      });
    } else {
      dispatch({
        type: 'employee/saveFilter',
        payload: { name, checkedList: value || [] },
      });
    }
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
      const { state = '', country: { _id: countryId = '' } = {} } = item;
      if (checkedList.length === 0 || checkedList.includes(countryId)) {
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

  getTitleByCheckedDepartment = (listTitle = []) => {
    const { checkedFilterList = [] } = this.props;
    const checkedList =
      checkedFilterList.find((filter) => {
        return filter?.actionFilter?.name === 'Department';
      })?.checkedList || [];

    let formatDataTitle = listTitle.map((item) => {
      const { name = '', _id = '', department = {} } = item;
      if (checkedList.length === 0 || checkedList.includes(department?.name)) {
        return {
          label: name,
          value: _id,
        };
      }
      return null;
    });

    formatDataTitle = formatDataTitle.filter((val) => val !== null);
    formatDataTitle = [...new Set(formatDataTitle)];
    this.setState({
      formatDataTitle,
    });
  };

  render() {
    const { Sider } = Layout;
    const {
      // DepartmentState,
      all,
      EmploymentState,
      text,
      reset,
      CountryState,
      StateState,
      CompanyState,
      formatDataState,
      formatDataTitle,
      // TitleState,
      titleSelected,
    } = this.state;
    const {
      employee: { employeetype = [], clearName = false, clearFilter },
      collapsed,
      changeTab,
      tabName,
      listSkill,
      filterList: { listCountry = [], listDepartmentName = [], listCompany = [] } = {},
    } = this.props;

    const currentLocation = getCurrentLocation();

    let formatDataCountry = listCountry.map((item) => {
      const { country: { _id: countryId = '', name: countryName = '' } = '' } = item;
      return {
        label: countryName,
        value: countryId,
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

    const listDepartmentNameNew = listDepartmentName.filter((department) => department !== null);
    const formatDataDepartment = listDepartmentNameNew.map((item) => {
      return {
        label: item,
        value: item,
      };
    });
    const formatDataSkill = listSkill.map((item) => {
      return {
        label: item.name,
        value: item._id,
      };
    });

    // const formatDataTitleByDepartment = listTitle.filter((item) => {
    //   const { name: label, _id: value } = item;
    //   return {
    //     label,
    //     value,
    //   };
    // });

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
            {/* for title selectbox */}
            <p className={styles.textName}>Title</p>
            {reset || changeTab ? (
              ''
            ) : (
              <Select
                value={clearFilter && titleSelected.length === 0 ? '' : titleSelected[0]}
                className={styles.formSelectTitle}
                onChange={(value) => this.handleSelectChange(value, 'Title')}
                filterOption={
                  (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // eslint-disable-next-line react/jsx-curly-newline
                }
                showSearch
                allowClear
              >
                {formatDataTitle.map((tl) => (
                  <Select.Option value={tl.value}>{tl.label}</Select.Option>
                ))}
              </Select>
            )}
            {/* for department selectbox */}
            <p className={styles.textName}>Department</p>
            {reset || changeTab ? (
              ''
            ) : (
              <Select
                className={styles.formSelect}
                onChange={(value) => this.handleSelectChange(value, 'Department')}
                mode="multiple"
                filterOption={
                  (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // eslint-disable-next-line react/jsx-curly-newline
                }
                showSearch
                showArrow
                allowClear
              >
                {formatDataDepartment.map((skill) => (
                  <Select.Option value={skill.value}>{skill.label}</Select.Option>
                ))}
              </Select>
            )}

            {/* for skills selectbox */}
            <p className={styles.textName}>Skills</p>
            {reset || changeTab ? (
              ''
            ) : (
              <Select
                className={styles.formSelect}
                onChange={(value) => this.handleSelectChange(value, 'Skill')}
                mode="multiple"
                filterOption={
                  (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // eslint-disable-next-line react/jsx-curly-newline
                }
                showSearch
                showArrow
                allowClear
              >
                {formatDataSkill.map((skill) => (
                  <Select.Option value={skill.value}>{skill.label}</Select.Option>
                ))}
              </Select>
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
                {/* {reset || changeTab ? (
                  ''
                ) : (
                  <CheckBoxForms
                    key={DepartmentState}
                    name={DepartmentState}
                    all={all}
                    data={filteredArr(formatDataDepartment)}
                  />
                )} */}
                {/* {reset || changeTab ? (
                  ''
                ) : (
                  <CheckBoxForms
                    key={SkillState}
                    name={SkillState}
                    all={all}
                    data={filteredArr(formatDataSkill)}
                  />
                )} */}

                {/* {reset || changeTab ? (
                  ''
                ) : (
                  <CheckBoxForms
                    key={TitleState}
                    name={TitleState}
                    all={all}
                    data={filteredArr(formatDataTitle)}
                  />
                )} */}
                {/* {reset || changeTab
                  ? ''
                  : this.handleCheckShowLocation(formatDataLocation, locationState, all)} */}
                {reset || changeTab ? (
                  ''
                ) : (
                  <>
                    {!currentLocation && (
                      <CheckBoxForms
                        key={CountryState}
                        name={CountryState}
                        all={all}
                        data={filteredArr(formatDataCountry)}
                      />
                    )}
                  </>
                )}
                {reset || changeTab ? (
                  ''
                ) : (
                  <>
                    {!currentLocation && (
                      <CheckBoxForms
                        key={StateState}
                        name={StateState}
                        all={all}
                        data={filteredArr(formatDataState)}
                      />
                    )}
                  </>
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
