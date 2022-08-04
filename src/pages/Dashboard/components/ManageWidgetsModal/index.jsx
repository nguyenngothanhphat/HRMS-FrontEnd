import { Modal, notification, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import SettingIcon from '@/assets/dashboard/setting.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { WIDGETS } from '@/constants/dashboard';
import WidgetCard from './components/WidgetCard';
import styles from './index.less';

const ManageWidgetsModal = (props) => {
  const { currentUser: { _id: userMapId = '', firstName: userMapFirstName = '' } = {} } = props;
  const {
    dispatch,
    loadingUpdateWidgets = false,
    employeeWidgets = [],
    widgetPermission = [],
  } = props;

  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [visible, setVisible] = useState(false);

  // USE EFFECT
  useEffect(() => {
    setSelectedWidgets(employeeWidgets);
    return () => {
      setSelectedWidgets([]);
    };
  }, [JSON.stringify(employeeWidgets)]);

  useEffect(() => {
    if (employeeWidgets.length === 0) {
      setVisible(true);
    }
  }, []);

  // FUNCTIONS
  const updateWidgets = (widgetDashboardShow) => {
    return dispatch({
      type: 'dashboard/updateWidgetsEffect',
      payload: {
        id: userMapId,
        firstName: userMapFirstName,
        widgetDashboardShow,
      },
    });
  };

  const onCancel = () => {
    if (employeeWidgets.length === 0) {
      history.push('/home');
    } else {
      setVisible(false);
    }
  };

  const onFinish = async () => {
    if (selectedWidgets.length === 0) {
      notification.error({ message: 'Please choose at least one widget' });
    } else {
      const res = await updateWidgets(selectedWidgets);
      if (res.statusCode === 200) {
        notification.success({ message: 'Your widgets are saved' });
        setVisible(false);
      }
    }
  };

  const onSelectWidget = (id, value) => {
    let selectedWidgetsTemp = JSON.parse(JSON.stringify(selectedWidgets));

    if (value) {
      const find = selectedWidgetsTemp.find((val) => val === id);
      if (!find) selectedWidgetsTemp.push(id);
    } else {
      selectedWidgetsTemp = selectedWidgetsTemp.filter((val) => val !== id);
    }
    setSelectedWidgets(selectedWidgetsTemp);
  };

  // RENDER UI
  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.left}>
          <p>Manage widgets</p>
          <span>
            All widgets from across the apps on this portal are displayed below. Have them on your
            dashboard by selecting them and make your workflow simpler and the tools you used easily
            accessible.
          </span>
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className={styles.footer}>
        <CustomSecondaryButton onClick={onCancel}>Cancel</CustomSecondaryButton>
        <CustomPrimaryButton onClick={onFinish} loading={loadingUpdateWidgets}>
          Done
        </CustomPrimaryButton>
      </div>
    );
  };

  const renderContent = () => {
    const showingWidgets = WIDGETS.filter(
      (w) => widgetPermission.find((x) => x.id === w.id)?.permission,
    );

    return (
      <div className={styles.content}>
        <div className={styles.widgets}>
          <Row gutter={[60, 30]}>
            {showingWidgets.map((wg) => {
              const checked = selectedWidgets.includes(wg.id);
              return (
                <WidgetCard
                  item={wg}
                  onSelectWidget={onSelectWidget}
                  checked={checked}
                  key={wg.id}
                />
              );
            })}
          </Row>
        </div>
        {renderFooter()}
      </div>
    );
  };

  const renderModalContent = () => {
    return (
      <div className={styles.container}>
        {renderHeader()}
        {renderContent()}
      </div>
    );
  };

  const renderManageWidgets = () => {
    return (
      <div className={styles.manageWidgets} onClick={() => setVisible(true)}>
        <img src={SettingIcon} alt="" />
        <span>Manage Widgets</span>
      </div>
    );
  };

  return (
    <>
      <Modal
        className={styles.ManageWidgetsModal}
        onCancel={onCancel}
        destroyOnClose
        footer={null}
        centered
        visible={visible}
        width={750}
      >
        {renderModalContent()}
      </Modal>
      {renderManageWidgets()}
    </>
  );
};

export default connect(
  ({
    dashboard: { employeeWidgets = [] } = {},
    loading,
    user: { currentUser = {}, permissions = {} } = {},
  }) => ({
    loadingUpdateWidgets: loading.effects['dashboard/updateWidgetsEffect'],
    currentUser,
    permissions,
    employeeWidgets,
  }),
)(ManageWidgetsModal);
