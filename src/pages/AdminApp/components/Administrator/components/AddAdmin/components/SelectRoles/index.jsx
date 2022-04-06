/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Button, Tree } from 'antd';
// import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import styles from './index.less';

class SelectRoles extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
    };
  }

  componentDidMount() {
    const { onBackValues = [] } = this.props;
    this.setState({
      selectedList: onBackValues.length > 0 ? onBackValues : [],
    });
  }

  renderTitle = () => {
    const { handleAddAdmin = () => {}, name = '' } = this.props;
    return (
      <div className={styles.titleContainer}>
        <span className={styles.title}>Choose {name}’s role as admin</span>
        <div className={styles.cancelBtn} onClick={() => handleAddAdmin(false)}>
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

  filterID = (value, permissionList = []) => {
    const handlePermission = permissionList.map((obj) => {
      const splitId = obj._id.split('_')
      return splitId.length > 2 ? `${splitId[0]}_${splitId[1]}_${splitId[2]}` : `${splitId[0]}_${splitId[1]}`
    })
    // const idArray = [
    //   'M_USER_MANAGEMENT',
    //   'M_DIRECTORY',
    //   'M_ONBOARDING',
    //   'M_TIMEOFF',
    //   'M_OFFBOARDING',
    //   'M_PROJECT_MANAGEMENT',
    //   'M_DOCUMENT_MANAGEMENT',
    // ];

    let data = handlePermission.map((item, index) => {
      if (value.includes(item)) {
        return permissionList[index]._id;
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

      // remove a result that its Title contains keyword 'root view'
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

    const onCheck = (checkedKeys) => {
      const formatPermission = checkedKeys.filter((item) => isNaN(item));
      // Filter value IDs that include a part of rootID string in function filterID()
      let arrayValueID = [];
      formatPermission.forEach((item) => {
        if (this.filterID(item, permissionList)) {
          arrayValueID.push(...this.filterID(item, permissionList));
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

      // const formatPermission = formatPermission.filter((item) => isNaN(item));
      const listPermission = [...formatPermission, ...filterRootID];
      this.setList(listPermission);
    };

    return (
      <div className={styles.roleList}>
        <Tree
          checkable
          defaultExpandAll
          // onSelect={onSelect}
          checkedKeys={selectedList}
          onCheck={onCheck}
          treeData={treeData}
          showLine={{ showLeafIcon: false }}
          showIcon={false}
        />
      </div>
    );
  };

  renderMainForm = () => {
    const { onContinue = () => {}, onBack = () => {}, loadingAddAdmin = false } = this.props;
    const { selectedList } = this.state;
    return (
      <div className={styles.mainForm}>
        <div className={styles.header}>
          <span>Admin Roles</span>
        </div>
        <div className={styles.content}>{this.renderList()}</div>
        <div className={styles.nextBtn}>
          <div className={styles.goBackBtn} onClick={() => onBack(selectedList)}>
            <span>Back</span>
          </div>
          <Button
            loading={loadingAddAdmin}
            className={styles.proceedBtn}
            onClick={() => onContinue(2, selectedList)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.SelectRoles}>
        {this.renderTitle()}
        {this.renderMainForm()}
      </div>
    );
  }
}
export default SelectRoles;
