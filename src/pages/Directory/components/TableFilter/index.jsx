import React, { PureComponent } from 'react';
import { Layout, Input } from 'antd';
import { connect } from 'umi';
import DirectotyTable from '@/components/DirectotyTable';
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
    const employeesState = [
      {
        generalInfo: {
          fullName: 'Adija Venka ',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 1',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 2',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 3',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 4',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 5',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 6',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 7',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 8',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 9',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 10',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 11',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 12',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 13',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 14',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 15',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 16',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 17',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 18',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 19',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 20',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 21',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 22',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 23',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 24',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 25',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 25',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka ',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
    ];
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
        </Sider>
        {collapsed ? <div className={styles.openSider} onClick={this.toggle} /> : ''}
        <Content
          className="site-layout-background"
          style={{
            minHeight: 280,
          }}
        >
          <DirectotyTable list={employeesState} />
        </Content>
      </Layout>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
