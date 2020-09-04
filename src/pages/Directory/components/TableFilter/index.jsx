import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import CheckBoxForms from '../CheckboxForm';

@connect(({ loading, employee }) => ({
  loading: loading.effects['login/login'],
  employee,
}))
class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      rendertext1: [
        {
          name: 'Employment Type',
          all: 'All',
          data: [
            { label: 'Full Time', value: 'Full Time' },
            { label: 'Part Time', value: 'Part Time' },
            { label: 'Interns', value: 'Interns' },
          ],
        },
      ],
      locationState: 'Location',
      departmentState: 'Department',
      all: 'All',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchLocation',
    });
    dispatch({
      type: 'employee/fetchDepartment',
    });
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  handlefilter = (value, inputvalue) => {
    const valuedata = value.filter((x) => x.toLowerCase().includes(inputvalue.toLowerCase()));
    this.setState({ filterdata: valuedata });
  };

  handleChange = (e) => {
    const inputvalue = e.target.value;
    const { rendertext1 } = this.state;
    rendertext1.filter((value) => this.handlefilter(value.data, inputvalue));
  };

  render() {
    const { Sider, Content } = Layout;
    const { collapsed, rendertext1, filterdata, locationState, departmentState, all } = this.state;
    const {
      employee: { location = [], department = [] },
    } = this.props;
    const formatDataLocation = location.map((item) => {
      const { name: label, id: value } = item;
      return {
        label,
        value,
      };
    });
    const formatDataDepartment = department.map((item) => {
      const { name: label, name: value } = item;
      return {
        label,
        value,
      };
    });
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
          <Input className={styles.formInput} onChange={this.handleChange} />
          {rendertext1.map((data) => {
            return (
              <CheckBoxForms
                key={data.name}
                name={data.name}
                all={data.all}
                data={filterdata || data.data}
              />
            );
          })}
          <CheckBoxForms
            key={departmentState}
            name={departmentState}
            all={all}
            data={formatDataDepartment}
          />
          <CheckBoxForms
            key={locationState}
            name={locationState}
            all={all}
            data={formatDataLocation}
          />
          {/* {rendertext3.map((data) => {
            return (
            );
          })} */}
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
