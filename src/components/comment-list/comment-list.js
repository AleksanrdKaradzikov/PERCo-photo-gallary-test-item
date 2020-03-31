import React from 'react';
import { Comment, List } from 'antd';

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'Комментария' : 'Комментарий'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

export default CommentList;
