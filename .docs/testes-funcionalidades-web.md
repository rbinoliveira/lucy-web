# Plano de Testes – Sistema Web do Dentista

Este documento descreve como testar as funcionalidades principais do sistema web do dentista.

# Casos de Teste por Funcionalidade

## 1. Cadastro do dentista por e-mail/senha
- **ID**: WEB-001
- **Funcionalidade**: Cadastro por e-mail/senha
- **Objetivo**: Verificar que um novo dentista consegue se cadastrar com e-mail e senha válidos.
- **Passos**:
  1. Acessar a página de cadastro.
  2. Preencher os campos obrigatórios com dados válidos.
  3. Submeter o formulário.
- **Dados de Teste**:
  - E-mail válido
  - Senha válida (pelo menos 6 caracteres)
  - Campos adicionais obrigatórios (nome)
- **Resultados Esperados**:
  - Conta criada com sucesso.
  - Redirecionamento adequado (dashboard) e mensagem de sucesso.
- **Fluxos e Edge Cases**:
  - E-mail inválido: exibir erro de validação.
  - Senha fora da política: exibir erro de validação.
  - E-mail já existente: bloquear cadastro com mensagem adequada.

## 2. Cadastro do dentista por Google
- **ID**: WEB-002
- **Funcionalidade**: Cadastro via Google
- **Objetivo**: Verificar que um novo dentista consegue se cadastrar usando conta Google.
- **Passos**:
  1. Acessar a tela de cadastro e escolher "Cadastrar com Google".
  2. Selecionar a conta Google de teste e conceder permissões.
  3. Concluir o fluxo de autenticação.
- **Dados de Teste**:
  - Conta Google de teste
- **Resultados Esperados**:
  - Usuário criado e autenticado.
  - Redirecionamento para dashboard.
- **Fluxos e Edge Cases**:
  - Cancelamento do pop-up: manter usuário deslogado.
  - Conta Google já vinculada: tratar como login (não duplicar contas).

## 3. Login do dentista por e-mail/senha
- **ID**: WEB-003
- **Funcionalidade**: Login por e-mail/senha
- **Objetivo**: Garantir que usuários existentes conseguem autenticar com credenciais válidas.
- **Passos**:
  1. Acessar a tela de login.
  2. Informar e-mail e senha válidos.
  3. Clicar em "Entrar".
- **Dados de Teste**:
  - E-mail existente
  - Senha correta
- **Resultados Esperados**:
  - Autenticação bem-sucedida.
  - Redirecionamento para dashboard.
- **Fluxos e Edge Cases**:
  - Senha incorreta: exibir erro.
  - Conta inexistente: exibir erro.
  - Conta existente mas associado a paciente: exibir erro.

## 4. Login do dentista por Google
- **ID**: WEB-004
- **Funcionalidade**: Login via Google
- **Objetivo**: Verificar que usuários com conta Google conseguem autenticar.
- **Passos**:
  1. Acessar a tela de login e escolher "Continuar com Google".
  2. Selecionar a conta Google e concluir o fluxo.
- **Dados de Teste**:
  - Conta Google vinculada ao sistema.
- **Resultados Esperados**:
  - Autenticação e redirecionamento para dashboard.
- **Fluxos e Edge Cases**:
  - Cancelar o pop-up: não autentica.
  - Conta Google não vinculada: criar e logar usuário.
  - Conta existente mas associado a paciente: exibir erro.

## 5. Recuperação de senha do dentista
- **ID**: WEB-005
- **Funcionalidade**: Recuperação de senha
- **Objetivo**: Validar o fluxo de reset de senha por e-mail.
- **Passos**:
  1. Acessar a tela "Esqueci minha senha".
  2. Informar o e-mail cadastrado e solicitar reset.
  3. Verificar recebimento do e-mail e seguir instruções.
  4. Definir nova senha e confirmar login com a nova senha.
- **Dados de Teste**:
  - E-mail do usuário de teste.
- **Resultados Esperados**:
  - E-mail de reset enviado.
  - Link válido e atualização de senha bem-sucedida.

## 6. Logout do dentista
- **ID**: WEB-006
- **Funcionalidade**: Logout
- **Objetivo**: Garantir que o usuário consiga sair da sessão com segurança.
- **Passos**:
  1. Estando logado, acionar a opção de logout.
  2. Validar limpeza de sessão/local storage/cookies conforme implementação.
  3. Navegar para página protegida e confirmar redirecionamento para login.
- **Dados de Teste**: N/A
- **Resultados Esperados**:
  - Sessão encerrada.
  - Acesso a rotas protegidas bloqueado até novo login.
- **Fluxos e Edge Cases**:
  - Intermitência de rede: não deve deixar sessão em estado inconsistente.

---

## Checklist Geral de Validação
- [ ] Mensagens de erro e sucesso estão claras e localizadas corretamente.
- [ ] Validações de formulário (required, formatos, limites) funcionam.
- [ ] Acessibilidade básica (focus, labels, aria) respeitada nas telas de auth.
- [ ] Logs de erro não expõem informações sensíveis no console.
- [ ] Fluxos de autenticação funcionam em janela anônima e com cookies limpos.
- [ ] Comportamento consistente em diferentes navegadores suportados.

