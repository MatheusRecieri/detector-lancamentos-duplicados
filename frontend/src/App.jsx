// Importações no React - SEMPRE no topo do arquivo
import React from 'react';
import Header from './components/layout/Header';
import FileUploader from './components/FileUploader';
import UploadedFiles from './components/UploadedFiles';
// import Body from './components/layout/Body';
import './App.css';

/**
 * COMPONENTE PRINCIPAL DA APLICAÇÃO
 *
 * O que é um componente?
 * - É uma função JavaScript que retorna JSX (HTML + JavaScript)
 * - Começa com letra MAIÚSCULA
 * - Pode receber "props" (propriedades)
 * - É reutilizável
 */
function App() {
  // Estado da aplicação - dados que podem mudar
  const [uploadedFiles, setUploadedFiles] = React.useState([]);

  /**
   * Função para lidar com upload de arquivos
   * @param {Array} files - Lista de arquivos selecionados
   */
  const handleFileUpload = files => {
    console.log('Arquivos recebidos:', files);
    setUploadedFiles(files);
  };

  console.log(uploadedFiles, setUploadedFiles);

  /**
   * JSX - JavaScript XML
   * - Parece HTML, mas é JavaScript
   * - Usa className em vez de class
   * - Pode inserir JavaScript com { }
   */
  return (
    <div className="app">
      {/* Componente Header - observe como usamos como tag HTML */}
      <Header title="Sistema de Verificação de Duplicatas" />

      {/* Componente FileUpload com propriedade onUpload */}
      <FileUploader onUpload={handleFileUpload} />

      {/* Área para mostrar arquivos uploadados */}
      <UploadedFiles files={uploadedFiles} />

      <Body />
    </div>
  );
}

// Exportação padrão - permite usar em outros arquivos
export default App;
