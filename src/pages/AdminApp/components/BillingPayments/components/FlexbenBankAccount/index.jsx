import { Col, Form, Input, Row } from 'antd';
import React, { PureComponent } from 'react';
import { PlusOutlined } from '@ant-design/icons';
// import NewField from './components/NewField';
import deleteIcon from '@/assets/deleteIcon-Administator.svg';
import s from './index.less';

export default class index extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.container__header}>
            <p className={s.container__header__title}>FLexben Bank Account</p>
          </div>
          <div className={s.container__body}>
            {/* <Form> */}
            <Form.List name="newFields">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey }) => (
                    // <NewField field={field} key={field.name} />
                    <Form.Item
                      //   field={field}
                      key={key}
                      name={[name, 'bankName']}
                      fieldKey={[fieldKey, 'bankName']}
                    >
                      <Row>
                        <Col span={8}>
                          <p>Bank Name</p>
                        </Col>
                        <Col span={15}>
                          <Input placeholder="Enter bank name" />
                        </Col>
                        <Col span={1}>
                          <div
                            className={s.viewRemoveNewField}
                            onClick={() => {
                              remove(name);
                            }}
                          >
                            <p className={s.viewRemoveNewField__icon}>
                              <img src={deleteIcon} alt="delete" />
                            </p>
                            {/* <p className={s.viewRemoveNewField__text}>Delete</p> */}
                          </div>
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  <div className={s.actions}>
                    <div
                      className={s.viewAddNewField}
                      onClick={() => {
                        add();
                      }}
                    >
                      <p className={s.viewAddNewField__icon}>
                        <PlusOutlined />
                      </p>
                      <p className={s.viewAddNewField__text}>Add more information</p>
                    </div>
                    {/* {fields.length > 0 && (
                      <div
                        className={s.viewRemoveNewField}
                        onClick={() => {
                          remove(fields.length - 1);
                        }}
                      >
                        <p className={s.viewRemoveNewField__icon}>
                          <DeleteOutlined />
                        </p>
                        <p className={s.viewRemoveNewField__text}>Delete</p>
                      </div>
                    )} */}
                  </div>
                </>
              )}
            </Form.List>
            {/* </Form> */}
          </div>
        </div>
      </div>
    );
  }
}
