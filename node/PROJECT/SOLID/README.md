# APP

GymPass

## RFs (Requisitos funcionais)

- [x] Deve ser possível ser cadastrar
- [x] Deve ser possível ser autenticar
- [x] Deve ser possível obter o perfil de um usuário logado
- [x] Deve ser possível obter o perfil de um usuário logado
- [x] Deve ser possível obter o numero de check-ins realizados pelo usuários logado
- [x] Deve ser possível o usuário obter seu histórico de check-ins
- [x] Deve ser possível o usuário buscar academia próximas
- [x] Deve ser possível o usuário buscar academia próximas
- [x] Deve ser possível o usuário buscar academias pelo nome
- [x] Deve ser possível o usuário realizar check-in em uma academia
- [x] Deve ser possível validar um check-in de um usuário;
- [x] Deve ser possível castrada um academia;

## RNs (Regra de negocio)

- [x] o usuário não deve poder se cadastrar com um e-mail duplicado
- [x] o usuário não deve poder fazer 2 check-ins no mesmo dia
- [x] o usuário não deve poder fazer check se não estiver perto (100m) da academia
- [x] o check-in só pode ser validado até 20 minutos após criado
- [x] o usuário não deve poder fazer check se não estiver perto (100m) da academia
- [x] o check-in só pode ser validado por administrador
- [x] a academia só pode ser cadastrada por administrado

## RNFs (Requisitos Não Funcionais)

- [x] a senha do usuário precisa estar criptografada
- [x] os dados da aplicação de estar permitidos em um banco PostgreSQL
- [x] Toda lista de dados precisa estar paginada com 20 items por pagina eSQL
- [ ] o usuário deve ser indicificado por um jwt token
