window.onload = function() {
    let basePyramid = 29;
    let numberOfLines = (basePyramid + 1) / 2;
    let controlLeft = numberOfLines;
    let controlRight = numberOfLines;
  
    // Variável usada para 
    let truncate = false;
  
    // Armazena o elemento container fora da função, para que o querySelector não precise ser chamado sempre que a janela for redimensionada.
    // Isso melhora a performance.
    let container = document.querySelector('.container');
  
    // Usado para alterar o padding do container no css e também para calcular o espaço disponível para o triângulo.
    // 30 é o tamanho configurado manualmente no style.css.
    let containerPadding = 30;
  
    // Atribui o valor ao style.padding em pixels.
    container.style.padding = containerPadding + 'px';
  
    // createLines precisa ser chamada antes da declaração da variável lines,
    // caso contrário as linhas não existiriam e ela permaneceria vazia.
    createLines();
  
    let lines = document.querySelectorAll(".line");
  
    updateVisit();
  
    fillTriangle();
    
    // Atualiza a quantidade de visitas no site, utilizando o LocalStorage
    function updateVisit() {
      if (typeof (Storage) != "undefined") {
        if(localStorage.count !== undefined) {
          let count = parseInt(localStorage.count);
          count+=1;
          localStorage.count = count;
          document.getElementById("count").innerHTML = count;
        } else {
          localStorage.count = 1;
          document.getElementById("count").innerHTML = 1;
        }
      } else {
        document.write("Sem suporte para Web Storage");
      }  
    }
  
    // Passa por todos as linhas (div com class line) e preenche o triangulo
    // Removido parâmetro lines, pois foi declarado no início do documento.
    function fillTriangle() {
      for(let index = 0; index < lines.length; index += 1) {
        fillLine(lines[index]);
        controlRight += 1;
        controlLeft -= 1;
      }
    }
  
    // Cria uma caixa com base nas diferentes classes
    function createBox(className) {
      let box = document.createElement("div");
      box.className = className;
      return box;
    }
  
    // Preenche uma linha
    function fillLine(divLine) {
      for (let lineColumn = 1; lineColumn <= basePyramid; lineColumn += 1) {
        if(lineColumn >= controlLeft && lineColumn <= controlRight) {
          let box = createBox("box");
          divLine.appendChild(box);
        } else {
          // Aqui foi alterado o parâmetro para que a nova box tenha as classes 'box' e 'empty' em vez apenas 'box-empty'.
          // Isso permite uma manipulação mais facilitada dos elementos.
          divLine.appendChild(createBox("box empty"));
        }
      }
    }
  
    // Cria número de linhas dinamicamente, permitindo alterar o tamanho da base.
    function createLines() {
      //Encontra o elemento com a classe tringle, que é será o parentElement de cada nova linha.
      let triangle = document.querySelector(".triangle");
  
      // Laço de repetição que cria a quantidade de linhas usando a variável numberOfLines, declarada no início do arquivo.
      for (let i = 0; i < numberOfLines; i += 1) {
        let line = document.createElement("div");
        line.className = 'line';
        triangle.appendChild(line);
      }
    }
  
    // Redimensiona o tamanho de cada box da pirâmide para fazer o cáculo a função usa a variável basePyramid, declarada no início do arquivo,
    // e a largura do triângulo, que a função busca usando getBoundingClientRect() no elemento.
    function resizeBoxes() {
  
      // O getBoundingClientRect() retorna um objeto que contém vários atributos do retângulo do elemento.
      // Vamos usar apenas a width.
      let width = container.getBoundingClientRect().width;
  
      // O container tem um padding que afasta o conteúdo da sua borda.
      // Precisamos eliminar esse padding da esquerda e da direita para saber a largura utilizável, por isso ele está sendo muitiplicado por 2.
      let usableWidth = width - containerPadding * 2;
  
      // Se não remover algumas unidades da usableWidth o triângulo desalinha alguns quadrados.
      // Acredito que seja um problema de precisão. Não consegui resolver sem fazer isso.
      usableWidth -= 10;
  
      // Pega todas as boxes, incluindo as '.empty' por causa da separação das classes na linha 71.
      let allBoxes = document.querySelectorAll('.box');
  
      // Calcula o novo tamanho das boxes.
      let newSize = usableWidth / basePyramid;
  
      if(truncate){
        // Essa linha transforma o newSize em um inteiro truncando ele, ou seja, apenas remove o que tem depois da vírgula, sem necessariamente fazer um arredondamento.
        newSize = Math.floor(newSize);
      }
  
      // Altera a largura e altura de cada bloco usando o newSize que acabamos de criar.
      // A atribuição precisa ser feita em pixels.
      for(let box of allBoxes) {
        box.style.width = newSize + 'px';
        box.style.height = newSize + 'px';
      }
  
      // A altura das linhas precisa acompanhar a altura dos blocos.
      // Esse laço for faz isso pra cada uma das linhas.
      for(let line of lines) {
        line.style.height = newSize + 'px';
      }
    }
  
    // Adiciona a função ao evento 'resize' no elemento window.
    // Dessa forma, sempre que a janela for redimensionada a função irá alterar o tamanho de todas as box para que caibam na janela com o novo tamanho.
    window.addEventListener('resize', resizeBoxes);
  
    // Chama a função uma vez fora do evento para que as boxes sejam redimensionadas ao terminar o carregamento da página.
    resizeBoxes();
  
    // Função que adiciona um botão que reinicia a contagem.
    function createResetButton(){
  
      // Cria o botão e configura suas propriedades.
      let button = document.createElement('button');
      button.textContent = 'Reiniciar Contagem';
      button.style.marginLeft = '10px';
  
      // Adiciona ao evento click do botão a função que reseta a contagem para 1.
      button.addEventListener('click', function(){
        if (typeof (Storage) != "undefined") {
          localStorage.count = 1;
          document.getElementById("count").innerHTML = 1;
        } else {
          document.write("Sem suporte para Web Storage");
        }  
      })
  
      // Adiciona o botão como filho da div com a classe visit
      document.querySelector('div.visit').appendChild(button);
  
    }
  
    createResetButton();
  
    // colorPicker criado no corpo principal para que seu valor possa ser lido dentro de múltiplas funções.
    let colorPicker = document.createElement('input');
    colorPicker.type = 'color';
  
    // Função que pinta as boxes declarada no corpo principal para que possa ser usada em mais de um evento.
    function repaintBoxes() {
      // :not(.empty) no parâmetro do querySelectorAll assegura que as boxes vazias (.empty) não serão selecionadas, e por isso não serão pintadas no for abaixo.
      let allPaintedBoxes = document.querySelectorAll('.box:not(.empty)');
  
      for(let box of allPaintedBoxes) {
        box.style.backgroundColor = colorPicker.value;
      }
    }
  
    // Cria recurso que pinta a pirâmide de uma nova cor escolhida.
    function createRepaintFeature() {
      let newDiv = document.querySelector('.repaint');
  
      // incorpora colorPicker à estrutura HTML
      newDiv.appendChild(colorPicker);
  
      let button = document.createElement('button');
      button.textContent = 'Pintar';
      button.style.marginLeft = '10px';
  
      newDiv.appendChild(button);
  
      // Adiciona ao evento click do botão a função repaintBoxes, declarada no corpo pricipal
      button.addEventListener('click', repaintBoxes)
    }
  
    createRepaintFeature();
  
    // Cria recurso de reconstruir a pirâmide sem que seja necessário recarregar o navegador.
    function createRebuildFeature() {
      // Novos elementos criados e seus atributos modificados de acordo com a necessidade.
      let newDiv = document.querySelector('.rebuild')
      newDiv.innerText = 'Nova Base:';
  
      let sizeInput = document.createElement('input');
      sizeInput.style.width = '50px';
      sizeInput.style.marginLeft = '10px';
      sizeInput.type = 'number';
      newDiv.appendChild(sizeInput);
  
      let button = document.createElement('button');
      button.textContent = 'Reconstruir';
      button.style.marginLeft = '10px';
      newDiv.appendChild(button);
  
      let warning = document.createElement('span');
      warning.style.color = 'red';
      warning.style.marginLeft = '10px';
      newDiv.appendChild(warning);
  
      // Adiciona ao evento change do elemento sizeInput uma função que avisa o usuário sobre o risco de usar bases muito grandes.
      sizeInput.addEventListener('change', function(){
        let base = parseInt(sizeInput.value);
  
        if(base > 99){
          warning.innerText = 'Atenção! Bases muito grandes podem travar seu browser.';
        }else{
          warning.innerText = '';
        }
      })
  
      // Adiciona ao evento click do botão Reconstuir a função que reconstrói a pirâmide.
      button.addEventListener('click', function(){
        let base = parseInt(sizeInput.value);
  
        // Caso a base não seja ímpar ou o input esteja vazio, retorna e sai da função sem fazer nada.
        if(base % 2 === 0 || !base){
          alert('A base precisa ser um número ímpar.');
          return;
        }
  
        // Destrói a pirâmide, apagando todo o conteúdo do elemento de classe triângulo.
        document.querySelector('.triangle').innerHTML = '';
  
        // Atribui às variáveis declaradas no início do documento os valores calculados de acordo com a nova base
        basePyramid = base;
        numberOfLines = (base + 1) / 2;
        controlLeft = numberOfLines;
        controlRight = numberOfLines;
  
        // Chama novamente as funções que controem as linhas o triângulo e pega as novas linhas criadas.
        createLines();
        lines = document.querySelectorAll(".line");
        fillTriangle();
  
        // Chama as funções responsáveis por repintar e redimensionar as boxes.
        resizeBoxes();
        repaintBoxes();
      })
    }
  
    createRebuildFeature();
  
    // Cria o recurso que permite truncar o tamanho das boxes.
    function createTruncateFeature() {
      let newDiv = document.querySelector('.truncate');
      newDiv.innerHTML = 'Truncar tamanho das boxes?';
  
      let checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.style.marginLeft = '10px';
      newDiv.appendChild(checkBox);
  
      let paragraph = document.createElement('p');
      paragraph.innerHTML = 'Isso faz com que o tamanho das boxes receba pixels inteitos, o que melhora o formato do triângulo com bases maiores, mas reduz sua flexibilidade.';
      newDiv.appendChild(paragraph);
  
      // Essa função do evento change apenas atribui o valor da checkBox ao truncate e chama a função que redimensiona as boxes.
      checkBox.addEventListener('change', function(){
        truncate = checkBox.checked;
        resizeBoxes();
      })
    }
  
    createTruncateFeature();
  
    document.querySelector('#btn-save').addEventListener('click', function(){
      alert('Ainda não implementado.');
    })
  
    document.querySelector('#btn-load').addEventListener('click', function(){
      alert('Ainda não implementado.');
    })
  }