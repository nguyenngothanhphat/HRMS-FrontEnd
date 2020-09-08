import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import BasicInformation from './components/BasicInformation/index';
import styles from './index.less';

export default class FormTeamMember extends PureComponent {
  // componentDidMount() {
  // const {
  //   match: { params: { action = '', reId = '' } = {} },
  // } = this.props;
  // check action is add or review. If isReview fetch candidate by reID
  // }

  render() {
    const {
      match: { params: { action = '', reId = '' } = {} },
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.containerFormTeamMember}>
          {action} team member {action === 'review' && reId}
          <br />
          <BasicInformation />
        </div>
      </PageContainer>
    );
  }
}
