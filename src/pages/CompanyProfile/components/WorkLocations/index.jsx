/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Form, Divider, Button, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import FormWorkLocation from './components/FormWorkLocation';
import s from './index.less';

@connect(
  ({
    loading,
    country: { listCountry = [] } = {},
    user: { currentUser = {} } = {},
    companiesManagement: { locationsList: workLocations = [] } = {},
  }) => ({
    listCountry,
    currentUser,
    workLocations,
    loading: loading.effects['companiesManagement/upsertLocationsList'],
    fetchingLocationsList: loading.effects['companiesManagement/fetchLocationsList'],
    loadingCountry: loading.effects['country/fetchListCountry'],
  }),
)
class WorkLocations extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  onFinish = ({ workLocations: locations = [] }) => {
    const { dispatch, currentUser: { company: { _id } = {} } = {} } = this.props;
    const payload = { locations, company: _id };
    dispatch({
      type: 'companiesManagement/upsertLocationsList',
      payload,
    });
  };

  formatListLocation = () => {
    const { workLocations = [] } = this.props;
    const formatData = workLocations.map((item) => {
      const { country: { _id: country } = {} } = item;
      return { ...item, country };
    });
    const listLocation = formatData.sort((item, nextItem) => {
      return moment.utc(item.createdAt).diff(moment.utc(nextItem.createdAt));
    });
    return listLocation;
  };

  removeLocation = (id) => {
    const { currentUser: { company: { _id } = {} } = {} } = this.props;
    // const payload = { id, company: _id };
    // dispatch({
    //   type: 'departmentManagement/removeDepartment',
    //   payload,
    // });
    console.log('remove location', { id, company: _id });
  };

  render() {
    const {
      listCountry = [],
      workLocations = [],
      loading,
      fetchingLocationsList,
      loadingCountry,
    } = this.props;
    const listLocation = this.formatListLocation();
    if (fetchingLocationsList || loadingCountry)
      return (
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
            {workLocations.map((item) => (
              <div className={s.viewSkeleton} key={item?._id}>
                <Skeleton active />
              </div>
            ))}
          </div>
        </div>
      );

    return (
      <Form
        ref={this.formRef}
        onFinish={this.onFinish}
        autoComplete="off"
        initialValues={{ workLocations: listLocation }}
      >
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
            <Form.List name="workLocations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <FormWorkLocation
                      field={field}
                      key={field.name}
                      formRef={this.formRef}
                      listCountry={listCountry}
                      listLocation={listLocation}
                      removeLocation={this.removeLocation}
                      onRemove={() => remove(field.name)}
                    />
                  ))}
                  <div className={s.viewAddWorkLocation} onClick={() => add()}>
                    <p className={s.viewAddWorkLocation__icon}>
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
          <Button className={s.btnSubmit} htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default WorkLocations;
