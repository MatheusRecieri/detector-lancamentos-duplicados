import PropTypes from 'prop-types';
import React from 'react';

//propriedade do componente {OBJ}
// props do titulo {string}

function Header({ title }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <nav>
        <ul>
          <li>
            <a href="#upload">Upload</a>
          </li>
          <li>
            <a href="resultados">Resultados</a>
          </li>
          <li>
            <a href="sobre">Sobre</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
