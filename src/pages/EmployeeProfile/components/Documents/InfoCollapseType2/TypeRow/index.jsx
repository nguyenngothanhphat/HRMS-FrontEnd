import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
import { DownloadOutlined, CaretRightOutlined, FileOutlined } from '@ant-design/icons';
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
                  { row.files.map(file => (
                    <div className={styles.eachRow}>
                      <div className={styles.fileName}>
                        <FileOutlined className={styles.fileIcon} />
                        <a>{file.fileName}</a>
                      </div>
                      <span>{file.generatedBy}</span>
                      <span>{file.date}</span>
                      <span />
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