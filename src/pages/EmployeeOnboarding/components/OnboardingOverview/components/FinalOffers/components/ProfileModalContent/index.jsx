import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { getCurrentTenant } from '@/utils/authority';
import img1 from './images/modal_img_1.png';
import img2 from './images/img_2.png';

import s from './index.less';
// import './index.less';

const { Item } = Form;

const ProfileModalContent = (props) => {
  const { closeModal, rookieId, dispatch } = props;

  const [validate, setValidate] = useState(false);
  const [form] = Form.useForm();

  const onValuesChange = (values) => {
    const { employeeId = '' } = values;
    if (employeeId.length > 0) {
      setValidate(true);
    } else {
      setValidate(false);
    }
  };

  const handleOnClick = async () => {
    const values = form.getFieldsValue();
    const { employeeId = '' } = values;
    const rookieIdValue = rookieId.replace(/^#+/i, '');
    const response = await dispatch({
      type: 'onboard/createProfileEffect',
      payload: {
        rookieID: rookieIdValue,
        employeeId,
        tenantId: getCurrentTenant(),
      },
    });
    const { statusCode = 1 } = response;
    if (statusCode !== 200) {
      return;
    }
    closeModal();
    dispatch({
      type: 'onboard/redirectToReview',
      payload: {
        id: rookieIdValue,
      },
    });
  };

  return (
    <div className={s.modalContent}>
      <div className={s.contentContainer}>
        <Form form={form} onValuesChange={onValuesChange}>
          <Item name="employeeId" label="Employee ID">
            <Input />
          </Item>

          <Item>
            <Button onClick={() => handleOnClick()} disabled={!validate} className={s.btn}>
              Finish
            </Button>
          </Item>
        </Form>
      </div>
    </div>
  );
};

export default ProfileModalContent;
