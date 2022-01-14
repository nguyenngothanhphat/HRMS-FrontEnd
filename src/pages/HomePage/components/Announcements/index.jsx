import React from 'react';
import { Col, Row } from 'antd';
import EmployeeTag from './components/EmployeeTag';
import PostContent from './components/PostContent';
import styles from './index.less';
// import Post1 from '@/assets/homePage/post1.png';
// import Post2 from '@/assets/homePage/post2.png';
import EmbedPost from './components/EmbedPost';
import TerralogicIcon from '@/assets/homePage/terralogicIcon.jpeg';
import TerralogicImage from '@/assets/homePage/terralogicImage.jpeg';

const Announcements = () => {
  const posts = [
    // {
    //   id: 1,
    //   embedLink: 'https://www.linkedin.com/embed/feed/update/urn:li:share:6886637186213576704',
    // },
    {
      id: 1,
      employee: {
        generalInfo: {
          legalName: 'Terralogic Inc.',
          avatar: TerralogicIcon,
          website: 'https://www.linkedin.com/company/terralogic/',
        },
        title: {
          name: '19,404 followers',
        },
      },
      content: (
        <p>
          We are overwhelmed with the responses we got to attend the launch of TL Nellore. Thank you
          so much for this.
          <br />
          Registrations for the event are now closed. But stay tuned and keep watching this space
          for more updates.!
          <br />
          <a>#nellore</a> <a>#engineering</a> <a>#it</a> <a>#terralogic</a> <a>#thankyou</a>
        </p>
      ),
      type: 2, // 1: link, 2: image
      image: TerralogicImage,
    },
    // {
    //   id: 2,
    //   employee: {
    //     generalInfo: {
    //       legalName: 'Ronald Richards',
    //     },
    //     title: {
    //       name: 'Head of Design',
    //     },
    //   },
    //   content: (
    //     <div>
    //       <p>Great!</p>
    //       <br />
    //       <iframe
    //         src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6885572592187650048"
    //         frameBorder="0"
    //         allowFullScreen=""
    //         title="Embedded post"
    //         width="100%"
    //         height={500}
    //       />
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className={styles.Announcements}>
      <p className={styles.title}>Announcements</p>

      <Row gutter={[24, 24]}>
        {posts.map((x) => (
          <Col span={24}>
            {x.embedLink ? (
              <EmbedPost embedLink={x.embedLink} />
            ) : (
              <div className={styles.card}>
                <EmployeeTag employee={x.employee} />
                <PostContent post={x} />
              </div>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Announcements;
