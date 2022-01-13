import React from 'react';
import { Col, Row } from 'antd';
import EmployeeTag from './components/EmployeeTag';
import PostContent from './components/PostContent';
import styles from './index.less';
// import Post1 from '@/assets/homePage/post1.png';
// import Post2 from '@/assets/homePage/post2.png';
import EmbedPost from './components/EmbedPost';

const Announcements = () => {
  const posts = [
    {
      id: 1,
      embedLink: 'https://www.linkedin.com/embed/feed/update/urn:li:share:6886637186213576704',
    },
    // {
    //   id: 1,
    //   employee: {
    //     generalInfo: {
    //       legalName: 'Leslie Alexander',
    //     },
    //     title: {
    //       name: 'Head of Design',
    //     },
    //   },
    //   content: (
    //     <p>
    //       We&apos;re #hiring at Lollypop Design Studio <br />
    //       If you&apos;ve got 5+ years of delivering awesome user experiences and have what it takes to
    //       work with a 24x7 motivated and passionate team - we&apos;re looking for you!
    //     </p>
    //   ),
    //   type: 1, // 1: link, 2: image
    //   link: 'https://google.com',
    // },
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
