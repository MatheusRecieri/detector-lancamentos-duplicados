import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  //função apra lidar com upload de arquivos
  const handleFileUpload = files => {
    console.log('Arquivos recebidos:', files);
    setUploadedFiles(files);
  };

  return (
    <div className="app">
      <Header title="Sistema de Verfica~ção de duplicatas" />

      <FileUpload onUpload={handleFileUpload} />

      {/*Area de upload de arquivos  */}
      <div className="uploaded-files">
        <h3>Arquivos Carregados</h3>
        {uploadedFiles.length === 0 ? (
          <p>Nenhum arquivo carregado ainda</p>
        ) : (
          <ul>
            {uploadedFiles.map((file, index) => {
              <li key={index} {file.name}></li>
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
