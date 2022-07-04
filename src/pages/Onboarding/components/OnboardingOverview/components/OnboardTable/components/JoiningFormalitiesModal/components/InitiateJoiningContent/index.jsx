import React, { useEffect } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { connect } from 'umi';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';
import TooltipIcon from '@/assets/tooltip.svg';
import warning from '@/assets/warning.svg';

const InitiateJoiningContent = (props) => {
  const {
    dispatch,
    listJoiningFormalities = [],
    checkList,
    setCheckList,
    settingId: { idGenerate = {} },
    workLocation: { _id = '' },
    setCallback,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'onboard/fetchIdbyLocation',
      payload: {
        location: _id,
      },
    });
    setCallback(idGenerate?.length);
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
      {idGenerate?.length && (
        <div>
          <div>
            <img src={warning} alt="warnIcon" />
            <span className={styles.warning}>
              {' '}
              Settings for filling the Employee ID is missing, please fill it to proceed further
            </span>
          </div>

          <div>
            To do this,{' '}
            <span className={styles.link}>
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
    onboard: {
      joiningFormalities: {
        listJoiningFormalities = [],
        generatedId = '',
        prefix = '',
        idItem = '',
        settingId = {},
      } = {},
    },
    newCandidateForm: {
      tempData: { workLocation = {} },
    },
  }) => ({
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
    settingId,
    workLocation,
  }),
)(InitiateJoiningContent);
