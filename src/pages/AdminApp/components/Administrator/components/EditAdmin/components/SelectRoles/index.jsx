/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Button, Tree } from 'antd';
import styles from './index.less';

class SelectRoles extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
    };
  }

  componentDidMount() {
    const { dataAdmin: { permissionAdmin = [] } = {} } = this.props;
    this.setState({
      selectedList: permissionAdmin,
    });
  }

  renderTitle = () => {
    const { handleEditAdmin = () => {}, dataAdmin = {} } = this.props;
    const { usermap: { firstName = '' } = {} } = dataAdmin;
    return (
      <div className={styles.titleContainer}>
        <span className={styles.title}>{`Choose ${firstName}’s role as admin`}</span>
        <div className={styles.cancelBtn} onClick={() => handleEditAdmin(false)}>
          <span>Cancel</span>
        </div>
      </div>
    );
  };

  setList = (list) => {
    this.setState({
      selectedList: list,
    });
  };

  filterID = (value) => {
    const idArray = [
      'M_USER_MANAGEMENT',
      'M_DIRECTORY',
      'M_ONBOARDING',
      'M_TIMEOFF',
      'M_OFFBOARDING',
      'M_PROJECT_MANAGEMENT',
      'M_DOCUMENT_MANAGEMENT',
    ];

    let data = idArray.map((item) => {
      if (value.includes(item)) {
        return item;
      }
      return 0;
    });

    data = data.filter((item) => item !== 0);
    return data;
  };

  renderList = () => {
    const { permissionList = [] } = this.props;
    const { selectedList = [] } = this.state;
    const root = [];
    let formatList = permissionList.map((per) => per?.module);
    formatList = formatList.filter(
      (value) => value !== undefined && value !== '' && value !== null,
    );
    formatList = [...new Set(formatList)];

    const treeData = formatList.map((moduleName, index) => {
      let result = permissionList.map((per) => {
        const { _id = '', name = '', module = '' } = per;
        if (moduleName === module) {
          return {
            title: name,
            key: _id,
          };
        }
        return 0;
      });
      result = result.filter((val) => val !== 0);

      let filterResult = result.map((res) => {
        const { title = '' } = res;
        if (!title.includes('root view')) {
          return res;
        }
        root.push(res);
        return 0;
      });

      filterResult = filterResult.filter((val) => val !== 0);
      return {
        key: index,
        title: moduleName,
        children: filterResult,
      };
    });

    const onCheck = (valueCheckBox) => {
      // Filter value IDs that include a part of rootID string in function filterID()
      let arrayValueID = [];
      valueCheckBox.forEach((item) => {
        if (this.filterID(item)) {
          arrayValueID.push(...this.filterID(item));
        }
      });
      arrayValueID = [...new Set(arrayValueID)];

      // then, return root id from root list
      const filterRootID = [];
      arrayValueID.map((id) => {
        root.forEach((r) => {
          if (r.key.includes(id)) {
            filterRootID.push(r.key);
          }
        });
        return 0;
      });

      const formatPermission = valueCheckBox.filter((item) => isNaN(item));
      const listPermission = [...formatPermission, ...filterRootID];
      this.setList(listPermission);
    };

    return (
      <div className={styles.roleList}>
        <Tree
          checkable
          defaultExpandAll
          onCheck={onCheck}
          checkedKeys={selectedList}
          treeData={treeData}
          showLine={{ showLeafIcon: false }}
          showIcon={false}
        />
      </div>
    );
  };

  defaultCheckBox = () => {
    const { dataAdmin: { permissionAdmin = [] } = {} } = this.props;
    return permissionAdmin;
  };

  renderMainForm = () => {
    const { onContinue = () => {} } = this.props;
    const { selectedList } = this.state;
    return (
      <div className={styles.mainForm}>
        <div className={styles.header}>
          <span>Admin Roles</span>
        </div>
        <div className={styles.content}>{this.renderList()}</div>
        <div className={styles.nextBtn}>
          <Button className={styles.proceedBtn} onClick={() => onContinue(2, selectedList)}>
            Continue
          </Button>
        </div>
      </div>
    );
  };

  render() {
    // const { selectedList = [] } = this.state;
    return (
      <div className={styles.SelectRoles}>
        {this.renderTitle()}
        {this.renderMainForm()}
      </div>
    );
  }
}
export default SelectRoles;
