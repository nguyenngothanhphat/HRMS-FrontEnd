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

  renderList = () => {
    const { permissionList = [] } = this.props;
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

      return {
        key: index,
        title: moduleName,
        children: result,
      };
    });

    const onCheck = (checkedKeys) => {
      this.setList(checkedKeys);
    };

    return (
      <div className={styles.roleList}>
        <Tree
          checkable
          defaultExpandAll={false}
          // onSelect={onSelect}
          onCheck={onCheck}
          treeData={treeData}
          showLine={{ showLeafIcon: false }}
          showIcon={false}
        />
      </div>
    );
  };

  renderMainForm = () => {
    const { onContinue = () => {}, loadingAddAdmin = false } = this.props;
    const { selectedList } = this.state;
    return (
      <div className={styles.mainForm}>
        <div className={styles.header}>
          <span>Admin Roles</span>
        </div>
        <div className={styles.content}>{this.renderList()}</div>
        <div className={styles.nextBtn}>
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
