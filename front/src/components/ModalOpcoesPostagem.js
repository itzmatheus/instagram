import React from 'react';
import { Link } from 'react-router-dom';

import './Modal.css';

import logo from '../assets/logo.svg';
import camera from '../assets/camera.svg';

export default function ModalOpcoesPostagem({ handleClose, show, children }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <hr></hr>
        <button onClick={handleClose}>Cancelar</button>
      </section>
    </div>
  );
}
