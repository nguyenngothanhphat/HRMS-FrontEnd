import React, { PureComponent } from 'react';
import { Card, Row, Menu, Dropdown, Input } from 'antd';
import ProjectHistoryTable from './components/ProjectHistoryTable';
import noDataIcon from './assets/no_data.svg';
import filterIcon from './assets/filter_icon.svg';
import styles from './index.less';

class ProjectHistory extends PureComponent {
  renderExtraCard = () => {
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            Lest than 1 months
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
            1 Months
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
            2 Months
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
            3 Months
          </a>
        </Menu.Item>
      </Menu>
    );
    const { Search } = Input;
    const extraCard = (
      <Row gutter={[16, 0]} className={styles.extraCard} align="middle">
        <Dropdown overlay={menu} trigger={['click']}>
          <div className={styles.extraCard_filter}>
            <img className={styles.extraCard_filterImg} alt="" src={filterIcon} />
            <span>Filter</span>
          </div>
        </Dropdown>
        <Search className={styles.extraCard_search} />
      </Row>
    );
    return extraCard;
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
          title="Project History"
          extra={this.renderExtraCard()}
        >
          {this.renderPrjectHistoryTable(projectHistoryData)}
        </Card>
      </div>
    );
  }
}

export default ProjectHistory;
