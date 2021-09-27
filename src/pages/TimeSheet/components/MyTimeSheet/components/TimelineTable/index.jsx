import React from 'react';
import { connect } from 'umi';
import { Table } from 'antd';
import moment from 'moment';
import styles from './index.less';
import EditIcon from '@/assets/timeSheet/edit.svg';
import DeleteIcon from '@/assets/timeSheet/del.svg';

const dateFormat = 'ddd, MMM Do';

const TimelineTable = (props) => {
  const { firstDateOfWeek = '', endDateOfWeek = '', myTimesheet = [] } = props;

  const compareDates = (dateTimeA, dateTimeB) => {
    const momentA = moment(dateTimeA, 'DD/MM/YYYY');
    const momentB = moment(dateTimeB, 'DD/MM/YYYY');
    if (momentA > momentB) return 1;
    if (momentA < momentB) return -1;
    return 0;
  };

  // Merge array cells - from FullStackOverFlow
  const createNewArr = (data) => {
    const formattedData = data.map((item) => {
      return {
        ...item,
        day: moment(item.day).format('MM/DD/YYYY'),
      };
    });
    return formattedData
      .reduce((result, item) => {
        // First, take the name field as a new array result
        if (result.indexOf(item.day) < 0) {
          result.push(item.day);
        }
        return result;
      }, [])
      .reduce((result, day) => {
        let newResult = JSON.parse(JSON.stringify(result));
        // Take the data with the same name as a new array, and add a new field * * rowSpan inside it**
        const children = formattedData.filter((item) => item.day === day);
        newResult = newResult.concat(
          children.map((item, index) => ({
            ...item,
            rowSpan: index === 0 ? children.length : 0, // Add the first row of data to the rowSpan field
          })),
        );
        return newResult;
      }, []);
  };

  // COLUMNS
  const generateColumns = () => {
    const columns = [
      {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
        fixed: 'left',
        render: (_, row) => {
          return {
            children: row.day ? moment(row.day).locale('en').format(dateFormat) : '-',
            props: {
              rowSpan: row.rowSpan,
            },
          };
        },
      },
      {
        title: 'Activity',
        dataIndex: 'activity',
        key: 'activity',
      },
      {
        title: 'Time In',
        dataIndex: 'timeIn',
        key: 'timeIn',
      },
      {
        title: 'Time Out',
        dataIndex: 'timeOut',
        key: 'timeOut',
      },
      {
        title: 'Nightshift',
        dataIndex: 'nightshift',
        key: 'nightshift',
        render: (nightshift) => (nightshift ? 'Yes' : 'No'),
      },
      {
        title: 'Total Hrs',
        dataIndex: 'totalHours',
        key: 'totalHours',
      },
      {
        title: 'Notes',
        dataIndex: 'notes',
        key: 'notes',
        width: '20%',
      },

      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <img src={DeleteIcon} alt="" />
              <img src={EditIcon} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  // MAIN AREA
  return (
    <div className={styles.TimelineTable}>
      <Table
        size="middle"
        columns={generateColumns()}
        dataSource={createNewArr(myTimesheet)}
        pagination={false}
      />
    </div>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  TimelineTable,
);
