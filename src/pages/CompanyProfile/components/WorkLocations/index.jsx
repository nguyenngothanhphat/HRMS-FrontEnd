/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Form, Divider, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormWorkLocation from './components/FormWorkLocation';
import s from './index.less';

const dummyListCountry = [
  { _id: '12345', name: 'Country 1', states: ['State 1', 'State 2'] },
  { _id: '45678', name: 'Country 2', states: ['State 3', 'State 4'] },
];

export default class WorkLocations extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  onFinish = (values) => {
    const { address, country, state, zipCode, workLocations = [] } = values;
    const payload = { headquarter: { address, country, state, zipCode }, workLocations };
    console.log('payload works location:', payload);
  };

  render() {
    return (
      <Form ref={this.formRef} onFinish={this.onFinish}>
        <div className={s.root}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Work Locations</p>
            <p className={s.text}>
              This information is used to assign the employees to the right office. We will also
              enable you to assign office specific administrators, filter employees per work
              location, view Business Intelligence reports, and more. You do not need to add the
              address of your remote employees here.
            </p>
          </div>
          <div className={s.content__viewBottom}>
            <FormWorkLocation
              title="Headquarter"
              listCountry={dummyListCountry}
              formRef={this.formRef}
            />
            <Divider className={s.divider} />
            <Form.List name="workLocations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <>
                      <FormWorkLocation
                        {...field}
                        key={field.name}
                        formRef={this.formRef}
                        listCountry={dummyListCountry}
                      />
                    </>
                  ))}
                  <div className={s.viewAddWorkLocation}>
                    <p className={s.viewAddWorkLocation__icon} onClick={() => add()}>
                      <PlusOutlined />
                    </p>
                    <p className={s.viewAddWorkLocation__text}>Add work location</p>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>
        <div className={s.viewBtn}>
          <Button className={s.btnSubmit} htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    );
  }
}
