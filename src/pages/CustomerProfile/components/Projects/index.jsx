import { SearchOutlined } from '@ant-design/icons';
import { Popover, Input, Button, Table } from 'antd';
import React, { PureComponent } from 'react';
import ProjectFilter from './components/ProjectFilter';
import styles from './index.less';
import cancelIcon from '../../../../assets/cancelIcon.svg';
import { FilterIcon } from './components/FilterIcon';

class Projects extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUnhide: false,
    };
  }

  handleVisible = () => {
    const { isUnhide } = this.state;
    this.setState({
      isUnhide: !isUnhide,
    });
  };

  showModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  closeModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Project ID',
        dataIndex: 'projectID',
        align: 'center',
        fixed: 'left',
        width: '10%',
        render: (projectID) => {
          return <span style={{ fontWeight: '700' }}>{projectID}</span>;
        },
      },
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        align: 'center',
        width: '10%',
      },
      {
        title: 'Divisions',
        dataIndex: 'divisions',
        width: '10%',
        align: 'center',
      },
      {
        title: 'Engagement Type',
        dataIndex: 'engagementType',
        width: '10%',
        align: 'center',
      },
      {
        title: 'Proj. Manager',
        dataIndex: 'projectManager',
        width: '10%',
        align: 'center',
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  render() {
    const { isUnhide } = this.state;

    const filter = (
      <>
        <ProjectFilter />
        <div className={styles.btnForm}>
          <Button className={styles.btnClose} onClick={this.handleVisible}>
            Close
          </Button>
          <Button
            className={styles.btnApply}
            form="filter"
            htmlType="submit"
            key="submit"
            onClick={this.handleSubmit}
          >
            Apply
          </Button>
        </div>
      </>
    );

    const data = [
      {
        projectID: 'TER1001',
        projectName: 'HRMS',
        divisions: 'Finance',
        engagementType: 'T&M',
        projectManager: 'Tuan Luong',
      },
    ];
    return (
      <div className={styles.Projects}>
        <div className={styles.documentHeader}>
          <div className={styles.documentHeaderTitle}>
            <span>Projects</span>
          </div>
          <div className={styles.documentHeaderFunction}>
            {/* Filter */}
            <div>
              <Popover
                placement="bottomRight"
                content={filter}
                title={() => (
                  <div className={styles.popoverHeader}>
                    <span className={styles.headTitle}>Filters</span>
                    <span
                      className={styles.closeIcon}
                      style={{ cursor: 'pointer' }}
                      onClick={this.handleVisible}
                    >
                      <img src={cancelIcon} alt="close" />
                    </span>
                  </div>
                )}
                trigger="click"
                visible={isUnhide}
                onVisibleChange={this.handleVisible}
                overlayClassName={styles.FilterPopover}
              >
                <div className={styles.filterButton} style={{ cursor: 'pointer' }}>
                  <FilterIcon />
                  <span className={styles.textButtonFilter}>Filter</span>
                </div>
              </Popover>
            </div>
            {/* Search */}
            <div className={styles.searchInp}>
              <Input placeholder="Search by Project name" prefix={<SearchOutlined />} />
            </div>
          </div>
        </div>
        <div className={styles.documentBody}>
          <Table columns={this.generateColumns()} dataSource={data} />
        </div>
      </div>
    );
  }
}

export default Projects;
