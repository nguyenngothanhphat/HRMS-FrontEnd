import React, { PureComponent } from 'react';
import { Collapse, Row, Col } from 'antd';
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
                    <Row className={styles.eachRow}>
                      <Col span={7} className={styles.fileName}>
                        <FileOutlined className={styles.fileIcon} />
                        <a>{file.fileName}</a>
                      </Col>
                      <Col span={8}>{file.generatedBy}</Col>
                      <Col span={8}>{file.date}</Col>
                      <Col span={1} />
                    </Row>
                  )) }
                </Panel>
              </Collapse>
            ))}
          </div>
        )
    }
}

export default TypeRow;