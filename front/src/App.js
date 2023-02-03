import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  // OBJETO PRODUTO
  const produto = {
    codigo : 0,
    nome : '',
    marca :''
  }

  // HOOKS USE STATE
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos]         = useState([]);
  const [objProduto, setObjProduto]     = useState(produto);


  // USEEFFECT É UM HOOK É EXECUTADO QUANDO O COMPONENTE É MONTADO
  useEffect(()=>{
    fetch("http://localhost:8080/listar")
    .then(retorno => retorno.json())    // converte
    .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  // OBTEBDO OS DADOS DO FORMULARIO
  const aoDigitar = (e) => {
      setObjProduto({...objProduto, [e.target.name]:e.target.value});
  }

  // METODO CADASTRAR PRODUTO
  const cadastrar =  () => {
      fetch('http://localhost:8080/cadastrar', {
        method:'post',
        body:JSON.stringify(objProduto),
        headers:{
          'Content-type':'application/json',
          'Accept':'application/json'
        }
      })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if(retorno_convertido.mensagem !== undefined){
            alert(retorno_convertido.mensagem);
        }else{
          setProdutos([...produtos, retorno_convertido]);
          alert('Produto cadastrado com sucesso!');
          limparFormulario();
        }
      })
  }

   // METODO ALTERAR PRODUTO
   const alterar =  () => {
    fetch('http://localhost:8080/alterar', {
      method:'put',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem);
      }else{
        //MENSAGEM
        alert('Produto Alterado com sucesso!');

        // COPIA DO VETOR DE PRODUTOS
        let vetorTemp = [...produtos];

        // INDICE
        let indice = vetorTemp.findIndex((p) =>{
          return p.codigo ===   objProduto.codigo;
       });

        // ALTERAR DO VETORTEMP
        vetorTemp[indice] = objProduto;

        // ATUALIZAR O VETOR DE PRODUTOS
        setProdutos(vetorTemp);

        // LIMPAR O FORMULARIO
        limparFormulario();
      }
    })
}



   // METODO REMOVER PRODUTO
   const remover =  () => {
    fetch('http://localhost:8080/remover/'+objProduto.codigo, {
      method:'delete',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {

      // MENSAGEM
      alert(retorno_convertido.mensagem);

      // COPIA DO VETOR DE PRODUTOS
      let vetorTemp = [...produtos];

      // INDICE
      let indice = vetorTemp.findIndex((p) =>{
        return p.codigo ===   objProduto.codigo;
      });

      // REMOVER DO VETORTEMP
      vetorTemp.splice(indice, 1);

      // ATUALIZAR O VETOR DE PRODUTOS
      setProdutos(vetorTemp);

      // LIMPAR FORMULARIO
      limparFormulario();
    })
}

  // LIMPAR FORMULARIO
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  // SELECIONAR PRODUTO
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

  // RETORNO
  return (
    <div>
      <Formulario botao={btnCadastrar}  eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objProduto} cancelar={limparFormulario} remover={remover} alterar={alterar} />
      <Tabela  vetor={produtos} selecionar={selecionarProduto}/>

    </div>
  );
}

export default App;
