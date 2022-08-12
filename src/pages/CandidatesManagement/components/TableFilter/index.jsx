import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { connect, formatMessage } from 'umi';
import { filteredArr } from '@/utils/utils';
import styles from './index.less';
import CheckList from '../CheckList';

@connect(({ candidatesManagement }) => ({
  candidatesManagement,
}))
class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      processStatusState: 'Progress Status',
      all: 'All',
      reset: false,
    };
  }

  handleReset = () => {
    this.setState({ reset: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'candidatesManagement/ClearFilter',
    });
    setTimeout(() => {
      this.setState({ reset: false });
    }, 5);
  };

  render() {
    const { Sider } = Layout;
    const { processStatusState, all, reset } = this.state;
    const {
      candidatesManagement: { statusList = [] },
      collapsed,
      changeTab,
    } = this.props;

    const formatProcessStatus = statusList.map((item) => {
      return {
        label: item,
        value: item,
      };
    });

    return (
      <div className={styles.CandidatesFilter}>
        <Sider width="320px" trigger={null} collapsed={collapsed} collapsedWidth="0">
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
                key={processStatusState}
                name={processStatusState}
                all={all}
                data={filteredArr(formatProcessStatus)}
              />
            )}
          </div>
        </Sider>
      </div>
    );
  }
}

export default TableFilter;
