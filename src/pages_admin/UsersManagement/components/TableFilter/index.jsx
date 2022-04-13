import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect, formatMessage } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { filteredArr } from '@/utils/utils';
import styles from './index.less';
import CheckList from '../CheckList';

@connect(
  ({
    usersManagement,
    locationSelection: { companyLocationList = [] } = {},
    usersManagement: { filterList = {}, filter: checkedFilterList = {} } = {},
  }) => ({
    usersManagement,
    companyLocationList,
    filterList,
    checkedFilterList,
  }),
)
class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      roleState: 'Role',
      companyState: 'Company',
      // employmentState: 'Employment Type',
      stateState: 'State',
      countryState: 'Country',
      formatDataState: [], // dynamic state on country
      all: 'All',
      text: '',
      clearText: '',
      reset: false,
    };
  }

  componentDidMount() {
    // const checkIsOwner = isOwner();
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    dispatch({
      type: 'usersManagement/fetchFilterList',
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

  handleChange = (e) => {
    const { onHandleChange, dispatch } = this.props;
    dispatch({
      type: 'usersManagement/offClearName',
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
      type: 'usersManagement/ClearFilter',
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

  render() {
    const { Sider } = Layout;
    const { companyState, all, roleState, stateState, countryState, text, reset, formatDataState } =
      this.state;
    const {
      usersManagement: {
        // location = [],
        roles = [],
        clearName = false,
      },
      collapsed,
      changeTab,
      filterList: { listCountry = [], listCompany: company = [] } = {},
    } = this.props;

    // const currentCompany = getCurrentCompany();
    // const formatDataLocation = location.map((item) => {
    //   const {
    //     name: label = '',
    //     _id: value = '',
    //     company: { _id: parentCompId = '', name: parentCompName = '' } = {},
    //   } = item;
    //   return {
    //     label:
    //       parentCompId && currentCompany !== parentCompId ? `${parentCompName} - ${label}` : label,
    //     // label,
    //     value,
    //   };
    // });
    const formatDataRole = roles.map((item) => {
      const { idSync: label } = item;
      return {
        label,
        value: label,
      };
    });

    let formatDataCountry = listCountry.map((item) => {
      const { country: { _id: countryId = '', name: countryName = '' } = '' } = item;
      return {
        label: countryName,
        value: countryId,
      };
    });
    formatDataCountry = [...new Set(formatDataCountry)];

    const formatDataCompany = company.map((item) => {
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
                key={roleState}
                name={roleState}
                all={all}
                data={filteredArr(formatDataRole)}
              />
            )}
            {reset || changeTab ? (
              ''
            ) : (
              <CheckList
                key={companyState}
                name={companyState}
                all={all}
                data={filteredArr(formatDataCompany)}
              />
            )}
            {reset || changeTab ? (
              ''
            ) : (
              <>
                <CheckList
                  key={countryState}
                  name={countryState}
                  all={all}
                  data={filteredArr(formatDataCountry)}
                />
              </>
            )}
            {reset || changeTab ? (
              ''
            ) : (
              <>
                <CheckList
                  key={stateState}
                  name={stateState}
                  all={all}
                  data={filteredArr(formatDataState)}
                />
              </>
            )}
          </div>
        </Sider>
      </div>
    );
  }
}

export default TableFilter;
