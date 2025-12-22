Aplicativo – Luísa
ADM
Registrar medicamentos: 
- princípio ativo – campo aberto – dipirona 50mg/ml
- dose – campo aberto – 50mg/ml
- forma farmacêutica – selecionar –.
    • Solução oral -> tomar
    • Suspensão oral -> tomar
    • Comprimido -> tomar
    • Cápsula -> tomar
    • Pílula -> tomar
    • Pastilha -> chupar
    • Drágea -> tomar
    • Xarope -> tomar
    • Gotas -> tomar
    • Pomada -> aplicar
    • Creme -> aplicar
    • pasta -> aplicar
    • Spray / aerossol -> aplicar
- via de administração - selecionar
    • Oral
    • Sublingual 
    • tópica
- quantidade a ser tomada - campo numérico - 1
- tempo de administração - campo numérico - 8
- quantidade de dias - campo numérico - 7
- enquanto dor - campo boolean - ou vai ser preenchido esse ou quantidade de dias

no final gerar esse texto seguindo o padrão:
tomar {quantidade a ser tomada} {via de administração} 
tomar 1 cápsula via oral a cada 8 horas por 7 dias
ao adicionar prescrição o texto de posologia deve aparecer para o dentista e ser salvo no banco
para o dentista será gerado o tratamento do paciente da seguinte forma (salvar no banco):
{verbo de acordo com a forma farmacêutica} {quantidade a ser tomada} {forma farmacêutica} {via de administração} {tempo de administração} {quantidade de dias}

DENTISTA:
PRESCRIÇÃO:
Nome, data de nascimento e telefone: informações necessárias para o paciente 
Menu Pacientes – Essa seção terá a listagem de pacientes (ordenar por nome asc)
	Na listagem, botões de ação será alterar, deletar e adicionar prescrição 
Menu Prescrições – Essa seção terá a listagem de prescrições (ordenar pela data desc)
	Na listagem, botões de ação será alterar, deletar prescrição
Adicionar nova prescrição tanto na seção de prescrições quanto selecionando um paciente, usar a mesma tela, a diferença é que indo por prescrições o dentista terá que selecionar o paciente com uso de um autocomplete combobox e pelo paciente já entra na página com ele selecionado e não pode alterar o paciente.
Em adicionar prescrição teremos os seguintes campos:
Príncipio ativo – Campo autocomplete combo box que tem como itens os medicamentos do banco
Posologia – Esse campo é preenchido após preencher o campo de cima com a informação do medicamento do banco – Deixar esse desabilitado para obrigar preenchimento do de cima primeiro – Será possível alterar informação preenchida automaticamente
Essas são as informações que serão preenchidas, mas para o paciente vai aparecer essas duas informações mais:




