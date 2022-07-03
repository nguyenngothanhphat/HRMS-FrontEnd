import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Divider } from 'antd';
import { connect } from 'umi';
import s from './index.less';
import addSymbol from '@/assets/dashboard/blueAdd.svg';
import deleteSymbol from '@/assets/deleteMailExist.svg';
import errorFile from '@/assets/errorFile.svg';
import CommonModal from '@/components/CommonModal';

const Domain = (props) => {
  const [form] = Form.useForm();

  const { dispatch, loadingSave, emailDomain, hasData = false, listDomain } = props;
  const [visible, setVisible] = useState(false);
  const [clear, setClear] = useState(false);
  const [content, setContent] = useState();
  const [footer, setFooter] = useState(false);
  const [handlingIndex, setHandlingIndex] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'adminSetting/getDomain',
    });
    dispatch({
      type: 'adminSetting/fetchListDomain',
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({ emailDomain, domain: listDomain });
  }, [emailDomain, listDomain]);

  const onFinish = (values) => {
    console.log(values.domain);
    // dispatch({
    //   type: 'adminSetting/saveDomain',
    //   payload: {
    //     emailDomain: values.emailDomain,
    //   },
    // });
    dispatch({
      type: 'adminSetting/addListDomain',
      payload: values.domain,
    });
  };

  const renderUsedDomaincontent = (
    <div className={s.modalContent}>
      <img src={errorFile} alt="error icon" />
      <div className={s.title}>This domain is used</div>
      <div className={s.description}>
        Please delete all records related to this domain and try again!
      </div>
    </div>
  );

  const renderFreeDomaincontent = (
    <div className={s.modalContent}>
      <img src={errorFile} alt="error icon" />
      <div className={s.title}>Are you sure you want to delete the domain?</div>
    </div>
  );

  const onRemoveItem = (index) => {
    const values = form.getFieldsValue();
    const tempDomain = values.domain || {};
    tempDomain.splice(index, 1);
    form.setFieldsValue({
      domain: tempDomain,
    });
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
          <Form.Item label="Domain Name 1" name="emailDomain">
            <Input className={s.inpDomain} placeholder="Set domain" />
          </Form.Item>
          <Form.List name="domain">
            {(fields, { add }) => (
              <>
                {fields.map(({ key, name, ...restField }, i) => (
                  <Form.Item
                    {...restField}
                    label={
                      <div>
                        <>Domain Name {i + 2} </>{' '}
                        <img
                          src={deleteSymbol}
                          alt="delete icon"
                          onClick={() => {
                            setVisible(true);
                            if (hasData) {
                              setContent(renderUsedDomaincontent);
                            } else {
                              setFooter(true);
                              setContent(renderFreeDomaincontent);
                              setHandlingIndex(i);
                            }
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
          setClear(true);
          setVisible(false);
          onRemoveItem(handlingIndex);
        }}
        hasFooter={footer}
        withPadding
        width={400}
      />
    </Card>
  );
};
export default connect(
  ({ loading, adminSetting: { originData: { emailDomain = '', listDomain = [] } = {} } = {} }) => ({
    loadingSave: loading.effects['adminSetting/saveDomain'],
    loadingData: loading.effects['adminSetting/getDomain'],
    emailDomain,
    listDomain,
  }),
)(Domain);
