/* eslint-disable no-nested-ternary */
import { Table } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { convertMsToTime, projectColor } from '@/utils/timeSheet';
import EmptyComponent from '@/components/Empty';
import TimeoffPopover from './components/TimeoffPopover';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';
import AirPlanIcon from '@/assets/timeSheet/airplanIcon.svg';
import TaskPopover from './components/TaskPopover';
import styles from './index.less';

const MonthlyTable = (props) => {
  const {
    loadingFetchMyTimesheetByType = false,
    weeksOfMonth = [],
    timeoffList = [],
    data: { weeks: weeksProp = [], summary: summaryProp = [] } = {},
  } = props;

  const [formattedData, setFormattedData] = useState([]);

  // FUNCTIONS
  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  const formatData = () => {
    const obj =
      timeoffList.length > 0
        ? [Object.assign(timeoffList[0], { projectName: 'Timeoff' })]
        : timeoffList;
    setFormattedData(obj.concat(weeksProp));
  };

  useEffect(() => {
    formatData();
  }, [JSON.stringify(weeksProp), JSON.stringify(timeoffList)]);

  // RENDER UI
  const renderHeaderItem = (weekItem) => {
    const { week = '', startDate: startDate1 = '', endDate: endDate1 = '' } = weekItem;
    return (
      <div className={styles.timeStamp}>
        <div className={styles.weekName}>Week {week}</div>
        <div className={styles.weekDate}>
          {moment(startDate1).locale('en').format('MMM DD')} -{' '}
          {moment(endDate1).locale('en').format('MMM DD')}
        </div>
      </div>
    );
  };

  const renderTitle = (title, type) => {
    if (type === 1) return title;
    if (type === 3) return <span className={styles.totalHeader}>{title}</span>;
    return renderHeaderItem(title);
  };

  const columns = () => {
    const columnLength = weeksOfMonth.length + 1;
    const dateColumns = weeksOfMonth.map((weekItem) => {
      return {
        title: renderTitle(weekItem, 2),
        dataIndex: weekItem.week,
        key: weekItem.week,
        align: 'center',
        width: `${100 / columnLength}}%`,
        render: (value, row) => {
          const { weeks = [], projectName = '' } = row;
          const find = weeks.find((w) => w.week === weekItem.week) || {};
          const findTimeoff = timeoffList.find((w) => w.week === weekItem.week) || {};

          if (projectName === 'Timeoff' && findTimeoff) {
            return (
              <TimeoffPopover
                projectName={projectName}
                date={weekItem.week}
                timeoff={findTimeoff?.days}
                startDate={findTimeoff?.startDate}
                endDate={findTimeoff?.endDate}
                placement="bottomLeft"
              >
                {!findTimeoff || findTimeoff?.totalTimeOffTime === 0 ? (
                  <span className={styles.hourValue}>
                    <img src={EmptyLine} alt="" />
                  </span>
                ) : (
                  <span className={styles.hourValue}>
                    {convertMsToTime(findTimeoff?.totalTimeOffTime || 0)}
                  </span>
                )}
              </TimeoffPopover>
            );
          }
          return (
            <div>
              {!find || find?.weekProjectTime === 0 ? (
                <span className={styles.hourValue}>
                  <img src={EmptyLine} alt="" />
                </span>
              ) : (
                <span className={styles.hourValue}>
                  {convertMsToTime(find?.weekProjectTime || 0)}
                </span>
              )}
            </div>
          );
        },
      };
    });

    const result = [
      {
        title: renderTitle('All Projects', 1),
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'center',
        width: `${100 / columnLength}%`,
        render: (projectName, _, index) => {
          return (
            <div className={styles.projectName}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>
                  {projectName === 'Timeoff' ? (
                    <img src={AirPlanIcon} alt="" />
                  ) : projectName ? (
                    projectName.toString()?.charAt(0)
                  ) : (
                    'P'
                  )}
                </span>
              </div>
              <span className={styles.name}>{projectName}</span>
            </div>
          );
        },
      },
      ...dateColumns,
    ];
    return result;
  };

  // FOOTER
  const renderFooter = () => {
    if (weeksProp.length === 0) return '';
    return (
      <div className={styles.footer}>
        <div className={styles.item}>
          <span className={styles.text}>Total</span>
        </div>
        {weeksOfMonth.map((weekItem) => {
          const find = summaryProp.find((w) => w.week === weekItem.week) || {};
          const { week = '', dailies = [], weekTotalTime = '' } = find;
          return (
            <TaskPopover
              week={week}
              startDate={weekItem.startDate}
              endDate={weekItem.endDate}
              tasks={dailies}
            >
              {weekTotalTime && weekTotalTime !== 0 ? (
                <div className={styles.item}>
                  <span className={styles.value}>{convertMsToTime(weekTotalTime)}</span>
                </div>
              ) : (
                <div className={styles.item}>
                  <img src={EmptyLine} alt="" />
                </div>
              )}
            </TaskPopover>
          );
        })}
      </div>
    );
  };
  // MAIN AREA
  return (
    <div className={styles.MonthlyTable}>
      <div className={styles.tableContainer}>
        <Table
          columns={columns()}
          dataSource={formattedData}
          bordered
          pagination={false}
          // scroll={{ y: 440 }}
          footer={renderFooter}
          loading={loadingFetchMyTimesheetByType}
          locale={{
            emptyText: <EmptyComponent />,
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingFetchMyTimesheetByType: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
}))(MonthlyTable);
