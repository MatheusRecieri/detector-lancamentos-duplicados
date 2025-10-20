// Bibliotecas

'use client';
import { useState, useEffect } from 'react';
//componentes
import Header from '../components/layout/Header';
import FileUploader from '../components/FileUploader';
import UploadedFiles from '../components/UploadedFiles';
import Body from '../components/layout/Body';
// css
// import '../styles/App.css';
// import '../styles/Body.css';
// import '../styles/UploadedFiles.css';

/**
 * COMPONENTE PRINCIPAL DA APLICAÇÃO
 *
 * O que é um componente?
 * - É uma função JavaScript que retorna JSX (HTML + JavaScript)
 * - Começa com letra MAIÚSCULA
 * - Pode receber "props" (propriedades)
 * - É reutilizável
 */
function Home() {
  // Estado da aplicação - dados que podem mudar
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  /**
   * Função para lidar com upload de arquivos
   * @param {Array} files - Lista de arquivos selecionados
   *
   */
  const handleFileUpload = files => {
    console.log('Arquivos recebidos:', files);
    setUploadedFiles(files);

    // simulação de upload ed arquivo
    setAnalysis({
      totalNotas: 5,
      duplicadas: [
        {
          nota: '202500000000028',
          fornecedor: 'FS PROCESSAMENTO DE DADOS LTDA',
          valor_contabil: 2142.0,
          n_nota: 'NF-00028',
          qtd: 3,
          status: 'Duplicata Confirmada',
        },
        {
          nota: '202500000000293',
          fornecedor: 'FS PROCESSAMENTO DE DADOS LTDA',
          valor_contabil: 2043.0,
          n_nota: 'NF-00293',
          qtd: 2,
          status: 'Duplicata Confirmada',
        },
        {
          nota: '202500000000102',
          fornecedor: 'TRANSLOG SERVIÇOS DE TRANSPORTE LTDA',
          valor_contabil: 980.45,
          n_nota: 'NF-00102',
          qtd: 2,
          status: 'Duplicata Confirmada',
        },
      ],
      possiveisDuplicadas: [
        {
          codigos: '202500000000688, 202500000000689',
          valor_contabil: 2043.0,
          nota: 'NF-00688 / NF-00689',
          qtd: 2,
          status: 'Possível Duplicata',
        },
        {
          codigos: '202500000000702, 202500000000703, 202500000000704',
          valor_contabil: 1780.9,
          nota: 'NF-00702 / NF-00703 / NF-00704',
          qtd: 3,
          status: 'Suspeita de Duplicata',
        },
      ],
    });
    // setAnalysis({
    //   totalNotas: 154,
    //   duplicadas: [
    //     {
    //       codigos: '202500000000028',
    //       fornecedor: 'FS PROCESSAMENTO DE DADOS LTDA',
    //       valor: 2142.0,
    //       data: '28/01/2025',
    //     },
    //     {
    //       codigos: '202500000000293',
    //       fornecedor: 'FS PROCESSAMENTO DE DADOS LTDA',
    //       valor: 2043.0,
    //       data: '25/03/2025',
    //     },
    //   ],
    //   possiveisDuplicadas: [
    //     {
    //       codigos: '202500000000688',
    //       fornecedor: 'FS PROCESSAMENTO DE DADOS LTDA',
    //       valor: 2043.0,
    //       data: '24/06/2025',
    //     },
    //   ],
    // });
  };

  // console.log(uploadedFiles, setUploadedFiles, setAnalysis);
  useEffect(() => {
    console.log('Novo estado de analysis:', analysis);
  }, [analysis]);
  /**
   * JSX - JavaScript XML
   * - Parece HTML, mas é JavaScript
   * - Usa className em vez de class
   * - Pode inserir JavaScript com { }
   */
  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
        <Header title="Sistema de Verificação de Duplicatas" />
        <FileUploader onUpload={handleFileUpload} />
        <UploadedFiles files={uploadedFiles} />
        <Body analysis={analysis} />
      </div>
    </main>
  );
}

// Exportação padrão - permite usar em outros arquivos
export default Home;
