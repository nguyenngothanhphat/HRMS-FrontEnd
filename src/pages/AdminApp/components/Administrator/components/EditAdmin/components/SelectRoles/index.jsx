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
    const { firstName = '' } = dataAdmin;
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

  renderList = () => {
    const { permissionList = [] } = this.props;
    const { selectedList = [] } = this.state;
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

    const onCheck = (value) => {
      this.setList(value);
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
          <Button className={styles.proceedBtn} onClick={() => onContinue(1, selectedList)}>
            Continue
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { selectedList = [] } = this.state;
    return (
      <div className={styles.SelectRoles}>
        {this.renderTitle()}
        {this.renderMainForm()}
      </div>
    );
  }
}
export default SelectRoles;
