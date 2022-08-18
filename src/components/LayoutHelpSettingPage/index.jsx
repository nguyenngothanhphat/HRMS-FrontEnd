import { Col, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { HELP_TYPE } from '@/constants/helpPage';
import ItemMenu from './components/ItemMenu';
import s from './index.less';

const LayoutHelpSettingPage = (props) => {
  const { dispatch, loading = false, listMenu = [], reId = '', baseUrl = '' } = props;
  const { pathname } = window.location;

  const [selectedItemId, setSelectedItemId] = useState('');
  const [displayComponent, setDisplayComponent] = useState('');
  // this state to prevent use effect fetch list call multiple times
  const [isSavingHelpType, setIsSavingHelpType] = useState(true);

  const fetchTab = () => {
    const findTab = listMenu.find((menu) => menu.link === reId) || listMenu[0];
    setSelectedItemId(findTab.id || 1);
    setDisplayComponent(findTab.component);
  };

  useEffect(() => {
    let helpTypeTemp = HELP_TYPE.FAQ;
    if (pathname.includes('help-center')) {
      helpTypeTemp = HELP_TYPE.HRMS_HELP_CENTER;
    }
    dispatch({
      type: 'helpPage/save',
      payload: {
        helpType: helpTypeTemp,
      },
    });
    setIsSavingHelpType(false);
  }, [pathname]);

  useEffect(() => {
    fetchTab();
  }, [reId]);

  const _handleClick = (item) => {
    history.push(`${baseUrl}/${item.link}`);
  };

  if (isSavingHelpType) return '';
  return (
    <Row className={s.LayoutHelpSettingPage}>
      <Col xs={24} md={6} xl={4} className={s.viewLeft}>
        <div className={s.viewLeft__menu}>
          {listMenu.map((item) => (
            <ItemMenu
              key={item.id}
              item={item}
              handleClick={_handleClick}
              selectedItemId={selectedItemId}
            />
          ))}
        </div>
      </Col>
      <Col xs={24} md={18} xl={20} className={s.viewRight}>
        {loading ? <Skeleton /> : displayComponent}
      </Col>
    </Row>
  );
};

export default connect(() => ({}))(LayoutHelpSettingPage);
