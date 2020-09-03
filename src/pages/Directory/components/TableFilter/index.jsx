/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Layout, Input } from 'antd';
import styles from './index.less';
import CheckBoxForms from '../CheckboxForm';

class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      rendertext1: [
        { name: 'Employment Type', all: 'All', data: ['Full Time', 'Part Time', 'Interns'] },
      ],
      rendertext2: [
        {
          name: 'Department',
          all: 'All',
          data: ['Design', 'Development', 'Marketing', 'Sales', 'HR', 'Administration'],
        },
      ],
      rendertext3: [{ name: 'Location', all: 'All', data: ['Bengaluru', 'San Jose'] }],
    };
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  // handleChange = (e) => {
  //   console.log(e.target.value);
  //   const { rendertext1 } = this.state;
  // };

  render() {
    const { Sider, Content } = Layout;
    const { collapsed, rendertext1, rendertext2, rendertext3 } = this.state;
    return (
      <Layout className={styles.TabFilter}>
        <Sider width="410px" trigger={null} collapsed={collapsed} collapsedWidth="0">
          <div className={styles.topFilter}>
            <div className={styles.textFilters}>Filters</div>
            <div className={styles.resetHide}>
              <p>Reset</p>
              <div className={styles.shapeHide} onClick={this.toggle}>
                <span>Hide</span>
              </div>
            </div>
          </div>
          <p className={styles.textName}>Name</p>
          <Input className={styles.formInput} />
          {rendertext1.map((data) => {
            return <CheckBoxForms name={data.name} all={data.all} data={data.data} />;
          })}
          {rendertext2.map((data) => {
            return <CheckBoxForms name={data.name} all={data.all} data={data.data} />;
          })}
          {rendertext3.map((data) => {
            return <CheckBoxForms name={data.name} all={data.all} data={data.data} />;
          })}
        </Sider>
        {collapsed ? <div className={styles.openSider} onClick={this.toggle} /> : ''}
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          Content
        </Content>
      </Layout>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
