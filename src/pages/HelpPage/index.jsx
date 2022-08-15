import { Affix } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import { PageContainer } from '@/layouts/layout/src';
import { getSettingPageUrl } from '@/utils/helpPage';
import { HELP_NAME, HELP_TYPE } from '@/constants/helpPage';
import HelpList from './components/HelpList';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

const HelpPage = (props) => {
  const { pathname } = window.location;
  const {
    dispatch,
    permissions,
    helpPage: { helpType: helpTypeProp = '' },
  } = props;
  const viewFAQSetting = permissions.viewFAQSetting !== -1;

  // this state to prevent use effect fetch list call multiple times
  const [isSavingHelpType, setIsSavingHelpType] = useState(true);

  const onSettingClick = () => {
    history.push(getSettingPageUrl(pathname));
  };

  useEffect(() => {
    let helpType = HELP_TYPE.FAQ;
    if (pathname.includes('help-center')) {
      helpType = HELP_TYPE.HRMS_HELP_CENTER;
    }
    dispatch({
      type: 'helpPage/save',
      payload: {
        helpType,
      },
    });
    setIsSavingHelpType(false);
  }, [pathname]);

  useEffect(() => {
    goToTop();

    return () => {
      dispatch({
        type: 'helpPage/clearState',
      });
    };
  }, []);

  if (isSavingHelpType) return null;

  return (
    <PageContainer>
      <div className={styles.HelpPage}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>{HELP_NAME[helpTypeProp]}</p>
            <div className={styles.header__right}>
              {viewFAQSetting && (
                <CustomBlueButton onClick={() => onSettingClick()}>Settings</CustomBlueButton>
              )}
            </div>
          </div>
        </Affix>
        <HelpList pathname={pathname} />
      </div>
    </PageContainer>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {}, helpPage }) => ({
  helpPage,
  currentUser,
  permissions,
}))(HelpPage);
