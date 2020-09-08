import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
import { DownloadOutlined, CaretRightOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

class TypeRow extends PureComponent {
  genExtra = () => (
    <div className={styles.statusAndDownload}>
      <a>Complete</a>
      <DownloadOutlined
        className={styles.downloadButton}
        onClick={(event) => {
        console.log('download onclick');
        event.stopPropagation();
      }}
      />
    </div>
  );

    render() {
        const { data } = this.props;
        return (
          <div>
            { data.map(row => (
              <Collapse
                defaultActiveKey={['1']}
                onChange={callback}
                expandIcon={({ isActive }) => <CaretRightOutlined className={styles.collapseIcon} rotate={isActive ? 90 : 0} />}
                className={styles.eachCollapse}
              >
                <Panel header={row.title} className={styles.eachPanel} key="1" extra={this.genExtra()}>
                  { row.rows.map(tt => (
                    <div className={styles.eachRow}>
                      <div className={styles.fileName}><a>{tt.fileName}</a></div>
                      <div>{tt.generatedBy}</div>
                      <div>{tt.date}</div>
                      <div />
                    </div>
                  )) }
                </Panel>
              </Collapse>
            ))}
          </div>
        )
    }
}

export default TypeRow;