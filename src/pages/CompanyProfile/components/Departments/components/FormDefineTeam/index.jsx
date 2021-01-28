/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Form, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import s from './index.less';

class FormDefineTeam extends React.PureComponent {
  render() {
    const { fieldKey } = this.props;
    return (
      <div className={s.root}>
        <Form.List name={[fieldKey, 'team']}>
          {(teams, { add, remove }) => {
            return (
              <>
                {teams.map((team, index2) => (
                  <div className={s.viewRow} key={team.name}>
                    <div className={s.viewRow__input}>
                      <p className={s.title}>Team {index2 + 1}</p>
                      <Form.Item
                        {...team}
                        // name={[team.name, 'team']}
                        fieldKey={[team.fieldKey, 'team']}
                        key={index2}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter name team!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <div
                      className={`${s.action} ${s.actionDeleteTeam}`}
                      onClick={() => {
                        remove(team.name);
                      }}
                    >
                      <DeleteOutlined className={s.action__icon} />
                      <span>Delete</span>
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <div
                    className={s.action}
                    onClick={() => {
                      add();
                    }}
                  >
                    <PlusOutlined className={s.action__icon} />
                    <span>Define Team</span>
                  </div>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </div>
    );
  }
}

export default FormDefineTeam;
