import { Menu } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import FAQIcon from '@/assets/dashboard/faq.svg';
import PoliciesIcon from '@/assets/dashboard/policies.svg';
import QuestionIcon from '@/assets/dashboard/question.svg';
import QuickLinkIcon from '@/assets/dashboard/quickLink.svg';
import RaiseTicketIcon from '@/assets/dashboard/raiseTicket.svg';
import HelpCenterIcon from '@/assets/dashboard/helpCenter.svg';
import CommonModal from '@/components/CommonModal';
import QuickLinks from '@/components/QuickLinks';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { isOwner } from '@/utils/authority';
import RaiseTicketModal from '../RaiseTicketModal';

@connect(() => ({}))
class QuestionDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      QUICK_LINKS: 'QUICK_LINKS',
      FAQ: 'FAQ',
      RAISE_TICKET: 'RAISE_TICKET',
      POLICIES_REGULATION: 'POLICIES_REGULATION',
      HELP_CENTER: 'HELP_CENTER',
      quickLinkModalVisible: false,
      raiseTicketModalVisible: false,
    };
  }

  onToggleQuickLinkModal = () => {
    this.setState(({ quickLinkModalVisible }) => ({
      quickLinkModalVisible: !quickLinkModalVisible,
    }));
  };

  onToggleRaiseTicketModal = () => {
    this.setState(({ raiseTicketModalVisible }) => ({
      raiseTicketModalVisible: !raiseTicketModalVisible,
    }));
  };

  onMenuClick = async (event) => {
    const { key } = event;
    const { QUICK_LINKS, FAQ, RAISE_TICKET, POLICIES_REGULATION, HELP_CENTER } = this.state;
    switch (key) {
      case QUICK_LINKS:
        this.onToggleQuickLinkModal();
        break;
      case FAQ:
        history.push('/faqpage');
        break;
      case RAISE_TICKET:
        this.onToggleRaiseTicketModal();
        break;
      case POLICIES_REGULATION:
        history.push('/policies-regulations');
        break;
      case HELP_CENTER:
        history.push('/help-center');
        break;
      default:
        break;
    }
  };

  render() {
    const {
      QUICK_LINKS,
      FAQ,
      RAISE_TICKET,
      POLICIES_REGULATION,
      HELP_CENTER,
      quickLinkModalVisible,
      raiseTicketModalVisible,
    } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key={QUICK_LINKS} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={QuickLinkIcon} alt="" />
            <span>Quick Links</span>
          </div>
        </Menu.Item>
        {/* <Menu.Divider className={styles.secondDivider} /> */}
        {!isOwner() && (
          <Menu.Item key={RAISE_TICKET} className={styles.menuItemLink}>
            <div className={styles.menuItemLink__withIcon}>
              <img src={RaiseTicketIcon} alt="" />
              <span>Raise Ticket</span>
            </div>
          </Menu.Item>
        )}
        {/* <Menu.Divider className={styles.secondDivider} /> */}
        <Menu.Item key={FAQ} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={FAQIcon} alt="" />
            <span>FAQ</span>
          </div>
        </Menu.Item>
        <Menu.Item key={POLICIES_REGULATION} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIconPolici}>
            <img src={PoliciesIcon} alt="PoliciesIcon" />
            <span>Policies & Regulations</span>
          </div>
        </Menu.Item>
        <Menu.Item key={HELP_CENTER} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={HelpCenterIcon} alt="HelpCenterIcon" />
            <span>HRMS Help Center</span>
          </div>
        </Menu.Item>
        {/* <Menu.Divider className={styles.secondDivider} /> */}
      </Menu>
    );
    return (
      <>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <div className={`${styles.action} ${styles.notify}`}>
            <img src={QuestionIcon} alt="" />
          </div>
        </HeaderDropdown>
        <CommonModal
          visible={quickLinkModalVisible}
          title="Quick Links"
          onClose={this.onToggleQuickLinkModal}
          hasFooter={false}
          content={<QuickLinks />}
          withPadding
          width={500}
        />
        {!isOwner() && (
          <RaiseTicketModal
            visible={raiseTicketModalVisible}
            title="Raise Ticket"
            onClose={this.onToggleRaiseTicketModal}
          />
        )}
      </>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(QuestionDropdown);
