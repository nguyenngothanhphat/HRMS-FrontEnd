import React, { Component } from 'react';
import { connect } from 'umi';
import { Checkbox } from 'antd';

import styles from './index.less';

@connect(({ employeeSetting }) => ({ employeeSetting }))
class Option extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // checked: true,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('option' in props) {
      return { option: props.option || {} };
    }
    return null;
  }

  handleChange = (e, id) => {
    const { dispatch, employeeSetting } = this.props;
    const { optionalQuestions = [] } = employeeSetting;
    const value = e.nativeEvent.target.checked;

    const newOptionalQuestions = [...optionalQuestions];
    const index = newOptionalQuestions.findIndex((item) => item._id === id);
    newOptionalQuestions[index].isChosen = value;
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        optionalQuestions: newOptionalQuestions,
      },
    });
    // dispatch({
    //   type: 'employeeSetting/updateOptionalQuestions',
    //   payload: {
    //     id,
    //     isChosen: value,
    //   },
    // });
  };

  render() {
    const { option = {} } = this.props;
    const { isChosen, _id = '', question = '', description = '', link = '' } = option;
    return (
      <div className={styles.Option}>
        <Checkbox.Group defaultValue={isChosen ? _id : ''}>
          <Checkbox
            onChange={(e) => this.handleChange(e, option._id)}
            value={_id}
            style={{
              lineHeight: '32px',
            }}
          >
            {question}
          </Checkbox>
        </Checkbox.Group>
        <div className={styles.Option_description}>
          {link === '' ? description : <a href={link}>{description}</a>}
        </div>
      </div>
    );
  }
}

export default Option;
