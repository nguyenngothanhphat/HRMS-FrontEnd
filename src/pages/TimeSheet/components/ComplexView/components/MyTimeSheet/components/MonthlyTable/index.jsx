import { Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AirPlanIcon from '@/assets/timeSheet/airplanIcon.svg';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import EmptyComponent from '@/components/Empty';
import { projectColor } from '@/constants/timeSheet';
import { checkHolidayInWeek, convertMsToTime, holidayFormatDate } from '@/utils/timeSheet';
import TaskPopover from './components/TaskPopover';
import TimeoffPopover from './components/TimeoffPopover';
import styles from './index.less';
import AddTaskModal from '../../../AddTaskModal';

const MonthlyTable = (props) => {
  const {
    loadingFetchMyTimesheetByType = false,
    timeoffList = [],
    timeSheet: { holidays = [] },
    data: { weeks: weeksProp = [], summary: summaryProp = [] } = {},
  } = props;

  const [formattedData, setFormattedData] = useState([]);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [initialModal, setInitialModal] = useState({ date: '' });

  // FUNCTIONS
  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  const handleAddTaskModal = ({ date }) => {
    setAddTaskModalVisible(true);
    setInitialModal({ date });
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
    const isHoliday = checkHolidayInWeek(startDate1, endDate1, holidays);

    return (
      <div className={styles.timeStamp} style={{ backgroundColor: isHoliday ? '#FFFAF2' : '#FFF' }}>
        {isHoliday && (
          <Tooltip
            title={
              <span style={{ margin: 0, color: '#F98E2C' }}>
                {holidays.map((holiday) => (
                  <div key={holiday.date}>
                    {checkHolidayInWeek(startDate1, endDate1, [holiday])
                      ? `${holidayFormatDate(holiday.date)} is ${holiday.holiday}`
                      : null}
                  </div>
                ))}
              </span>
            }
            placement="top"
            color="#FFFAF2"
          >
            <img src={IconWarning} className={styles.holidayIconWarning} alt="" />
          </Tooltip>
        )}
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
    const columnLength = summaryProp.length + 1;
    const dateColumns = summaryProp.map((weekItem) => {
      const {
        week: weekSummary = '',
        startDate: startDateSummary = '',
        endDate: endDateSummary = '',
      } = weekItem;
      return {
        title: renderTitle(weekItem, 2),
        dataIndex: weekSummary,
        key: weekSummary,
        align: 'center',
        width: `${100 / columnLength}}%`,
        render: (value, row) => {
          const { weeks = [], projectName = '' } = row;
          const find = weeks.find((w) => w.week === weekSummary) || {};
          const { week = '', dailies = [], weekProjectTime = 0 } = find;

          const findTimeoff = timeoffList.find((w) => w.week === weekSummary) || {};
          const { days = [], startDate = '', endDate = '', totalTimeOffTime = 0 } = findTimeoff;

          if (projectName === 'Timeoff' && findTimeoff) {
            return (
              <TimeoffPopover
                projectName={projectName}
                date={weekSummary}
                timeoff={days}
                startDate={startDate}
                endDate={endDate}
                holidays={holidays}
                placement="bottomLeft"
              >
                {!findTimeoff || totalTimeOffTime === 0 ? (
                  <span className={styles.hourValue}>
                    <img src={EmptyLine} alt="" />
                  </span>
                ) : (
                  <span className={styles.hourValue}>{convertMsToTime(totalTimeOffTime)}</span>
                )}
              </TimeoffPopover>
            );
          }
          return (
            <TaskPopover
              week={week}
              startDate={startDateSummary}
              endDate={endDateSummary}
              tasks={dailies}
              placement="bottomLeft"
              onAddTaskModal={() => handleAddTaskModal({ date: startDateSummary })}
            >
              {!find || !weekProjectTime ? (
                <span className={styles.hourValue}>
                  <img src={EmptyLine} alt="" />
                </span>
              ) : (
                <span className={styles.hourValue}>{convertMsToTime(weekProjectTime)}</span>
              )}
            </TaskPopover>
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
                  {(projectName === 'Timeoff' && <img src={AirPlanIcon} alt="" />) || projectName
                    ? projectName.toString()?.charAt(0)
                    : 'P'}
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
        {summaryProp.map((weekItem) => {
          const {
            week = '',
            dailies = [],
            weekTotalTime = '',
            startDate = '',
            endDate = '',
          } = weekItem;
          return (
            <TaskPopover
              key={week}
              week={week}
              startDate={startDate}
              endDate={endDate}
              tasks={dailies}
              holidays={holidays}
              onAddTaskModal={() => handleAddTaskModal({ date: startDate })}
            >
              {weekTotalTime ? (
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
          footer={renderFooter}
          loading={loadingFetchMyTimesheetByType}
          locale={{
            emptyText: <EmptyComponent />,
          }}
        />
      </div>
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        mode="multiple"
        date={initialModal.date}
      />
    </div>
  );
};

export default connect(({ timeSheet, loading }) => ({
  timeSheet,
  loadingFetchMyTimesheetByType: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
}))(MonthlyTable);
