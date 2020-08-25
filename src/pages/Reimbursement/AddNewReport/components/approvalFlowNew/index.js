import React from 'react';
import { Row, Steps, Popover } from 'antd';
// import { formatMessage } from 'umi-plugin-react/locale';
// import Moment from 'moment';
// import Link from 'umi/link';
// import { extendMoment } from 'moment-range';
import styles from './index.less';

// const moment = extendMoment(Moment);
const approvalFlowNew = props => {
  const { approvalFlow = {}, currentUser = {} } = props;
  // const [sortedTable, setSortedTable] = useState({ columnKey: 'submittedon', order: 'descend' });
  // const [pageSelected, setPageSelected] = useState();

  const getNameStatusByKey = key => {
    let name = 'wait';
    switch (key) {
      case 'REJECT':
        name = 'Rejected';
        break;
      case 'DRAFT':
        name = 'Draft';
        break;
      case 'INQUIRY':
        name = 'Inquiry';
        break;
      case 'REPORTED':
      case 'PENDING':
        name = 'Reported';
        break;
      case 'COMPLETE':
        name = 'Completed';
        break;
      default:
        break;
    }
    return name;
  };

  const getDescription = data => {
    let description = ' ';
    switch (data.status) {
      case 'ACTIVE':
      case 'DRAFT':
        description = '';
        break;
      case 'REJECT':
        if (data.stepIndex <= data.approvalStep) {
          description = data.stepIndex < data.approvalStep ? 'Approved' : 'Rejected';
        }
        break;
      case 'INQUIRY':
        if (data.stepIndex <= data.approvalStep) {
          description = data.stepIndex < data.approvalStep ? 'Approved' : 'Sent Back';
        }
        break;
      case 'REPORTED':
      case 'PENDING':
        if (data.stepIndex <= data.approvalStep) {
          description = 'Approved';
        } else {
          description = data.stepIndex - 1 === data.approvalStep ? 'Pending Approval' : '';
        }
        break;
      case 'COMPLETE':
        description = 'Approved';
        break;
      default:
        break;
    }
    return description;
  };

  const getDescriptionPopup = (data, status) => {
    let description = ' ';
    switch (status) {
      case 'REJECT':
        description =
          data.type === 'none' ? `${data.value} Rejected` : `${data.data.name} Rejected`;
        break;
      case 'DRAFT':
        break;
      case 'INQUIRY':
        description =
          data.type === 'none'
            ? `${data.value} asked for more info`
            : `${data.data.name} asked for more info`;
        break;
      case 'REPORTED':
      case 'PENDING':
        description =
          data.type === 'none'
            ? `Pending Approval by ${data.value}`
            : `Pending Approval by ${data.data.name}`;
        break;
      case 'COMPLETE':
        break;
      default:
        break;
    }
    return description;
  };

  const getManagerName = () => {
    let result = approvalFlow.manager ? approvalFlow.manager.fullName : '';
    if (!result) {
      result = currentUser.manager ? currentUser.manager.fullName : '';
    }
    return result;
  };

  const getStepTitle = params => {
    let result = params.item ? params.item.value : '';
    if (params.item && params.item.type !== 'none') {
      result = params.item.data.name;
    } else {
      result = getManagerName();
    }
    return result;
  };

  const renderSteps = data => {
    let result = null;
    if (data.approvalFlow) {
      result = data.approvalFlow.nodes.map((item, index) => (
        <Steps.Step
          key={item._id}
          title={getStepTitle({ item, data })}
          status={data.approvalStep - 1 === index ? getNameStatusByKey(data.status) : null}
          description={getDescription({
            status: data.status,
            stepIndex: index,
            approvalStep: data.approvalStep - 1,
          })}
          descriptionpopup={
            data.approvalStep - 1 === index && item ? getDescriptionPopup(item, data.status) : ''
          }
          itemdata={data}
        />
      ));
    } else {
      result = data.nodes
        ? data.nodes.map((item, index) => {
            return (
              <Steps.Step
                key={item._id}
                title={getStepTitle({ item, data })}
                status={data.approvalStep - 1 === index ? getNameStatusByKey(data.status) : null}
                description={getDescription({
                  status: data.status,
                  stepIndex: index,
                  approvalStep: data.approvalStep,
                })}
                itemdata={data}
                descriptionpopup={
                  data.approvalStep - 1 === index && item
                    ? getDescriptionPopup(item, data.status)
                    : ''
                }
              />
            );
          })
        : null;
    }
    return result;
  };

  const customDot = (dot, attribute) => {
    const itemProps = dot._owner.pendingProps;
    // const data = itemProps.itemdata;
    return attribute.description ? (
      <Popover
        placement="bottom"
        content={
          <span
            className={`${styles.popover} ${styles[attribute.status]}`}
            style={{ display: 'block' }}
          >
            <div>{attribute.status ? `Status: ${attribute.status}` : ' '}</div>
            <div>{itemProps.descriptionpopup}</div>
            <div className={styles.arrow} />
          </span>
        }
      >
        {dot}
      </Popover>
    ) : (
      dot
    );
  };

  const renderFirstPointStep = data => {
    let result = '';
    if (data) {
      switch (data.status.toUpperCase()) {
        case 'ACTIVE':
          result = 'Add New Report';
          break;
        case 'DRAFT':
          result = 'Saved Draft';
          break;
        default:
          result = 'Submitted Report';
          break;
      }
      return <Steps.Step title={result} description="" itemdata={data} />;
    }
    return result;
  };

  const renderFlow = data => {
    return (
      <Steps
        className={[styles.stepsNavi, styles[getNameStatusByKey(data.status)]].join(' ')}
        size="small"
        progressDot={customDot}
        current={data.status === 'ACTIVE' || data.status === 'DRAFT' ? -1 : data.approvalStep}
      >
        {renderFirstPointStep(data)}
        {renderSteps(data)}
      </Steps>
    );
  };

  return <Row className={styles.approvalFlow}>{renderFlow(approvalFlow)}</Row>;
};

export default approvalFlowNew;
