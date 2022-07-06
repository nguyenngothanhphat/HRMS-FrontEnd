import { Button, Card, Divider, Form, Input, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import addSymbol from '@/assets/dashboard/blueAdd.svg';
import deleteSymbol from '@/assets/deleteMailExist.svg';
import errorFile from '@/assets/errorFile.svg';
import CommonModal from '@/components/CommonModal';
import s from './index.less';

const Domain = (props) => {
  const [form] = Form.useForm();

  const { dispatch, loadingSave, emailDomain, hasData = false, listDomain, loadingData } = props;
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState();
  const [footer, setFooter] = useState(false);
  const [handlingIndex, setHandlingIndex] = useState(null);

  useEffect(() => {
    // dispatch({
    //   type: 'adminSetting/getDomain',
    // });
    dispatch({
      type: 'adminSetting/fetchListDomain',
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      domain: listDomain,
    });
  }, [listDomain]);

  const onFinish = (values) => {
    const formatData = values.domain.map((i) => {
      return i._id
        ? { _id: i._id, name: i.name, isPrimary: !!i.isPrimary }
        : { name: i.name, isPrimary: !!i.isPrimary };
    });

    // dispatch({
    //   type: 'adminSetting/saveDomain',
    //   payload: {
    //     emailDomain: values.emailDomain,
    //   },
    // });
    dispatch({
      type: 'adminSetting/updateListDomain',
      payload: formatData,
    });
  };

  // const renderUsedDomaincontent = (
  //   <div className={s.modalContent}>
  //     <img src={errorFile} alt="error icon" />
  //     <div className={s.title}>This domain is used</div>
  //     <div className={s.description}>
  //       Please delete all records related to this domain and try again!
  //     </div>
  //   </div>
  // );

  const renderFreeDomaincontent = (
    <div className={s.modalContent}>
      <img src={errorFile} alt="error icon" />
      <div className={s.title}>Are you sure you want to delete the domain?</div>
    </div>
  );

  const onRemoveItem = async (index) => {
    const id = listDomain[index]?._id;
    const values = form.getFieldsValue();
    const tempDomain = values.domain || [];
    if (id) {
      const response = await dispatch({
        type: 'adminSetting/removeListDomain',
        payload: { id },
      });
      const { statusCode = 0 } = response;
      if (statusCode === 200) {
        tempDomain.splice(index, 1);
        form.setFieldsValue({
          domain: tempDomain,
        });
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
          {/* <Form.Item label="Domain Name 1" name="emailDomain">
            <Input className={s.inpDomain} placeholder="Set domain" />
          </Form.Item> */}
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
                              // if (hasData) {
                              //   setContent(renderUsedDomaincontent);
                              // } else {
                              setFooter(true);
                              setContent(renderFreeDomaincontent);
                              setHandlingIndex(i);
                              // }
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
        loading={loadingData}
        hasFooter={footer}
        withPadding
        width={400}
      />
    </Card>
  );
};
export default connect(
  ({ loading, adminSetting: { originData: { emailDomain = '', listDomain = [] } = {} } = {} }) => ({
    loadingSave: loading.effects['adminSetting/updateListDomain'],
    loadingData: loading.effects['adminSetting/fetchListDomain'],
    loadingRemove: loading.effects['adminSetting/removeListDomain'],
    emailDomain,
    listDomain,
  }),
)(Domain);
