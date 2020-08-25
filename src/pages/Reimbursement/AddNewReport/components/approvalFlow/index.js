import React, { PureComponent } from 'react';
import { Row, Col, Slider } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

class ApprovalFlow extends PureComponent {
  state = {};

  initDataFlow = () => {
    const { item = {} } = this.props;
    return [
      {
        name:
          item && item.status && item.status !== 'DRAFT'
            ? formatMessage({ id: 'employee.new.approval.step_1_0' })
            : formatMessage({ id: 'employee.new.approval.step_1' }),
        step: 0,
      },
    ];
  };

  dataFinance = () => {
    const { item = {}, manager } = this.props;
    let result = this.initDataFlow();
    let rLength = this.initDataFlow().length;
    if (item.approvalFlow && item.approvalFlow.nodes.length > 0) {
      rLength += item.approvalFlow.nodes.length;
      item.approvalFlow.nodes.map(nItem => {
        if (nItem.type !== 'none') {
          result = [
            ...result,
            {
              name: nItem.data.name || '',
              step: result[result.length - 1].step + 100 / rLength,
            },
          ];
        } else {
          result = [
            ...result,
            { name: manager.length > 0 ? manager : 'Aaric Nguyen', step: 100 / rLength },
          ];
        }
        return result;
      });
    }
    result = [
      ...result,
      { name: formatMessage({ id: 'employee.new.approval.step_5' }), step: 100 },
    ];
    return result;
  };

  renderDataStep = (name, index) => {
    return {
      [index]: {
        label: <div className={styles.approval_flow_slider_node}>{name}</div>,
      },
    };
  };

  dataFlow = () => {
    const dataFinance = this.dataFinance();
    let marks = {};
    dataFinance.map(nItem => {
      marks = { ...marks, ...this.renderDataStep(nItem.name, nItem.step) };
      return marks;
    });
    return marks;
  };

  render() {
    const { approvalStep = 0, status = '' } = this.props;
    let aStatus = '';
    if (status === 'REJECT') {
      aStatus = styles.approval_flow_paper_reject;
    } else if (status === 'INQUIRY') {
      aStatus = styles.approval_flow_paper_inquiry;
    }
    return (
      <Row>
        <Col
          span={24}
          style={{ overflow: 'auto', boxShadow: '0 2px 4px 0 rgba(180, 180, 180, 0.5)' }}
        >
          <div className={`${styles.approval_flow_paper} ${aStatus}`}>
            <Slider marks={this.dataFlow()} defaultValue={approvalStep} disabled />
          </div>
        </Col>
      </Row>
    );
  }
}

export default ApprovalFlow;
