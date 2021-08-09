import React, { PureComponent } from 'react';
import { Card, Row, Menu, Dropdown, Input, message, Button } from 'antd';
import { formatMessage } from 'umi';
import ProjectHistoryTable from './components/ProjectHistoryTable';
import noDataIcon from './assets/no_data.svg';
import filterIcon from './assets/filter_icon.svg';
import styles from './index.less';

class ProjectHistory extends PureComponent {
  renderExtraCard = (projectHistoryData) => {
    const menu = (
      <Menu onClick={this.onClickItemFilter}>
        <Menu.Item key="1">
          <span>Lest than 1 month</span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>1 Month</span>
        </Menu.Item>
        <Menu.Item key="3">
          <span>2 Months</span>
        </Menu.Item>
        <Menu.Item key="4">
          <span>3 Months</span>
        </Menu.Item>
      </Menu>
    );
    const { Search } = Input;
    const projectHistoryList = projectHistoryData.length;
    let classNameButton = `${styles.extraCard_filterBtn} `;
    let classNameSearch = `${styles.extraCard_search} `;
    if (projectHistoryList === 0) {
      classNameButton += `${styles.extraCard_filterBtnDisabled} `;
      classNameSearch += `${styles.extraCard_searchDisabled} `;
    }
    const extraCard = (
      <Row gutter={[16, 0]} className={styles.extraCard} align="middle">
        <Dropdown
          overlayClassName={styles.extraCard_dropdownMenu}
          overlay={menu}
          trigger={['click']}
          disabled={!(projectHistoryList > 0)}
        >
          <div className={styles.extraCard_filter}>
            <Button className={classNameButton}>
              <img className={styles.extraCard_filterImg} alt="" src={filterIcon} />
              <span>Filter</span>
            </Button>
          </div>
        </Dropdown>
        <Search
          placeholder="Search.."
          disabled={!(projectHistoryList > 0)}
          className={classNameSearch}
        />
      </Row>
    );
    return extraCard;
  };

  onClickItemFilter = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  renderPrjectHistoryTable = (projectHistoryData) => {
    let recentProjectHistoryTable = <ProjectHistoryTable list={projectHistoryData} />;
    if (projectHistoryData.length < 1) {
      recentProjectHistoryTable = (
        <Row className={styles.recentEmptyBlocks}>
          <div className={styles.recentEmptyBlocks_img}>
            <img className={styles.emptyIcon} alt="" src={noDataIcon} />
          </div>
        </Row>
      );
    }
    return recentProjectHistoryTable;
  };

  render() {
    // const projectHistoryData = [];
    const projectHistoryData = [
      {
        key: '1',
        projectName: 'MyGiis Singapore',
        team: 32,
        status: 'Ongoing',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
      {
        key: '2',
        projectName: 'Udaan',
        team: 42,
        status: 'Complete',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
      {
        key: '3',
        projectName: 'Hukoomi',
        team: 42,
        status: 'Complete',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
      {
        key: '4',
        projectName: 'Kotak',
        team: 42,
        status: 'Ongoing',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
    ];
    return (
      <div className={styles.projectHistory}>
        <Card
          className={styles.projectHistory_card}
          title={formatMessage({
            id: 'pages.employeeProfile.performanceHistory.projectHistory',
          })}
          extra={this.renderExtraCard(projectHistoryData)}
        >
          {this.renderPrjectHistoryTable(projectHistoryData)}
        </Card>
      </div>
    );
  }
}

export default ProjectHistory;
