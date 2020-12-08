import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

import './Feed.css';
import ModalOpcoesPostagem from '../components/ModalOpcoesPostagem'

class Feed extends Component {

    state = {
        feed: [],
        show: false,
        postModalId: 0,
    };

    async componentDidMount() {

        this.registerToSocket();

        // Metodo executado automaticamente quando o componente for montado  em tela
        const response = await api.get('posts');

        this.setState({ feed: response.data });
    }

    registerToSocket = () => {
        const socket = io(process.env.REACT_APP_API_URL);

        // watching: post, like

        socket.on('post_create', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] });
        });

        socket.on('like', likedPost => {
            this.setState({
                feed: this.state.feed.map(post =>
                    post._id === likedPost._id ? likedPost : post
                )
            });
        });

        socket.on('post_delete', postDeleted => {
            this.setState({
                feed: this.state.feed.filter(post =>
                    (post._id !== postDeleted._id)
                )
            });
        });
    }

    handleLike = id => {
        api.post(`/posts/${id}/like`);
    }

    showModal = idPost => {
      this.setState({ show: true, postModalId: idPost })
    }

    hideModal = () => {
      this.setState({ show: false, postModalId: 0 })
    }

    handleDeletePost = () => {
      api.delete(`/posts/${this.state.postModalId}`)
      this.hideModal()
    }

    render() {
        return (
          <>
            <section id="post-list">

                { this.state.feed.map(post => (
                    <article key={post._id}>
                        <header>
                            <div className="user-info">
                                <span>{post.author}</span>
                                <span className="place">{post.place}</span>
                            </div>

                            <button id="btn_more" onClick={() => this.showModal(post._id)}>
                              <img src={more}  alt="Mais" />
                            </button>

                        </header>

                        <img src={`${post.image}`} alt="Foto Perfil"/>

                        <footer>
                            <div className="actions">
                                <button type="button" onClick={() => this.handleLike(post._id)}>
                                    <img src={like} alt="" />
                                </button>
                                <img src={comment} alt="" />
                                <img src={send} alt="" />
                            </div>

                            <strong>{post.likes} curtidas</strong>

                            <p>
                            {post.description}
                            <span>{post.hashtags}</span>
                            </p>
                        </footer>
                    </article>
                )) }

            </section>
            <ModalOpcoesPostagem show={this.state.show} handleClose={this.hideModal}>
              <button onClick={this.handleDeletePost} style={{color: "#ed4956"}}><strong>Apagar publicação</strong></button>
            </ModalOpcoesPostagem>
            </>
        )
    };
}

export default Feed;
