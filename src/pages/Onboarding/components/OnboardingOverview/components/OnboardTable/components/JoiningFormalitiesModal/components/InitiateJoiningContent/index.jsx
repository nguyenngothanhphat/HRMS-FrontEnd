import { Checkbox, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import TooltipIcon from '@/assets/tooltip.svg';
import WarningIcon from '@/assets/warning.svg';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

const InitiateJoiningContent = (props) => {
  const {
    dispatch,
    listJoiningFormalities = [],
    checkList = [],
    setCheckList,
    settingId: { employeeIdList = [] },
    workLocation: { _id = '' } = {},
    setCallback,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'onboard/getEmployeeIdFormatByLocation',
      payload: {
        location: _id,
      },
    });
    setCallback(!!employeeIdList.length);
  }, []);

  return (
    <>
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={(value) => setCheckList(value)}
        value={checkList}
      >
        {listJoiningFormalities.map((item) => (
          <div key={item.name}>
            <Checkbox value={item._id}>
              <div className={styles.labelCheckbox}>{item.name}</div>
            </Checkbox>
            <Tooltip
              title={<div className={styles.contentTooltip}>{item.description}</div>}
              color="#fff"
              placement="right"
              overlayClassName={styles.tooltipOverlay}
            >
              <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
            </Tooltip>
          </div>
        ))}
      </Checkbox.Group>
      {!!employeeIdList.length && (
        <div>
          <div>
            <img src={WarningIcon} alt="warnIcon" />
            <span className={styles.warning}>
              {' '}
              Settings for filling the Employee ID is missing, please fill it to proceed further
            </span>
          </div>

          <div>
            To do this,{' '}
            <span
              className={styles.link}
              onClick={() => {
                history.push(`/onboarding/settings/joining-formalities`);
              }}
            >
              go to Settings &gt; Joining Formalities &gt; Employee ID
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default connect(
  ({
    onboard: { joiningFormalities: { listJoiningFormalities = [], settingId = {} } = {} },
    newCandidateForm: {
      tempData: { workLocation = {} },
    },
  }) => ({
    listJoiningFormalities,
    settingId,
    workLocation,
  }),
)(InitiateJoiningContent);
