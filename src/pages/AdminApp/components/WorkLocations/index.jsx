import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, notification, Skeleton, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import LocationContent from './components/LocationContent';
import FormWorkLocation from './components/FormWorkLocation';
import s from './index.less';

const WorkLocations = (props) => {
  const [form] = Form.useForm();
  const {
    listCountry = [],
    locationsList = [],
    fetchingLocationsList,
    loadingCountry,
    loadingAddMultiLocation = false,
  } = props;
  const { workLocations = [] } = props;
  const { dispatch } = props;
  const tenantId = getCurrentTenant();
  const companyId = getCurrentCompany();

  const [isFillingIn, setIsFillingIn] = React.useState(false);

  useEffect(() => {
    if (companyId) {
      dispatch({
        type: 'adminApp/fetchLocationList',
        payload: { company: companyId, tenantId },
      });
    }
    return () => {
      dispatch({
        type: 'companiesManagement/save',
        payload: { locationsList: [] },
      });
    };
  }, []);

  const addLocationAPI = async (values) => {
    // const { company, isNewTenant, locations: originLocations = [] } = companyDetails;
    // const listLocation = [...originLocations, ...locations];
    const formatListLocation = (values.workLocations || []).map((location) => {
      const {
        name = '',
        addressLine1 = '',
        addressLine2 = '',
        city = '',
        country = '',
        state = '',
        zipCode = '',
        timezone = '',
      } = location;
      return {
        name,
        headQuarterAddress: {
          addressLine1,
          addressLine2,
          city,
          country,
          state,
          zipCode,
        },
        legalAddress: {
          addressLine1,
          addressLine2,
          city,
          country,
          state,
          zipCode,
        },
        isHeadQuarter: false,
        timezone,
      };
    });

    const payload = {
      locations: formatListLocation,
      company: companyId,
      tenantId,
    };

    const res = await dispatch({
      type: 'companiesManagement/addMultiLocation',
      payload,
    });
    const { statusCode } = res;
    if (statusCode === 200) {
      form.resetFields();
      notification.success({
        message: 'Add new locations successfully.',
      });
      // refresh work locations list
      dispatch({
        type: 'adminApp/fetchLocationList',
        payload: { company: companyId, tenantId },
      });
      // refresh locations in dropdown menu (owner)
      dispatch({
        type: 'location/fetchLocationsByCompany',
      });
    }
  };

  const formatListLocation = () => {
    const formatData = workLocations.map((item) => {
      const { country: { _id: country } = {} } = item;
      return { ...item, country };
    });
    const listLocation = formatData.sort((item, nextItem) => {
      return moment.utc(item.createdAt).diff(moment.utc(nextItem.createdAt));
    });
    return listLocation;
  };

  const removeLocation = async (id) => {
    const payload = { id, tenantId };
    const res = await dispatch({
      type: 'adminApp/removeLocation',
      payload,
    });
    const { statusCode } = res;
    if (statusCode === 200) {
      dispatch({
        type: 'adminApp/fetchLocationList',
        payload: { company: companyId, tenantId },
      });
      dispatch({
        type: 'location/fetchLocationsByCompany',
      });
    }
  };

  const formatCurrentLocationList = (arr = []) => {
    let list = arr.map((location) => {
      const {
        _id = '',
        name = '',
        headQuarterAddress: {
          addressLine1 = '',
          addressLine2 = '',
          city = '',
          country: { _id: countryId = '' },
          state = '',
          zipCode = '',
        } = {},
        isHeadQuarter = false,
        timezone = '',
      } = location;
      return {
        _id,
        name,
        addressLine1,
        addressLine2,
        city,
        country: countryId,
        state,
        zipCode,
        isHeadQuarter,
        timezone,
      };
    });

    // these lines to move the headquarter to top of array
    const headQuarter = list.find((item) => item.isHeadQuarter);
    if (headQuarter) {
      list = list.filter((item) => !item.isHeadQuarter);
      list.unshift(headQuarter);
    }
    return list;
  };

  const trackingEditButton = (value) => {
    setIsFillingIn(value);
  };

  const listLocation = formatListLocation();

  const formatCurrentLocationsList = formatCurrentLocationList(locationsList);

  return (
    <div className={s.WorkLocations}>
      <div className={s.root}>
        <div className={s.content__viewTop}>
          <p className={s.title}>Work Locations</p>
          <p className={s.text}>
            This information is used to assign the employees to the right office. We will also
            enable you to assign office specific administrators, filter employees per work location,
            view Business Intelligence reports, and more. You do not need to add the address of your
            remote employees here.
          </p>
        </div>
        <div className={s.content__viewBottom}>
          <Spin spinning={fetchingLocationsList || loadingCountry}>
            {formatCurrentLocationsList.map((location, index) => {
              return (
                <LocationContent
                  isRequired={false}
                  defaultCountry={location?.country}
                  listCountry={listCountry}
                  listLocation={listLocation}
                  locationInfo={location}
                  trackingEditButton={trackingEditButton}
                  removeLocation={removeLocation}
                  listLength={formatCurrentLocationsList.length}
                  index={index}
                />
              );
            })}
          </Spin>
        </div>
      </div>

      <Form
        form={form}
        onFinish={addLocationAPI}
        autoComplete="off"
        initialValues={
          {
            // workLocations: defaultListLocation,
          }
        }
      >
        <div className={s.root} style={{ marginTop: '24px' }}>
          <div className={s.content__viewBottom}>
            <Form.List name="workLocations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <FormWorkLocation
                      field={field}
                      key={field.name}
                      isHidden={false}
                      name="New work location"
                      form={form}
                      listCountry={listCountry}
                      listLocation={listLocation}
                      removeLocation={removeLocation}
                      onRemove={() => {
                        remove(field.name);
                      }}
                    />
                  ))}
                  <div className={s.actions}>
                    <Button
                      disabled={isFillingIn}
                      className={s.viewAddWorkLocation}
                      icon={
                        <p className={s.viewAddWorkLocation__icon}>
                          <PlusOutlined />
                        </p>
                      }
                      onClick={() => {
                        add();
                      }}
                    >
                      <p className={s.viewAddWorkLocation__text}>Add work location</p>
                    </Button>
                    {fields.length !== 0 && (
                      <div className={s.viewBtn}>
                        <Button
                          loading={loadingAddMultiLocation}
                          className={s.btnSubmit}
                          htmlType="submit"
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({
    loading,
    country: { listCountry = [] } = {},
    companiesManagement: { originData: { companyDetails = {} } = {} } = {},
    adminApp: { locationsList = [] },
    user: { currentUser: { manageTenant = [] } = {} } = {},
  }) => ({
    listCountry,
    locationsList,
    fetchingLocationsList: loading.effects['adminApp/fetchLocationList'],
    loadingCountry: loading.effects['country/fetchListCountry'],
    loadingAddMultiLocation: loading.effects['companiesManagement/addMultiLocation'],
    companyDetails,
    manageTenant,
  }),
)(WorkLocations);
