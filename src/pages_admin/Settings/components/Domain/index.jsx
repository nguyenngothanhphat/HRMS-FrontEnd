import { Button, Card, Divider, Form, Input, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ErrorFile from '@/assets/adminSetting/errorFile.svg';
import WarningFile from '@/assets/adminSetting/warningFile.svg';
import addSymbol from '@/assets/dashboard/blueAdd.svg';
import deleteSymbol from '@/assets/deleteMailExist.svg';
import CommonModal from '@/components/CommonModal';
import s from './index.less';

const Domain = (props) => {
  const [form] = Form.useForm();

  const { dispatch, loadingSave = false, listDomain = [], loadingRemove = false } = props;
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState();
  const [footer, setFooter] = useState(false);
  const [handlingIndex, setHandlingIndex] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'adminSetting/fetchListDomain',
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      domain: listDomain,
    });
  }, [listDomain]);

  const renderUsedDomaincontent = (data) => {
    const { id, defaultMessage } = data[0];
    if (id === 'domaintenant.exists.item')
      return (
        <div className={s.modalContent}>
          <img src={ErrorFile} alt="error icon" />
          <div className={s.title}>This domain is in use</div>
          <div className={s.description}>
            Please delete all records related to this domain and try again!
          </div>
        </div>
      );
    return (
      <div className={s.modalContent}>
        <img src={ErrorFile} alt="error icon" />
        <div className={s.title}>{defaultMessage}</div>
      </div>
    );
  };

  const renderFreeDomaincontent = (
    <div className={s.modalContent}>
      <img src={ErrorFile} alt="error icon" />
      <div className={s.title}>Are you sure you want to delete the domain?</div>
    </div>
  );

  const renderPrimaryDomaincontent = (data) => {
    const { id, defaultMessage } = data[0];
    if (id === 'domaintenant.more.primary.item')
      return (
        <div className={s.modalContent}>
          <img src={WarningFile} alt="warning icon" />
          <div className={s.title}>Must to have one Primary Domain</div>
          <div className={s.description}>
            You can not disable primary for all domains, please set the other domain as primary.
          </div>
        </div>
      );
    return (
      <div className={s.modalContent}>
        <img src={WarningFile} alt="warning icon" />
        <div className={s.title}>{defaultMessage}</div>
      </div>
    );
  };

  const onFinish = async (values) => {
    const formatData = values.domain.map((i) => {
      return i._id
        ? { _id: i._id, name: i.name, isPrimary: !!i.isPrimary }
        : { name: i.name, isPrimary: !!i.isPrimary };
    });

    const response = await dispatch({
      type: 'adminSetting/updateListDomain',
      payload: formatData,
    });
    const { statusCode = 0, data } = response;
    if (statusCode === 400) {
      setVisible(true);
      setContent(renderPrimaryDomaincontent(data));
      setFooter(false);
    }
  };

  const onRemoveItem = async (index) => {
    const id = listDomain[index]?._id;
    const values = form.getFieldsValue();
    const tempDomain = values.domain || [];
    if (id) {
      const response = await dispatch({
        type: 'adminSetting/removeListDomain',
        payload: { id },
      });
      const { statusCode = 0, data } = response;
      if (statusCode === 200) {
        tempDomain.splice(index, 1);
        form.setFieldsValue({
          domain: tempDomain,
        });
      }
      if (statusCode === 400) {
        setVisible(true);
        setContent(renderUsedDomaincontent(data));
        setFooter(false);
      }
    } else {
      tempDomain.splice(index, 1);
      form.setFieldsValue({
        domain: tempDomain,
      });
    }
  };

  return (
    <Card
      className={s.Domain}
      title={
        <div className={s.domainTitleContainer}>
          <p className={s.domainTitle}>Domain</p>
        </div>
      }
    >
      <div className={s.domainContent}>
        <p className={s.contentInside}>
          <span>
            All of the pages in your site will be published to the domain you create here.{' '}
          </span>
          <br />
          <span>Choose a domain name like “example.yourcompany.com”</span>
        </p>
        <Form
          className={s.formSetDomain}
          wrapperCol={{ span: 8 }}
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.List name="domain">
            {(fields, { add }) => (
              <>
                {fields.map(({ key, name, ...restField }, i) => (
                  <>
                    <Form.Item
                      className={s.domainContent}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...restField}
                      label={
                        <div>
                          <>Domain Name {i + 1} </>{' '}
                          <img
                            src={deleteSymbol}
                            alt="delete icon"
                            onClick={() => {
                              setVisible(true);
                              setFooter(true);
                              setContent(renderFreeDomaincontent);
                              setHandlingIndex(i);
                            }}
                            className={s.deleteIcon}
                          />
                        </div>
                      }
                      name={[name, 'name']}
                      key={key}
                    >
                      <Input className={s.inpDomain} placeholder="Set domain" />
                    </Form.Item>
                    <Form.Item
                      className={s.primary}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...restField}
                      name={[name, 'isPrimary']}
                      key={key}
                      label={<span className={s.primaryText}>Primary Domain</span>}
                      wrapperCol={{ span: 1 }}
                      labelCol={{ span: 23 }}
                      valuePropName="checked"
                    >
                      <Switch size="small" />
                    </Form.Item>
                  </>
                ))}
                <Form.Item>
                  <Button
                    type="text"
                    className={s.btnAdd}
                    icon={<img src={addSymbol} alt="add icon" className={s.addIcon} />}
                    onClick={() => add()}
                  >
                    Add a New Domain
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Divider />
          <Button loading={loadingSave} className={s.btnSave} type="primary" htmlType="Submit">
            Save
          </Button>
        </Form>
      </div>
      <CommonModal
        visible={visible}
        firstText="Yes"
        onClose={() => setVisible(false)}
        hasHeader={false}
        content={content}
        onFinish={() => {
          setVisible(false);
          onRemoveItem(handlingIndex);
        }}
        loading={loadingRemove}
        hasFooter={footer}
        withPadding
        width={400}
      />
    </Card>
  );
};
export default connect(
  ({ loading, adminSetting: { originData: { listDomain = [] } = {} } = {} }) => ({
    loadingSave: loading.effects['adminSetting/updateListDomain'],
    loadingData: loading.effects['adminSetting/fetchListDomain'],
    loadingRemove: loading.effects['adminSetting/removeListDomain'],
    listDomain,
  }),
)(Domain);
