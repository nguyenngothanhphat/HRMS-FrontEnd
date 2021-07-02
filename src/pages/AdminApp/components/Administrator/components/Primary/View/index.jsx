import React, { Component } from 'react';
import { Row, Col, Collapse, Tree } from 'antd';
import { connect } from 'umi';

import icon from '@/assets/primary-administrator.svg';
import { CarryOutOutlined } from '@ant-design/icons';
import arrowIcon from '@/assets/arrowDownCollapseIcon.svg';

import styles from './index.less';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: { company: { name: companyName = '' } = {} } = {} } = {},
    } = {},
  }) => ({
    companyName,
  }),
)
class ViewPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSelect = (selectedKeys, info) => {
    // console.log('selected', selectedKeys, info);
  };

  renderListPermission = () => {
    const { permissionList = [], loading } = this.props;
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
            icon: <CarryOutOutlined />,
          };
        }
        return 0;
      });
      result = result.filter((val) => val !== 0);
      return {
        key: index,
        title: moduleName,
        icon: <CarryOutOutlined />,
        children: result,
      };
    });

    return (
      <Tree
        showIcon={false}
        loadData={loading}
        treeData={treeData}
        onSelect={this.onSelect}
        showLine={{ showLeafIcon: false }}
      />
    );
  };

  render() {
    const {
      primaryAdmin: {
        firstName = '',
        email = '',
        position = `${firstName}’s permission apply to everyone in the company`,
      } = {},
      companyName = '',
    } = this.props;
    const { Panel } = Collapse;
    const expandIcon = ({ isActive }) => (
      <div className={styles.icon}>
        <img
          src={arrowIcon}
          alt="arrow"
          className={isActive ? styles.upsideDownArrow : styles.normalArrow}
        />
      </div>
    );

    return (
      <div className={styles.primaryView}>
        <Row gutter={[0, 16]}>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div className={styles.name}>{firstName}</div>
            </div>
          </Col>
          <Col span={1} />
          <Col span={13}>
            <div className={styles.primaryView__right}>
              <div className={styles.company}>{companyName}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div className={styles.email}>{email}</div>
            </div>
          </Col>
          <Col span={1} />
          <Col span={13}>
            <div className={styles.primaryView__right}>
              <img src={icon} alt="primary-administrator" />
              <div className={styles.position}>{position}</div>
            </div>
          </Col>
          <Col span={8} />
          <Col span={1} />
          <Col span={13}>
            <Collapse
              ghost
              expandIconPosition="right"
              className={styles.permissionCollapse}
              expandIcon={expandIcon}
            >
              <Panel header="Show permissions" className={styles.permissionPanel}>
                {this.renderListPermission()}
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewPrimary;
