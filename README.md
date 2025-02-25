# Gerenciador de Livros

Este é um projeto de um sistema para gerenciar livros, permitindo adicionar, editar e exibir livros, bem como indicar quando estão em promoção.

## Tecnologias Utilizadas
- **HTML, CSS e JavaScript** para a interface de usuário.
- **Node.js e Express.js** para o backend.
- **Fetch API** para comunicação com o servidor.

## Funcionalidades
- **Adicionar livros** com nome, preço, gênero, classificação etária e status de promoção.
- **Exibir lista de livros** com indicação de promoção.
- **Editar livros** para alterar preço e status de promoção.
- **Atualização dinâmica** de promoções na interface.

## Implementação do Observer
O projeto utiliza o padrão de projeto **Observer** para monitorar alterações no status de promoção dos livros. A classe `LivroObserver` observa as alterações de estado e atualiza dinamicamente a interface quando um livro entra ou sai da promoção. 

### Como funciona:
1. **Cada livro** possui um status de promoção (`true` ou `false`).
2. **Quando o status muda**, o `LivroObserver` atualiza a interface do usuário.
3. **Se um livro está em promoção**, uma mensagem visual é exibida na tela e atualizada periodicamente.
4. **Quando a promoção é removida**, a mensagem desaparece.

Isso garante que o usuário sempre veja as informações mais recentes sem precisar atualizar a página manualmente.

## Endpoints da API
- `GET /livros` - Retorna a lista de livros.
- `POST /livros` - Adiciona um novo livro.
- `PUT /livros/:id` - Atualiza um livro.



