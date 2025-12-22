# Objetivo e Contexto

O projeto consiste no desenvolvimento de um aplicativo para auxiliar na prescrição de medicamentos e na adesão ao tratamento, independentemente das habilidades de leitura do paciente. O objetivo é garantir eficácia e acessibilidade, promovendo o letramento em saúde e melhorando a adesão aos tratamentos prescritos.

Além disso, o aplicativo busca contribuir para a redução do risco de resistência a microorganismos e oferecer suporte aos dentistas no monitoramento das prescrições. A proposta envolve a implementação de soluções que tornem o acompanhamento mais intuitivo e eficiente, permitindo que profissionais da saúde e pacientes tenham uma experiência mais segura e orientada no uso de medicamentos.

# Público Alvo

- Dentistas das redes públicas e privadas
- Pacientes das redes públicas e privadas

# User Stories

- [ ] 0.1 O Admin deve conseguir cadastrar um remédio 
- [ ] 0.2 O Admin deve conseguir adicionar vídeos demonstrativos  

- [ ] 1.1 O Dentista deve conseguir logar via email/senha
- [ ] 1.2 O Dentista deve conseguir logar via Google
- [ ] 1.3 O Dentista deve conseguir criar uma conta com os dados 
- [ ] 1.4 O Dentista deve conseguir recuperar sua senha
- [ ] 2.1 O Dentista deve conseguir cadastrar um paciente
- [ ] 2.2 O Dentista deve conseguir editar um paciente
- [ ] 2.3 O Dentista deve conseguir remover um paciente
- [ ] 2.4 O Dentista deve conseguir listar os pacientes
- [ ] 2.5 O Dentista deve conseguir buscar um paciente pelo nome
- [ ] 3.1 O Dentista deve conseguir cadastrar uma prescrição medicamentosa para o paciente
- [ ] 3.2 O Dentista deve conseguir editar uma prescrição medicamentosa de um paciente
- [ ] 3.3 O Dentista deve conseguir remover uma prescrição medicamentosa de um paciente
- [ ] 3.4 O Dentista deve conseguir listar as prescrições de um determinado paciente
- [ ] 4.1 O Dentista deve conseguir acompanhar a interação do paciente com os medicamentos
- [ ] 5.1 O Dentista deve conseguir gerar um relatório sobre o sucesso do tratamento (feature em brainstorm)
- [ ] 6.1 O Dentista deve conseguir enviar texto para o paciente 
- [ ] 7.1 O Dentista deve conseguir enviar áudio para o paciente 

# Requisitos Não Funcionais

- [ ] Sistema acessível via navegador, responsivo.
- [ ] Na funcionalidade de criação de conta, o usuário irá se registrar com o status pedente, sendo necessário a aprovação para ele poder logar na aplicação. (a validar se será possível qualquer um se cadastrar sem aprovação ou não)
- [ ] Na criação de uma prescrição medicamentosa, ter um campo de combobox que ao digitar algumas letras aparece medicamentos que começam com aquela letra e ao selecionar preecher automaticamente os campos restantes mas permitindo edição

# 📂 Modelo de Dados - Sistema para Dentistas  

## 🏛 Estrutura do Banco de Dados  

### 📌 Pacientes (`patients`)
| Campo         | Tipo          | Descrição                          | Restrições |
|--------------|--------------|------------------------------------|------------|
| `id`         | UUID         | Identificador único do paciente   | PRIMARY KEY |
| `nome`       | STRING       | Nome completo                     | NOT NULL |
| `email`      | STRING       | E-mail do paciente                | UNIQUE, NULLABLE |
| `telefone`   | STRING       | Telefone de contato               | NOT NULL |
| `genero`     | STRING       | Genero                            | NOT NULL |
| `data_nascimento` | DATE   | Data de nascimento                 | NOT NULL |
| `endereco completo`   | STRING       | Endereço completo                 | NULLABLE |
| `numero do sus`   | STRING       | Numero do SUS                 | NULLABLE |
| `created_at` | TIMESTAMP    | Data de criação do registro       | DEFAULT NOW() |
| `updated_at` | TIMESTAMP    | Última atualização do registro    | DEFAULT NOW() |

---

### 📌 Dentistas (`dentists`)
| Campo         | Tipo          | Descrição                          | Restrições |
|--------------|--------------|------------------------------------|------------|
| `id`         | UUID         | Identificador único do dentista   | PRIMARY KEY |
| `nome`       | STRING       | Nome completo                     | NOT NULL |
| `cro`        | STRING       | Número do CRO                     | UNIQUE, NOT NULL |
| `email`      | STRING       | E-mail profissional               | UNIQUE, NOT NULL |
| `telefone`   | STRING       | Telefone de contato               | NOT NULL |
| `senha`      | STRING (HASH)| Senha criptografada               | NOT NULL |
| `created_at` | TIMESTAMP    | Data de criação do registro       | DEFAULT NOW() |
| `updated_at` | TIMESTAMP    | Última atualização do registro    | DEFAULT NOW() |

---

### 📌 Prescrições Médicas (`prescriptions`)
| Campo          | Tipo          | Descrição                          | Restrições |
|---------------|--------------|------------------------------------|------------|
| `id`          | UUID         | Identificador único da prescrição | PRIMARY KEY |
| `medicamento` | STRING       | Nome do medicamento                | NOT NULL |
| `quantidade_compra`     | STRING  | Quantidade a ser comprada (ex: 1 caixa)              | NOT NULL |
| `frequencia`  | STRING       | Frequência de administração (ex: Tomar um comprimido a cada 8 horas por 3 dias)       | NOT NULL |
| `observacoes` | TEXT         | Observações adicionais             | NULLABLE |
| `created_at`  | TIMESTAMP    | Data de criação do registro        | DEFAULT NOW() |

---

## 🔗 Relacionamentos
- `patients` (1) ↔ (N) `appointments`
- `dentists` (1) ↔ (N) `appointments`
- `appointments` (1) ↔ (N) `prescriptions`

---

# Anotações

# Versões

# Prazos