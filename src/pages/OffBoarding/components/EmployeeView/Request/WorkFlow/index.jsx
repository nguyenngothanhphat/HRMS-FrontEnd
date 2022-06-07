// import React, { Component, Fragment } from 'react';
// import icon1 from '@/assets/exclamation.svg';
// import icon2 from '@/assets/check-true.svg';
// import styles from './index.less';

// export class Step3 extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   // eslint-disable-next-line consistent-return
//   _renderScreen = (name) => {
//     switch (name) {
//       case 'Success':
//         return <img src={icon2} alt="" className={styles.iconStyles} />;
//       case 'done':
//         return <img src={icon1} alt="" className={styles.iconStyles} />;
//       default:
//     }
//   };

//   renderNode = (item, index, arr) => {
//     return (
//       <Fragment key={item.id}>
//         <div className={styles.minWidth}>
//           <div className={!item.noteStep ? styles.borderImage : styles.borderSuccess}>
//             {item.body}
//             {this._renderScreen(item.status)}
//           </div>
//           <div style={{ maxWidth: '40px' }}>{item.text}</div>
//         </div>
//         {index !== arr.length - 1 && <div className={styles.borderStyles} />}
//       </Fragment>
//     );
//   };

//   render() {
//     const { approvalStep, nameManager, avatarManager = '' } = this.props;
//     const arr1 = [
//       {
//         id: 1,
//         noteStep: approvalStep > 0,
//         status: approvalStep > 0 ? 'Success' : 'done',
//         text: nameManager,
//         avatar: avatarManager,
//       },
//       {
//         id: 1,
//         noteStep: approvalStep > 1,
//         status: approvalStep > 1 ? 'Success' : 'done',
//         text: 'HR Manager',
//       },
//     ];

//     return (
//       <div className={styles.root}>
//         <p className={styles.title}>Chain of approval</p>
//         <div className={styles.flex}>
//           {arr1.map((item, index) => this.renderNode(item, index, arr1))}
//         </div>
//       </div>
//     );
//   }
// }

// export default Step3;

import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { Steps } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import styles from './index.less';

const { Step } = Steps;
class Step3 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // customDot = (dot, { status, index }) => {
  //   console.log('status', status);
  //   return this.renderIcon('https://cdn.iconscout.com/icon/free/png-256/avatar-367-456319.png');
  // };

  renderIcon = (url, approvalStep, index) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url}
          alt="avatar"
        />
        {approvalStep >= index && <CheckCircleFilled twoToneColor="#fd4546" />}
      </div>
    );
  };

  render() {
    const {
      approvalStep,
      nameManager,
      avatarManager = '',
      hrManager: {
        employee: {
          generalInfo: { firstName: nameHrManager = '', avatar: avatarHrManager = '' } = {},
        } = {},
      } = {},
      assigneeHR = {},
      assigneeHR: { generalInfo: { firstName: nameHr = '', avatar: avatarHr = '' } = {} } = {},
    } = this.props;

    return (
      <div className={styles.Step3}>
        <div className={styles.content}>
          <span className={styles.title}>Chain of approval</span>
          <Steps current={approvalStep} labelPlacement="vertical">
            <Step icon={this.renderIcon(avatarManager, approvalStep, 1)} title={nameManager} />
            {!isEmpty(assigneeHR) ? (
              <Step icon={this.renderIcon(avatarHr, approvalStep, 2)} title={nameHr} />
            ) : (
              <Step
                icon={this.renderIcon(avatarHrManager, approvalStep, 2)}
                title={nameHrManager}
              />
            )}
          </Steps>
        </div>
      </div>
    );
  }
}

export default Step3;
