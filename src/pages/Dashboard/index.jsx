import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { connect } from 'umi';
import { WIDGET_IDS } from '@/utils/dashboard';
import ActivityLog from './components/ActivityLog';
import Calendar from './components/Calendar';
import ManageWidgetsModal from './components/ManageWidgetsModal';
import MyApps from './components/MyApps';
import MyTeam from './components/MyTeam';
import Tasks from './components/Tasks';
import Timesheets from './components/Timesheets';
import styles from './index.less';

const SortableItem = SortableElement(({ widgets, value }) => {
  const find = widgets.find((w1) => w1.id === value);
  return (
    <Col xs={24} lg={12}>
      {find.component}
    </Col>
  );
});

const SortableList = SortableContainer(({ widgets, items }) => {
  return (
    <Row gutter={[24]} className={styles.dashboardContainer}>
      {items.map((widgetId, index) => (
        <SortableItem key={`item-${widgetId}}`} index={index} value={widgetId} widgets={widgets} />
      ))}
    </Row>
  );
});

const Dashboard = (props) => {
  const {
    employeeWidgets = [],
    currentUser: {
      _id: userMapId = '',
      firstName: userMapFirstName = '',
      employee = {} || {},
    } = {},
    dispatch,
    permissions = {},
  } = props;
  const { _id = '', generalInfo: { legalName = '' } = {} || {} } = employee;
  const [visibleWidgets, setVisibleWidgets] = useState([]);

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

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const visibleWidgetsTemp = JSON.parse(JSON.stringify(visibleWidgets));
      const arrayMove = (arr, fromIndex, toIndex) => {
        const element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
      };
      const result = arrayMove(visibleWidgetsTemp, oldIndex, newIndex);
      updateWidgets(result);
      setVisibleWidgets(result);
    }
  };

  // CONST
  const widgets = [
    {
      id: WIDGET_IDS.CALENDAR,
      component: <Calendar boxId={WIDGET_IDS.CALENDAR} />,
    },
    {
      id: WIDGET_IDS.TASK,
      component: <Tasks boxId={WIDGET_IDS.TASK} />,
    },
    {
      id: WIDGET_IDS.ACTIVITY,
      component: <ActivityLog boxId={WIDGET_IDS.ACTIVITY} />,
    },
    {
      id: WIDGET_IDS.MYTEAM,
      component: <MyTeam boxId={WIDGET_IDS.MYTEAM} />,
    },
    {
      id: WIDGET_IDS.MYAPP,
      component: <MyApps boxId={WIDGET_IDS.MYAPP} />,
    },
    {
      id: WIDGET_IDS.TIMESHEET,
      component: <Timesheets boxId={WIDGET_IDS.TIMESHEET} />,
    },
  ];

  // USE EFFECT
  useEffect(() => {
    // only manager / hr manager see My Team Widget
    // const viewMyTeamDashboard = permissions.viewMyTeamDashboard !== -1;
    const viewTimesheetDashboard = permissions.viewTimesheetDashboard !== -1;

    const getShowingWidgets = () => {
      let result = [...employeeWidgets];
      // if (!viewMyTeamDashboard) {
      //   result = employeeWidgets.filter((w) => w !== WIDGET_IDS.MYTEAM);
      // }
      if (!viewTimesheetDashboard) {
        result = result.filter((w) => w !== WIDGET_IDS.TIMESHEET);
      }
      return result;
    };

    const showingWidgets = getShowingWidgets();

    setVisibleWidgets([...showingWidgets]);
  }, [JSON.stringify(employeeWidgets)]);

  // useEffect(() => {
  //   if (employeeWidgets.length === 0) {
  //     setManageWGVisible(true);
  //   }
  // }, []);

  // set employee id to dashboard redux
  useEffect(() => {
    dispatch({
      type: 'dashboard/save',
      payload: {
        employeeId: _id,
      },
    });
  }, [_id]);

  // RENDER UI
  const renderHello = (name = '') => {
    return (
      <div className={styles.helloContainer}>
        <span>Hello {name}! 👋🏻</span>
      </div>
    );
  };
  const renderWidgets = () => {
    return (
      <SortableList
        items={visibleWidgets}
        axis="xy"
        onSortEnd={onSortEnd}
        distance={10}
        widgets={widgets}
      />
    );
  };

  return (
    <div className={styles.Dashboard}>
      {renderHello(legalName || userMapFirstName)}
      {renderWidgets()}
      <ManageWidgetsModal />
    </div>
  );
};

export default connect(
  ({
    dashboard: { employeeWidgets = [] } = {},
    user: { currentUser = {}, permissions = {} } = {},
  }) => ({
    currentUser,
    permissions,
    employeeWidgets,
  }),
)(Dashboard);
