import React, { PureComponent } from 'react';
import { Card, Row } from 'antd';
import ProjectHistoryTable from './components/ProjectHistoryTable';
import noDataIcon from './assets/no_data.svg';
import styles from './index.less';

class ProjectHistory extends PureComponent {
  renderExtraCard = () => {};

  renderPrjectHistoryTable = (projectHistoryData) => {
    let recentProjectHistoryTable = (
      // <ProjectHistoryTable list={expenseData} pagination={false} rowSelection={null} />
      <ProjectHistoryTable list={projectHistoryData} />
    );
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
        <Card className={styles.projectHistory_card} title="Project History">
          {this.renderPrjectHistoryTable(projectHistoryData)}
        </Card>
      </div>
    );
  }
}

export default ProjectHistory;
