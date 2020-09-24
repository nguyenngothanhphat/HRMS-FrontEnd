import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect, formatMessage } from 'umi';
// import { filteredArr } from '@/utils/utils';
import styles from './index.less';
import CheckList from '../CheckList';

@connect(({ loading, usersManagement }) => ({
  loading: loading.effects['login/login'],
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
      reset: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchRolesList',
    });
    dispatch({
      type: 'usersManagement/fetchLocationList',
    });
    dispatch({
      type: 'usersManagement/fetchCompaniesList',
    });
  }

  toggle = () => {
    const { onToggle } = this.props;
    onToggle();
  };

  handleChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/offClearName',
    });
    const inputvalue = e.target.value;
    this.setState({ text: inputvalue });
  };

  handleReset = () => {
    this.setState({ text: '', reset: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/clearFilter',
    });
    setTimeout(() => {
      this.setState({ reset: false });
    }, 5);
  };

  render() {
    const { Sider } = Layout;
    const { locationState, roleState, all, companyState, text, reset } = this.state;
    const {
      usersManagement: {
        listLocations = [],
        listCompanies = [],
        listRoles = [],
        clearName = false,
      },
      collapsed,
      changeTab,
    } = this.props;

    const formatDataLocations = listLocations.map((item) => {
      const { name: label, id: value } = item;
      return {
        label,
        value,
      };
    });
    const formatDataRoles = listRoles.map((item) => {
      const { name: label, id: value } = item;
      return {
        label,
        value,
      };
    });

    const formatDataCompanies = listCompanies.map((item) => {
      const { name: label, id: value } = item;
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
              <CheckList key={roleState} name={roleState} all={all} data={formatDataRoles} />
            )}
            {reset || changeTab ? (
              ''
            ) : (
              <CheckList
                key={companyState}
                name={companyState}
                all={all}
                data={formatDataCompanies}
              />
            )}
            {reset || changeTab ? (
              ''
            ) : (
              <CheckList
                key={locationState}
                name={locationState}
                all={all}
                data={formatDataLocations}
              />
            )}
          </div>
        </Sider>
      </div>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
