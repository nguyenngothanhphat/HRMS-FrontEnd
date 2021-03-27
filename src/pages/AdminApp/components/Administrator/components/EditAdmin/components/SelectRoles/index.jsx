import React, { PureComponent } from 'react';
import { Button, Row, Col, Checkbox } from 'antd';

import styles from './index.less';

export default class SelectRoles extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
    };
  }

  renderTitle = () => {
    const { handleEditAdmin = () => {} } = this.props;
    return (
      <div className={styles.titleContainer}>
        <span className={styles.title}>Edit Rena’s role as admin</span>
        <div className={styles.cancelBtn} onClick={() => handleEditAdmin(false)}>
          <span>Cancel</span>
        </div>
      </div>
    );
  };

  setList = (id) => {
    const { selectedList } = this.state;
    const isExist = selectedList.findIndex((value) => value === id) === -1;
    let newList;
    if (isExist) {
      newList = [...selectedList, id];
    } else {
      newList = selectedList.filter((value) => value !== id);
    }
    this.setState({
      selectedList: newList,
    });
  };

  renderList = () => {
    const data = [
      {
        id: 1,
        name: 'Company',
        description: 'Has full permissions and can manage all aspects of your account.',
      },
      {
        id: 2,
        name: 'Payroll',
        description: 'Has full permissions and can manage all aspects of your account.',
      },
      {
        id: 3,
        name: 'Company',
        description: 'Has full permissions and can manage all aspects of your account.',
      },
    ];

    return (
      <div className={styles.roleList}>
        {data.map((role) => {
          const { id = '', name = '', description = '' } = role;
          return (
            <Row gutter={[24, 24]} key={id} align="middle">
              <Col span={2}>
                <Checkbox onChange={() => this.setList(id)} />
              </Col>
              <Col span={6}>
                <span className={styles.roleName}>{name}</span>
              </Col>
              <Col span={16}>
                <span className={styles.roleDescription}>{description}</span>
              </Col>
            </Row>
          );
        })}
      </div>
    );
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
    return (
      <div className={styles.SelectRoles}>
        {this.renderTitle()}
        {this.renderMainForm()}
      </div>
    );
  }
}
