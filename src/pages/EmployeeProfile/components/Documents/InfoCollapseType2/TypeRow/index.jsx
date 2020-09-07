import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
  `;
const genExtra = () => (
  <div className={styles.downloadButton}>
    <a>Complete</a>
    <DownloadOutlined />
  </div>
);

class TypeRow extends PureComponent {
    render() {
        return (
          <Collapse
            defaultActiveKey={['1']}
            onChange={callback}
          >
            <Panel header="This is panel header 1" key="1" extra={genExtra()}>
              <div>{text}</div>
            </Panel>
          </Collapse>
        )
    }
}

export default TypeRow;