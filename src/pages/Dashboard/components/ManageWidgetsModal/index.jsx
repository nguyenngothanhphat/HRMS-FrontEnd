import { Button, Modal, Row, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { WIDGETS, WIDGET_IDS } from '@/utils/dashboard';
import styles from './index.less';
import WidgetCard from './components/WidgetCard';
import SettingIcon from '@/assets/dashboard/setting.svg';

const ManageWidgetsModal = (props) => {
  const { currentUser: { _id: userMapId = '', firstName: userMapFirstName = '' } = {} } = props;
  const { dispatch, loadingUpdateWidgets = false, employeeWidgets = [], permissions = {} } = props;
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
      notification.error({ message: 'Please choose at least one widget' });
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
        <Button className={styles.btnCancel} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="primary" onClick={onFinish} loading={loadingUpdateWidgets}>
          Done
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    const viewMyTeamDashboard = permissions.viewMyTeamDashboard !== -1;
    const viewTimesheetDashboard = permissions.viewTimesheetDashboard !== -1;

    const getShowingWidgets = () => {
      let result = [];
      if (!viewMyTeamDashboard) {
        result = WIDGETS.filter((w) => w.id !== WIDGET_IDS.MYTEAM);
      }
      if (!viewTimesheetDashboard) {
        result = result.filter((w) => w.id !== WIDGET_IDS.TIMESHEET);
      }
      return result;
    };

    const showingWidgets = getShowingWidgets();
    return (
      <div className={styles.content}>
        <div className={styles.widgets}>
          <Row gutter={[60, 30]}>
            {showingWidgets.map((wg) => {
              const checked = selectedWidgets.includes(wg.id);
              return <WidgetCard item={wg} onSelectWidget={onSelectWidget} checked={checked} />;
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
