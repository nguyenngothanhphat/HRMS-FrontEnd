import { Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import FilterIcon from '@/assets/timeSheet/filter.svg';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import { projectColor, VIEW_TYPE } from '@/utils/timeSheet';
import styles from './index.less';

const { Option } = Select;

const Header = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    currentProject = '',
    setCurrentProject = () => {},
    viewChangeComponent = '',
    type = '',
    projectList = [],
    onChangeSearch = () => {},
    loadingFetchProjectList = false,
  } = props;

  // HEADER AREA FOR MONTH
  const onPrevClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(-1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(-1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const lastSunday = moment(startDate).add(-1, 'weeks');
      const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
      setStartDate(lastSunday);
      setEndDate(currentSunday);
    }
  };

  const onNextClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const nextSunday = moment(startDate).add(1, 'weeks');
      const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
      setStartDate(nextSunday);
      setEndDate(currentSunday);
    }
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  const iconStyle = (index) => {
    return {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24px',
      height: '24px',
      marginRight: '6px',
      background: getColorByIndex(index),
      border: '1px solid rgba(255, 255, 255, 0)',
      borderRadius: '50%',
      outline: 'none',
      cursor: 'default',
    };
  };

  const projectNameStyle = {
    display: 'block',
    paddingLeft: '2px',
    color: '#212020',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'left',
  };

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <div className={styles.projectSelector}>
          <Select
            value={currentProject || null}
            onChange={(val) => setCurrentProject(val)}
            loading={loadingFetchProjectList}
            disabled={loadingFetchProjectList}
          >
            {projectList.map((v, index) => (
              <Option value={v.id}>
                <div
                  className={styles.projectName}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <div className={styles.icon} style={iconStyle(index)}>
                    <span
                      style={{
                        color: '#fff',
                        fontWeight: '500',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {v.projectName ? v.projectName.toString()?.charAt(0) : 'P'}
                    </span>
                  </div>
                  <span className={styles.name} style={projectNameStyle}>
                    {v.projectName}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>
        <CustomRangePicker
          startDate={startDate}
          endDate={endDate}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onChange={onDatePickerChange}
          disabled
        />
      </div>
      <div className={styles.Header__middle}>{viewChangeComponent()}</div>
      <div className={styles.Header__right}>
        <div className={styles.filterIcon}>
          <img src={FilterIcon} alt="" />
          <span>Filter</span>
        </div>
        <SearchBar onChangeSearch={onChangeSearch} />
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
