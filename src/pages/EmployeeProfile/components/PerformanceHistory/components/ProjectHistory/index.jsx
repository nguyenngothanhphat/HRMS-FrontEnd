import React, { PureComponent } from 'react';
import { Card } from 'antd';
import ProjectHistoryTable from './components/ProjectHistoryTable';
import styles from './index.less';

class ProjectHistory extends PureComponent {
  renderExtraCard = () => {};

  render() {
    return (
      <div className={styles.projectHistory}>
        <Card className={styles.projectHistory_card} title="Project History">
          <ProjectHistoryTable />
        </Card>
      </div>
    );
  }
}

export default ProjectHistory;
