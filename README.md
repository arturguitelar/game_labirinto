# Game de Labirinto em Javascript (remaster)
Joguinho de labirinto em javascript feito com base no tutorial "Criando um jogo Completo" do Gustavo Silveira - link(https://www.youtube.com/playlist?list=PLclUTiUoLCbDog-vStY7VFHpFXJVML6EY)

Algumas ressalvas quanto a este projeto:
1. O código base foi primeiramente criado com base no tutorial e eu fui fazendo pequenas modificações ao longo do caminho. Depois resolvi refatorar um pouco mais o código para quebrar as funcionalidades em objetos, tentando desacoplar algumas funcionalidades.
1. Originalmente, por questões didáticas, o código mais complexo do jogo era feito dentro do arquivo "stage_1.js" e depois duplicado no arquivo "stage_2.js" com algumas pequenas alterações (favor assistir as ótimas aulas do Gustavo para entender). A minha intenção era poder criar os labirintos sem precisar duplicar tanto código, então para isso criei o "game_manager.js" e, posteriormente, o "mazes.js (para armazenar as matrizes de labirintos) e o "stages.js" (para armazenar os stages do jogo). Assim ficará mais fácil criar novos stages facilmente.
1. Depois fui quebrando as funcionalidades em objetos menores. Eu deveria separar cada objeto dentro de seus respectivos arquivos mas resolvi deixar tudo dentro do "game_manager.js" apenas para não colocar muitas chamadas de script no html. Resolvi então comentar o código dividindo por "seções". Espero que não fique tão difícil de entender ;)

*nota: Com toda essa refatoração, o jogo ficou com um pequeno bug e às vezes cria-se uma moeda em cima de algum bloco. Como para mim o projeto já foi suficiente como estudo, eu não pretendo fixar este bug agora. Talvez num futuro...*
