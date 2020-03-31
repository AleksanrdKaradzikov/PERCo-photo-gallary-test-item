import React from 'react';
import { List, Tooltip, Avatar, Modal, Comment, notification, BackTop } from "antd";
import { CommentOutlined, LikeOutlined } from '@ant-design/icons';
import CommentList from '../comment-list';
import Editor from '../editor';
import data from '../../data/data';
import "antd/dist/antd.css";

const dataGallary = [];

//'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'

for (let index = 0; index < data.length; index++) {
    dataGallary.push(
      {
        id: index + 1,
        imgUrl: data[index],
        title: `Фотография ${index + 1}`,
        likesCount: 0,
        likeToggle: false,
        comments: [
          {
            author: 'Максим',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: 'Отличная фотография!',
            datetime: `${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}`,
          }
        ]
      },
    )
}

const openNotificationWithIcon = ({ type, message, description = null }) => {
  notification[type]({
    message,
    description,
  });
};

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataGallary,
      visibleModal: false,
      previeImg: null,
      previeTitle:null,
      currentId: null,
      currentLikesCount: null,
      currentCommentCount: null,
      currentToggleLike: false,
      currentCommnets: [],
      form: {
        name: '',
        content: '',
      },
      submitting: false,
    };
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      form: { ...this.state.form, [name]: value }
    })
  }

  pushCommnet = (itemId, comment) => {
    const { dataGallary } = this.state;
    const index = dataGallary.findIndex(({ id }) => id === itemId);
    const newItem = {...dataGallary[index], comments: [comment, ...dataGallary[index].comments] };
    const newData = [...dataGallary.slice(0, index), newItem, ...dataGallary.slice(index + 1)];
    this.setState({
        dataGallary: newData,
    });
  }

  handleSubmit = () => {
      const { form, currentId } = this.state;
      if (!form.name || form.name.length < 3) {
        const notificationConfig = {
          type: 'error',
          message: 'Имя обязательное поле!',
          description: 'Имя не менее 3 символов!',
        };
        openNotificationWithIcon(notificationConfig);
        return;
      } else if (!form.content || form.content.length < 5) {
        const notificationConfig = {
          type: 'error',
          message: 'Комментарий обязатльное поле!',
          description: 'Текст комментария не менее 5 символов!',
        };
        openNotificationWithIcon(notificationConfig);
        return;
      }

      this.setState({
        submitting: true,
      });

      setTimeout(() => {
        const comment = {
          author: form.name,
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: <p>{form.content}</p>,
          datetime:`${new Date().toLocaleDateString()} в ${new Date().toLocaleTimeString()}`,
        };
        this.setState({
          submitting: false,
          currentCommentCount: this.state.currentCommentCount + 1,
          form: {
            name: '',
            content: '',
          },
          currentCommnets: [
             comment,
            ...this.state.currentCommnets,
          ],
        }, () => {
          this.pushCommnet(currentId, comment)
        });
        openNotificationWithIcon({
          type:'success',
          message: 'Ваш комментарий добавлен!'
        });
  
      }, 1000);
  }

  handleOk = () => {
    this.setState({
      visibleModal: false,
      previeImg: null,
      previeTitle:null,
      currentId: null,
      currentLikesCount: null,
      currentCommentCount: null,
      currentCommnets: [],
      form: {
        name: '',
        content: '',
      },
      submitting: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false,
      previeImg: null,
      previeTitle:null,
      currentId: null,
      currentLikesCount: null,
      currentCommentCount: null,
      currentCommnets: [],
      form: {
        name: '',
        content: '',
      },
      submitting: false,
    });
  };

  handleShowModal = (params) => () => {
      this.setState({
          visibleModal: true,
          ...params,
      });
  };

  handleChangeLikeToggle = (itemId) => () => {
      const { dataGallary } = this.state;
      const index = dataGallary.findIndex(({ id }) => id === itemId);
      const newItem = {...dataGallary[index], likeToggle: !dataGallary[index].likeToggle, likesCount: dataGallary[index].likeToggle ? 0 : 1 };

      const newData = [...dataGallary.slice(0, index), newItem, ...dataGallary.slice(index + 1)];
      this.setState({ dataGallary: newData, currentLikesCount: dataGallary[index].likeToggle ? 0 : 1, currentToggleLike: !dataGallary[index].likeToggle });
  }

  renderPage = (item) => {
      return (
          <div className="col-12 col-lg-4 col-md-4 col-xs-4 col-sm-12 mb-3">
             <div className="card-wrapp">
                 <div onClick={this.handleShowModal({
                   previeImg: item.imgUrl,
                   previeTitle: item.title,
                   currentId: item.id,
                   currentLikesCount: item.likesCount,
                   currentCommentCount: item.comments.length,
                   currentToggleLike: item.likeToggle,
                   currentCommnets: item.comments,
                 })}
                      className="card-wrapp__image-wrapp">
                    <img className="card-wrapp__image"
                        src={item.imgUrl} alt={item.title} />
                 </div>
                 <hr className="hr" />
                 <div className="row">
                    <div className="col-6">
                        <span className="card-wrapp__title"><b>{item.title}</b></span>
                    </div>
                    <div className="col-3">
                       <Tooltip title={`Лайки ${item.likesCount}`}>
                          <span  onClick={this.handleChangeLikeToggle(item.id)}
                                  className="card-wrapp__likes-count"><LikeOutlined style={{color: item.likeToggle ? '#1890FF': '#AAAAAA' }}/>{item.likesCount}</span>
                       </Tooltip>
                    </div>
                    <div className="col-3">
                       <Tooltip onClick={this.handleShowModal({
                                                previeImg: item.imgUrl,
                                                previeTitle: item.title,
                                                currentId: item.id,
                                                currentLikesCount: item.likesCount,
                                                currentCommentCount: item.comments.length,
                                                currentToggleLike: item.likeToggle,
                                                currentCommnets: item.comments,
                                              })}
                                title={`Комментари ${item.comments.length}`}>
                            <span className="card-wrapp__commnets-count"><CommentOutlined  style={{color: '#1890FF'}}/>{item.comments.length}</span>
                       </Tooltip>
                    </div>
                 </div>
             </div>
          </div>
      )
  }

  render() {
    const { dataGallary,
            visibleModal, 
            previeImg, 
            previeTitle,
            currentLikesCount,
            currentCommentCount,
            currentId,
            currentToggleLike,
            currentCommnets,
            form,
            submitting  } = this.state;
    return (
       <>
       <div className="container mt-5 mb-5">
          <List itemLayout="vertical"
                size="large"
                grid={{
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                  xs: 12,
                  sm: 6,
                  md:3,
                }}
                dataSource={dataGallary}
                pagination={{
                  onChange: page => {
                    console.log(page);
                  },
                  pageSize: 9,
                }}
                footer={
                  <div className="footer">
                    <b>PERCo</b> photo-gallary by <a  target="_blanck"
                                                      href="https://vk.com/karadzhikov.shura">Александр Караджиков</a>
                  </div>
                }
                renderItem={this.renderPage}
              />
            <Modal  title={previeTitle}
                    onOk={this.handleOk}
                    visible={visibleModal}
                    onCancel={this.handleCancel}>
                    <img src={previeImg}
                         alt={previeTitle}
                         className='modal-image' />
                    <hr className="hr" />
                    <div className="row">
                    <div className="col">
                       <Tooltip title={`Лайки ${currentLikesCount}`}>
                          <span   onClick={this.handleChangeLikeToggle(currentId)}
                                  className="card-wrapp__likes-count"><LikeOutlined style={{color: currentToggleLike  ? '#1890FF': '#AAAAAA' }}/>{currentLikesCount}</span>
                       </Tooltip>
                    </div>
                    <div className="col">
                       <Tooltip title={`Комментари ${currentCommentCount}`}>
                            <span className="card-wrapp__commnets-count"><CommentOutlined  style={{color: '#1890FF'}}/>{currentCommentCount}</span>
                       </Tooltip>
                    </div>
                    </div>
                    {currentCommnets.length > 0 && <CommentList comments={currentCommnets} />}
                    <hr className="hr" />
                    <Comment
                      avatar={
                        <Avatar
                          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          alt="Han Solo"
                        />
                      }
                      content={
                        <Editor
                          onChange={this.handleChange}
                          handleSubmit={this.handleSubmit}
                          submitting={submitting}
                          value={form}
                        />
                      }
        />
            </Modal>
       </div>
       <BackTop style={{ bottom: '15px', right: '8px'}}/>
       </>
    );
  }
};

