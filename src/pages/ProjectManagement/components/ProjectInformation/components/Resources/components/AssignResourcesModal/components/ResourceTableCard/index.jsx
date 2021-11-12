import { Card, Col, Row } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import { connect } from 'umi';
import TimeIcon from '@/assets/projectManagement/time.svg';
import CommonTable from '@/pages/ProjectManagement/components/ProjectInformation/components/CommonTable';
import FilterButton from '@/pages/ProjectManagement/components/ProjectInformation/components/FilterButton';
import FilterPopover from '@/pages/ProjectManagement/components/ProjectInformation/components/FilterPopover';
import SearchBar from '@/pages/ProjectManagement/components/ProjectInformation/components/SearchBar';
import FilterResourcesListContent from './components/FilterResourcesListContent';
import styles from './index.less';

const ResourceTableCard = () => {
  const onSearchDebounce = debounce((value) => {
    console.log('value', value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const data = [
    {
      id: 1,
      user: {
        name: 'Randy Dias',
        userId: 'randydias',
        available: true,
      },
      division: 'Design',
      designation: 'Associate Senior UX Designer',
      experience: 3,
      projects: [
        {
          id: 1,
          name: 'ABC Project',
        },
        {
          id: 2,
          name: 'ABC Redesign Project',
        },
        {
          id: 3,
          name: 'ABC Redesign Project',
        },
      ],
    },
    {
      id: 2,
      user: {
        name: 'Brandon Carder',
        userId: 'brandon',
        available: false,
      },
      division: 'Design',
      designation: 'Associate Senior UX Designer',
      experience: 3,
      projects: [
        {
          id: 1,
          name: 'ABC Project',
        },
      ],
    },
  ];

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'user',
        key: 'user',
        fixed: 'left',
        render: (user, row, index) => {
          const { name = '', userId = '', available = false } = user;
          return (
            <div className={styles.cell}>
              <div className={styles.resourceName}>
                {available ? (
                  <span className={styles.availableNowTag}>Available Now</span>
                ) : (
                  <span className={styles.availableSoonTag}>Available Soon</span>
                )}
                <span className={styles.selectableTag}>
                  {name} ({userId})
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        render: (division) => {
          return (
            <div className={styles.cell}>
              <span className={styles.division}>{division}</span>
            </div>
          );
        },
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
        render: (designation) => {
          return (
            <div className={styles.cell}>
              <span>{designation}</span>
            </div>
          );
        },
      },
      {
        title: 'Experience',
        dataIndex: 'experience',
        key: 'experience',
        render: (experience) => {
          return (
            <div className={styles.cell}>
              <span>{experience}</span>
            </div>
          );
        },
      },
      {
        title: 'Projects',
        dataIndex: 'projects',
        key: 'projects',
        width: '20%',
        render: (projects = []) => {
          return (
            <Row className={styles.projectContainer} align="middle">
              {projects.map((p, i) => {
                return (
                  <>
                    <Col
                      span={24}
                      className={`${styles.project} ${projects.length > 1 ? styles.hasBorder : ''}`}
                      style={
                        i + 1 < projects.length
                          ? {
                              borderBottom: '1px solid #d6dce0',
                            }
                          : {}
                      }
                    >
                      <span className={styles.selectableTag}>{p.name}</span>
                    </Col>
                  </>
                );
              })}
            </Row>
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: '8%',
        render: () => {
          return <img src={TimeIcon} alt="" />;
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const content = <FilterResourcesListContent />;
    return (
      <div className={styles.options}>
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <SearchBar onSearch={onSearch} placeholder="Search by Name" />
      </div>
    );
  };

  return (
    <div className={styles.ResourceTableCard}>
      <Card title="UX Designers - 0/2" extra={renderOption()}>
        <CommonTable columns={generateColumns()} list={data} selectable rowKey="id" />
      </Card>
    </div>
  );
};
export default connect(() => ({}))(ResourceTableCard);
