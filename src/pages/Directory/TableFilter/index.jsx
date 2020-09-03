/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Layout, Input } from 'antd';
import styles from './index.less';
import CheckBoxForms from '../CheckboxForm';
import DirectotyTable from '../../../components/DirectotyTable';

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

  render() {
    const { Sider, Content } = Layout;
    const { collapsed, rendertext1, rendertext2, rendertext3 } = this.state;
    const employees =  [
      {
        "generalInfo": {
          "fullName": "Adija Venka "
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 1"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 2"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 3"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 4"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 5"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 6"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 7"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 8"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 9"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 10"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 11"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 12"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 13"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 14"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 15"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 16"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 17"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 18"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 19"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 20"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 21"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 22"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 23"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 24"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 25"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka 25"
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      },
      {
        "generalInfo": {
          "fullName": "Adija Venka "
        },
        "compensation": {
          "title": "UX designer"
        },
        "department": {
          "name": "Design"
        },
        "location": {
          "name": "Begalura"
        },
        "manager": {
          "name": "Anil Reddy"
        }
      }
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
            minHeight: 280,
          }}
        >
          <DirectotyTable list={employees} />
        </Content>
      </Layout>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
