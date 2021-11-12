import { Button, Card } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import { connect } from 'umi';
import ViewIcon from '@/assets/projectManagement/view.svg';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import FilterButton from '../../../FilterButton';
import FilterPopover from '../../../FilterPopover';
import CommonTable from '../../../ResourceTable';
import SearchBar from '../../../SearchBar';
import FilterResourceTypeContent from './components/FilterResourceTypeContent';
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

  const reformatData = () => {
    let result = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      const rows = item.projects.map((project) => {
        return {
          ...item,
          project,
        };
      });
      result = [...result, ...rows];
    }
    return result;
  };

  const generateSpan = (formattedData, row, index) => {
    let span = 0;
    const count = formattedData.filter((x) => x.id === row.id).length;
    const firstIndex = formattedData.findIndex((x) => x.id === row.id);
    if (firstIndex < index) {
      span = 0;
    } else {
      span = count;
    }
    return span;
  };

  const renderAction = (row) => {
    if (!row?.test) {
      return (
        <Button className={styles.assignBtn} icon={<img src={OrangeAddIcon} alt="" />}>
          Assign
        </Button>
      );
    }
    return <img src={ViewIcon} alt="" />;
  };

  const generateColumns = (formattedData) => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'user',
        key: 'user',
        fixed: 'left',
        render: (user, row, index) => {
          const { name = '', userId = '', available = false } = user;
          const obj = {
            children: <span>{name}</span>,
            props: {
              rowSpan: generateSpan(formattedData, row, index),
            },
          };
          return obj;
        },
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        render: (division, row, index) => {
          const obj = {
            children: <span>{division}</span>,
            props: {
              rowSpan: generateSpan(formattedData, row, index),
            },
          };
          return obj;
        },
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
        render: (designation, row, index) => {
          const obj = {
            children: <span>{designation}</span>,
            props: {
              rowSpan: generateSpan(formattedData, row, index),
            },
          };
          return obj;
        },
      },
      {
        title: 'Experience',
        dataIndex: 'experience',
        key: 'experience',
        render: (experience, row, index) => {
          const obj = {
            children: <span>{experience}</span>,
            props: {
              rowSpan: generateSpan(formattedData, row, index),
            },
          };
          return obj;
        },
      },
      {
        title: 'Projects',
        dataIndex: 'project',
        key: 'project',
        render: (project) => {
          return <span>{project?.name || '-'}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        render: (value, row, index) => {
          const obj = {
            children: renderAction(row),
            props: {
              rowSpan: generateSpan(formattedData, row, index),
            },
          };
          return obj;
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const content = <FilterResourceTypeContent />;
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
        <div className={styles.tableContainer}>
          <CommonTable columns={generateColumns(reformatData())} list={reformatData()} />
        </div>
      </Card>
    </div>
  );
};
export default connect(() => ({}))(ResourceTableCard);
