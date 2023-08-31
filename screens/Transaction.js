import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    //Estados a serem avaliados no App 
    this.state = {
      domState: "normal",           //Estado do modo: Diz se o App está no modo digitalizar ou digitalizado
      hasCameraPermissions: null,   //Estado câmera: Diz se o usuário deu ou não permissão pra câmera
      scanned: false,               //Estado digitalizado: Diz se a digitalização foi concluída ou não
      bookId: "",                   //Estado ID Livro: Armazena o dado de identificação digitalizado do livro
      studentId: "",                //Estado ID Aluno: Armazena o dado de identificação digitalizado do aluno
    };
  }

  //Função para solicitar a permissão da câmera - Retorna um objeto {status} contendo a informação do status da solicitação
  getCameraPermissions = async domState => { // Analisando qual botão foi pressionado
    const { status } = await Permissions.askAsync(Permissions.CAMERA);  //Função predefinida, basta informar quem precisa da permissão.
                                                                        
    this.setState({
      /*status === "granted" . É verdadeiro, o usuário concedeu permissão
          status === "false" . O usuário não concedeu permissão
        */
      hasCameraPermissions: status === "granted",
      domState: domState, //Análise de qual botão foi apertado para realizar a digitalização
      scanned: false
    });
  };

  //Função que abre o leitor de código de barras para ler o QRCode quando o usuário conceder a permissão
  handleBarCodeScanned = async ({ type, data }) => {
    const { domState } = this.state;
    
    //Lógica para receber a identificação do código de barra, dependendo de qual botão foi pressionado
    //Se o botão scannner pressionado for: ID Livro
    if(domState === "bookId"){
      this.setState({
        bookId: data,
        domState: "normal",
        scanned: true
      });      
    }
    //Desafio 3: Se o botão scannner pressionado for: ID Aluno
    //Atualizar domState e defina valores para as caixas de texto.
  };

  render() {
    //Incluiu a permissão do dispositivo para usar a câmera e em seguida, e atualiza-se os estados quando o usuário der a permissão
    const { domState, hasCameraPermissions, bookId, studentId, scanned } = this.state;
    
    //Para exibir o leitor de QRCode assim que o botão mudar de "normal"
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    //Código para criar uma caixa de texto para receber ID Livro (70 a 84)
    //Desafio 1: Criar um textInput para studentId. A partir da Linha 86
    //Desafio 2: Criar um botão de digitalização e chamar a função de permissão da câmera para ler o QRCode, quando o botão deste campo for pressionado. 
    return (
      <View style={styles.container}>
        
        <View style={styles.lowerContainer}>
          <View style={styles.textinputContainer}>
            <TextInput 
              style={styles.textinput}
              placeholder={"ID livro"}
              placeholderTextColor={"#FFFFFF"}
              value={bookId}
            />            
            <TouchableOpacity //Botão de digitalização direcionado ao campo ID livro
              style={styles.scanbutton}
              onPress={() => this.getCameraPermissions("bookId")}
            >
              <Text style={styles.scanbuttonText}>Digitalizar</Text>
            </TouchableOpacity>
          </View>

          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { //Classe que estiliza o fundo da tela Transaction
    flex: 1, //divisão dos espaços na tela do app
    backgroundColor: "#FFFFFF" //cor de fundo
  },
  lowerContainer: { //Classe que estiliza a Div que recebe a caixa de entrada (Input)
    flex: 0.5, //divisão dos espaços na tela do app
    alignItems: "center" //alinhamento na horizontal
  },
  textinputContainer: { //Classe que estiliza a caixa de entrada (Input)
    borderWidth: 2, //largura da borda
    borderRadius: 10, //raio da borda
    flexDirection: "row", //mantém a mesma distância entre os itens da mesma linha
    backgroundColor: "#9DFD24", //cor de fundo
    borderColor: "#FFFFFF" //cor da borda
  },
  textinput: { //Classe que estiliza o texto da caixa de entrada (TextInput)
    width: "57%", //largura
    height: 50, //altura
    padding: 10, //distância entre o conteúdo de um elemento e suas bordas
    borderColor: "#FFFFFF", //cor da borda
    borderRadius: 10, //raio da borda
    borderWidth: 3, //largura da borda
    fontSize: 18, //tamanho da letra
    backgroundColor: "#5653D4", //cor de fundo
    color: "#FFFFFF" //cor da letra
  },
  scanbutton: { //Classe que estiliza o botão de scanner do campo ID Livro
    width: 100, //largura
    height: 50, //altura
    backgroundColor: "#9DFD24", //cor de fundo
    borderTopRightRadius: 10, //raio da borda superior da direita
    borderBottomRightRadius: 10, //raio da borda inferior da direita
    justifyContent: "center", //alinhamento na vertical
    alignItems: "center" //alinhamento na horizontal
  },
  scanbuttonText: { //Classe que estiliza texto do botão de scanner do campo ID Livro
    fontSize: 20, //tamanho da letra
    color: "#0A0101", //cor da letra
  }
 
});
