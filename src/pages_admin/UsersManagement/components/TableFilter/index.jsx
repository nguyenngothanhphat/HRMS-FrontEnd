import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect, formatMessage } from 'umi';
import { filteredArr } from '@/utils/utils';
import styles from './index.less';
import CheckList from '../CheckList';

@connect(({ usersManagement }) => ({
  usersManagement,
}))
class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      roleState: 'Role',
      locationState: 'Location',
      companyState: 'Company',
      all: 'All',
      text: '',
      clearText: '',
      reset: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchLocationList',
    });
    dispatch({
      type: 'usersManagement/fetchRoleList',
    });
    dispatch({
      type: 'usersManagement/fetchCompanyList',
    });
  }

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

  render() {
    const { Sider } = Layout;
    const { locationState, companyState, all, roleState, text, reset } = this.state;
    const {
      usersManagement: { location = [], company = [], roles = [], clearName = false },
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
    const formatDataRole = roles.map((item) => {
      const { _id: label } = item;
      return {
        label,
        value: label,
      };
    });

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

export default TableFilter;
