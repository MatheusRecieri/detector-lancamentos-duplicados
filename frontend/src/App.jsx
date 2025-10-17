import { useState } from 'react';
import Header from './components/layout/Header';
import FileUploader from './components/FileUploader';
import './App.css';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  //função apra lidar com upload de arquivos
  const handleFileUpload = files => {
    console.log('Arquivos recebidos:', files);
    setUploadedFiles(files);
  };

  return (
    <div className="app">
      <h2>Hello World</h2>
      <Header title="Sistema de Verficação de duplicatas" />
      <FileUploader onUpload={handleFileUpload} />
      {/*Area de upload de arquivos*/}
      <div className="uploaded-files">
        <h3>Arquivos Carregados</h3>
        {uploadedFiles.length === 0 ? (
          <p>Nenhum arquivo carregado ainda</p>
        ) : (
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}> {file.name} </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
// import './App.css';

// function App() {
//   console.log('App está renderizando'); // Isso aparece no console?

//   return (
//     <div className="app">
//       <h1>Sistema de Verificação de Duplicatas</h1>
//       <p>Se você vê esta mensagem, o React está funcionando!</p>
//     </div>
//   );
// }

// export default App;
