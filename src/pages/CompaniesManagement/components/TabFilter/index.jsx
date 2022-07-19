import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { connect, formatMessage } from 'umi';
// import { filteredArr } from '@/utils/utils';
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
      locationState: 'Location',
      all: 'All',
      reset: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchLocation',
    });
  }

  toggle = () => {
    const { onToggle } = this.props;
    onToggle();
  };

  handleReset = () => {
    this.setState({ reset: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/ClearFilter',
    });
    setTimeout(() => {
      this.setState({ reset: false });
    }, 5);
  };

  render() {
    const { Sider } = Layout;
    const { locationState, all, reset } = this.state;
    const {
      employee: { location = [] },
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

    const dataLicensePackage = [
      {
        label: 'v4.0',
        value: 'v4.0',
      },
      {
        label: 'v4.1',
        value: 'v4.1',
      },
      {
        label: 'v4.2',
        value: 'v4.2',
      },
      {
        label: 'v4.3',
        value: 'v4.3',
      },
      {
        label: 'v4.8',
        value: 'v4.8',
      },
    ];

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

            {reset || changeTab ? (
              ''
            ) : (
              <CheckList
                key="licensePackage"
                name="License Package"
                all={all}
                data={dataLicensePackage}
              />
            )}
          </div>
        </Sider>
      </div>
    );
  }
}

export default TabFilter;
