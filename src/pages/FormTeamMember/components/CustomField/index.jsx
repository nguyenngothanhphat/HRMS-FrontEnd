import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';

import { Row, Col, Typography, Select, Input } from 'antd';
import NoteComponent from '../NoteComponent';
import StepsComponent from '../StepsComponent';

import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const CustomField = (props) => {
  const { dispatch, customField = {}, checkMandatory = {} } = props;

  const {
    dental: dentalProp,
    vision: visionProp,
    medical: medicalProp,
    additionalInfo: additionalInfoProp,
  } = customField;

  const [dental, setDental] = useState(dentalProp || 'tier1');
  const [vision, setVision] = useState(visionProp || 'tier1');
  const [medical, setMedical] = useState(medicalProp || 'tier1');
  const [text, setText] = useState(additionalInfoProp || '');

  useEffect(() => {
    const allFilled = dental !== '' && vision !== '' && medical !== '';

    if (dispatch) {
      dispatch({
        type: 'info/save',
        payload: {
          customField: {
            ...customField,
            dental,
            vision,
            medical,
            additionalInfo: text,
          },
          checkMandatory: {
            ...checkMandatory,
            filledCustomField: allFilled,
          },
        },
      });
    }
  }, [dental, vision, medical, text]);

  const Note = {
    title: 'Note',
    data: (
      <Typography.Text>
        Onboarding is a step-by-step process. It takes anywhere around <span>9-12 standard</span>{' '}
        working days for entire process to complete
      </Typography.Text>
    ),
  };

  const handleDentalChange = (value) => {
    setDental(value);
  };

  const handleVisionChange = (value) => {
    setVision(value);
  };

  const handleMedicalChange = (value) => {
    setMedical(value);
  };

  const handleTextChange = ({ target: { value } }) => {
    setText(value);
  };

  return (
    <div className={styles.customFieldContainer}>
      <Row
        //    gutter={24}
        gutter={[24, 0]}
      >
        <Col xs={24} sm={24} md={24} lg={16} xl={16} className={styles.leftWrapper}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h3>{formatMessage({ id: 'component.customField.title' })}</h3>

              <p>{formatMessage({ id: 'component.customField.subTitle' })}</p>
            </div>

            <div className={styles.body}>
              <Row className={styles.row} gutter={48}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <p className={styles.label}>
                    {formatMessage({ id: 'component.customField.dentalLabel' })}
                  </p>

                  <Select name="dental" value={dental} onChange={handleDentalChange}>
                    <Option value="tier1">[ 2020 ] Voluntary Dental</Option>
                    <Option value="tier2">Dental Tier 2</Option>
                  </Select>
                </Col>
              </Row>

              <Row className={styles.row} gutter={48}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <p className={styles.label}>
                    {formatMessage({ id: 'component.customField.visionLabel' })}
                  </p>

                  <Select value={vision} onChange={handleVisionChange}>
                    <Option value="tier1">[ 2020 ] Voluntary Vision</Option>
                    <Option value="tier2">Vision Tier 2</Option>
                  </Select>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <p className={styles.label}>
                    {formatMessage({ id: 'component.customField.medicalLabel' })}
                  </p>

                  <Select value={medical} onChange={handleMedicalChange}>
                    <Option value="tier1">[ 2020 ] Voluntary Medical</Option>
                    <Option value="tier2">Medical Tier 2</Option>
                  </Select>
                </Col>
              </Row>

              <Row className={styles.row} gutter={48}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <p className={styles.label}>
                    {formatMessage({ id: 'component.customField.additionalLabel' })}
                  </p>

                  <TextArea
                    className={styles.additional}
                    value={text}
                    onChange={handleTextChange}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    allowClear
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <NoteComponent note={Note} />
            </Row>
            <Row style={{ width: '322px' }}>
              <StepsComponent />
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ info: { customField = {}, checkMandatory = {} } = {} }) => ({
  customField,
  checkMandatory,
}))(CustomField);
