import React, { Component } from 'react';
import StepsComponent from '../StepsComponent';
import NoteComponent from '../NoteComponent';
import { Row } from 'antd';
import styles from './index.less';
const RightSideComponent = (props) => {
  const { Note, Steps } = props;
  return (
    <div className={styles.RightSideComponent}>
      <Row>
        <NoteComponent Note={Note} />
      </Row>
      <Row>
        <StepsComponent Steps={Steps} />
      </Row>
    </div>
  );
};

export default RightSideComponent;
