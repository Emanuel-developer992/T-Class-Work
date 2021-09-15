//EXECUTAR AO CARREGAR A PÁGINA
window.onload = function() {
    offTable();
    usuario('gestor');
    navegation();

    triagem();
    colleagueSelect();

};

function navegation() {

    var nState = getWKNumState(); 

    if (nState != 0) {
        //Tabela principal de requisitos
        $('#div_zoom').addClass('nav-close');
        $('#div_tb').removeClass();
        $('#div_tb').addClass('scrolly');

        var tb1Row = tb_requisito[0].rows.length - 2;
        var tb2Row = $('#tb_registroTcss')[0].rows.length -2;

        for (var i = 1; i <= tb1Row; i++) {
            cssStatus('tb_status___'+i, 'tb_status___'+i);
        }

        for (var i = 1; i <= tb2Row; i++) {
            cssStatus('tb_statusR___'+i, 'tb_statusR___'+i);
        }
    }
};

// Trás todos os requisitos de acordo com a norma selecionada
$(document).on('change', "#norma",
    function requisitoBusca() {

        try {

            //Condição de Busca
            var tb_name = "tb_registro";
            var tbdoc = ($("#norma").val()[0]); // Parâmetros dentro da tabela
            

            //Filtro de Busca 
            var tbConstraint = DatasetFactory.createConstraint("tablename", tb_name, tb_name, ConstraintType.MUST); // Usar sempre tablename
            var docConstraint = DatasetFactory.createConstraint("tb_norma", tbdoc, tbdoc, ConstraintType.MUST); // Nome do campo a uzar como parâmetro
            var arrayConstraint = new Array(tbConstraint, docConstraint); // Tranformas as duas constraint em Array

            // Busca no Dataset + Condições de Filtro
            var array = DatasetFactory.getDataset("DSFormulariodeCadastrodeRequisito", null, arrayConstraint, null);7

            var rowCount = array.values.length;

            for (var i = 0; i < rowCount; i++) {

                wdkAddChild('tb_requisito'); 

                var nTb = i+1;

                var reqRequisito = array.values[i].tb_req;
                var reqOrient = array.values[i].tb_ori;
                var reqDescricao = array.values[i].tb_desc;
                var reqAplic = array.values[i].tb_aplic;
                var reqStatus = "Em Aberto";
                

                $('#tb_requisito___'+nTb).val(reqRequisito);
                $('#tb_orient___'+nTb).val(reqOrient);
                $('#tb_desc___'+nTb).val(reqDescricao);
                $('#tb_aplic___'+nTb).val(reqAplic);
                $('#tb_status___'+nTb).val(reqStatus);
                $('#tb_norma___'+nTb).val(tbdoc);
                $('#tb_resp___'+nTb).val('-');
            }

            $('#div_zoom').addClass('nav-close');
            $('#div_tb').removeClass();
            $('#div_tb').addClass('scrolly');

        }
        catch (e) {
            alert('Ops houve um erro inesperado... -'+e);
        }
    }

);

//CSS do status filtro
$(document).on('change', "#status",
    function attStatus() {

        cssStatus('status', 'status');
    }
);

//CSS do Responsável Filtro
$(document).on('change', "#f_resp",
    function attResp() {
        cssResp();
    }
);

function cssStatus(st, cSt) {

    var status = $('#'+st).val();

    if (status == 'Em Aberto') {
        status = 1;
    }
    else if (status == 'Finalizado') {
        status = 2;
    }
    else if (status == 'Atrasado') {
        status = 3;
    }

    if (status == 1) {

        $('#'+cSt).removeClass();
        $('#'+cSt).addClass('form-control aberto-input2');
    }
    else if (status == 2) {
       
        $('#'+cSt).removeClass();
        $('#'+cSt).addClass('form-control completo-input2');
    }
    else if (status == 3) {
       
        $('#'+cSt).removeClass();
        $('#'+cSt).addClass('form-control atrasado-input2');
    }
    else {
        $('#'+cSt).removeClass();
        $('#'+cSt).addClass('form-control');
    }
};

function cssResp() {
    var resp = $('#f_resp').val();
    if (resp == "") {
        $('#f_resp').removeClass();
        $('#f_resp').addClass('form-control');
    }
    else {
        $('#f_resp').removeClass();
        $('#f_resp').addClass('form-control resp2-input');
    }
}

//Ocutar a tabela sem informações
function offTable() {

    var nRow = $('tb_requisito tr').length;

    if (nRow < 3) {

        $('#div_tb').addClass('nav-close');

    }
};

//Filtro
var count;
function validation(r, a, s, rs) {

    var input = $('#tb_requisito input');

    input.splice(0, 1);
    input.splice(0, 1);
    input.splice(0, 1);

    count = input.length;
    var nFiltro = 0;
    var nR = 0;
    var nA = 0;
    var nS = 0;
    var nRS = 0;
    var array = new Array();
    var array2 = new Array();
    

    for (var i = 0; i < count; i++) {

       if (r != "" || a != "" || s != "" || rs != "") {

           if (r != "" && r == input[i].value) {
               array.push(input[i].id);
               if (nR == 0) {
                   nR++
               }
           }

           if (a != "" && a == input[i].value) {
               array.push(input[i].id);
               if (nA == 0) {
                   nA++;
               }
           }

           if (s != "" && s == input[i].value) {
               array.push(input[i].id);
               if (nS == 0) {
                   nS++;
               }
           }

           if (rs != "" && rs == input[i].value) {
               array.push(input[i].id);
               if (nRS == 0) {
                   nRS++;
               }
           }
       }
    }

    if (r != "") {
        if (nR == 0) {
            nR++;
        }
    }
    if (a != "") {
        if (nA == 0) {
            nA++;
        }
    }
    if (s != "") {
        if (nS == 0) {
            nS++;
        }
    }
    if (rs != "") {
        if (nRS == 0) {
            nRS++;
        }
    }

    nFiltro = nR+nA+nS+nRS;

    if (nFiltro == 1) {
        array2 = array;
    }
    else if (nFiltro == 2) {

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length; j++) {
                var ai = array[i].replace(/[^\d]+/g,'');
                var aj = array[j].replace(/[^\d]+/g,'');
                
                if (i != j) {
                    if (ai == aj) {
                        array2.push(ai);
                    }
                }
            }
        }
    }
    else if (nFiltro == 3) {

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length; j++) {
                for (var h = 0; h < array.length; h++) {

                    var ai = array[i].replace(/[^\d]+/g,'');
                    var aj = array[j].replace(/[^\d]+/g,'');
                    var ah = array[h].replace(/[^\d]+/g,'');
                    
                    if (i != j && i != h && j != h) {
                        if (ai == aj && ai == ah && aj == ah) {
                            array2.push(ai);
                        }
                    }
                }
            }
        }
    }
    else if (nFiltro == 4) {

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length; j++) {
                for (var h = 0; h < array.length; h++) {
                    for (var z = 0; z < array.length; z++) {

                        var ai = array[i].replace(/[^\d]+/g,'');
                        var aj = array[j].replace(/[^\d]+/g,'');
                        var ah = array[h].replace(/[^\d]+/g,'');
                        var az = array[z].replace(/[^\d]+/g,'');
                        
                        if (i != j && i != h && i != z && j != h && j != z && h != z) {
                            if (ai == aj && ai == ah && ai == az) {
                                array2.push(ai);
                            }
                        }
                    }
                }
            }
        }
    }

    return array2;
};

var id = [];
var full = 0;
function filter(req, apli, st, res) {

    var constraint = validation(req, apli, st, res);

    var nTb = new Array();

    for (var i = 0; i < constraint.length; i++) {
        var reqf = constraint[i].replace(/[^\d]+/g,'');
        if (reqf != "") {
            nTb.push(reqf);
        }
    }

    var n = new Array();
    for (var i = 0; i < nTb.length; i++) {

        var x = parseFloat(nTb[i]); //Numero do ID
        var y = parseFloat(count - 1); //Total de elementos
        var z = parseFloat(y/5); //Relação de elementos com conjunto de 5
        var result = (x/z)*y;

        n.push(Math.round(result));
        id.push(x);
        
    }
    return n;
}

var nCountWDK = 0;
var nResult = 0;
function filtroTabela() {

    var table = $('#tb_requisito input');

    table.splice(0, 1);
    table.splice(0, 1);
    table.splice(0, 1);

    var table2 = $('#tb_requisito textarea');

    open_w1();
    
    var requisito = $('#requisito').val();
    var aplicabildade = $('#aplic').val();
    var status = $('#status').val();
    var responsavel = $('#f_resp').val();

    if (requisito == "" && aplicabildade == "" && status == "" && responsavel == "") {
        full++;
    }

    if (aplicabildade == 1) {
        aplicabildade = 'Mandatório';
    }
    else if (aplicabildade == 2) {
        aplicabildade = 'Opcional';
    }

    if (status == 1) {
        status = 'Em Aberto';
    }
    else if (status == 2) {
        status = 'Finalizado';
    }
    else if (status == 3) {
        status = 'Atrasado';
    }

    //Remove Duplicatas input
    var a = filter(requisito, aplicabildade, status, responsavel);
    var b = [];

    for (var i = 0; i < a.length; i++) {
        b[a[i]] = a[i];
    }

    var arr = [];
    for (var key in b) {
        arr.push(key);  
    }

    //Remove Duplicatas textarea
    var c = id;
    var d = [];

    for (var i = 0; i < c.length; i++) {
        d[c[i]] = c[i];
    }

    var att = [];
    for (var key2 in d) {
        att.push(key2);  
    }

    var tb = $('#tb_filter tr');
    if (tb.length > 2) {
        for (var i = 2; i < tb.length; i++) {
            tb[i].remove();
        }
    }

    if (full == 0) {

        for (var i = 0; i < arr.length; i++) {
            
            var n4 = arr[i];   //Responsável
            var n5 = parseInt(n4) +1;   //Status
            var n3 = n4 -1;    //Aplicabilidade
            var n2 = n3 -1;    //Requisito
            var n1 = n2 -1;    //Norma
            var nTxt = 3+(att[i] -1)*2; //Descrição do Requisito
    
            wdkAddChild('tb_filter');
    
            nCountWDK++;
    
            $('#filter_norma___'+nCountWDK).val(table[n1].value);
            $('#filter_requisito___'+nCountWDK).val(table[n2].value);
            $('#filter_desc___'+nCountWDK).val(table2[nTxt].value);
            $('#filter_aplic___'+nCountWDK).val(table[n3].value);
            $('#filter_resp___'+nCountWDK).val(table[n4].value);
            $('#filter_status___'+nCountWDK).val(table[n5].value);
            
            cssStatus('filter_status___'+nCountWDK, 'filter_status___'+nCountWDK);
    
        }
        nResult = arr.length;
    }
    else {

        var nRow = table.length - 2;
        var n = nRow/5;
 
        for (var i = 1; i < n; i++) {

            var vetor = ((i/(nRow/5))*(nRow))+1;

            var nn5 = vetor;      //Status
            var nn4 = vetor-1;    //Responsável
            var nn3 = vetor-2;    //Aplicabilidade
            var nn2 = vetor-3;    //Requisito
            var nn1 = vetor-4;    //Norma
           

            wdkAddChild('tb_filter');
    
            nCountWDK++;
    
            $('#filter_norma___'+nCountWDK).val(table[nn1].value);
            $('#filter_requisito___'+nCountWDK).val(table[nn2].value);
            $('#filter_desc___'+nCountWDK).val(table2[i].value);
            $('#filter_aplic___'+nCountWDK).val(table[nn3].value);
            $('#filter_resp___'+nCountWDK).val(table[nn4].value);
            $('#filter_status___'+nCountWDK).val(table[nn5].value);
            
            cssStatus('filter_status___'+nCountWDK, 'filter_status___'+nCountWDK);

            
        }
        nResult = n;
        
    }

    $(".editar").bind("click", Editar);

    if (nResult == 0) {
        $('#img_vazio').removeClass('nav-close');
        $('#div_bodyModal').addClass('nav-close');
    }
    else {
        $('#img_vazio').addClass('nav-close');
        $('#div_bodyModal').removeClass('nav-close');
    }

    var title = document.getElementById('div_result');
    title.innerHTML = '<h4 class="modal-title">'+nResult+' Resultado(s) Encontrados...</h4>';

    

    
};

//Abrir e editar conteúdos
var thisRow;
function Editar() {

    thisRow = $(this).parent().parent();

    var td0 = thisRow[0].innerHTML;
    var tratamento = td0.replaceAll("</td>","");
    var arrayThis = tratamento.split("<td>");

    /*var norma = arrayThis[1].substring(11, 27);*/
    var req = (arrayThis[2].substring(11, 33)).replace('"','');
    var desc = (arrayThis[3].substring(14, 31)).replace('"','');
    var aplic = (arrayThis[4].substring(11, 29)).replace('"','');
    var resp = (arrayThis[5].substring(11, 28)).replace('"','');
    var status = (arrayThis[6].substring(11, 30)).replace('"','');

    var a = $('#'+aplic).val();
    if (a == 'Mandatório') {
        a = 1;
    }
    else {
        a = 2;
    }

    var s = $('#'+status).val();
    if (s == 'Em Aberto') {
        s = 1;
    }
    else if (s == 'Finalizado') {
        s = 2;
    }
    else {
        s = 3;
    }

    $('#requisito').val($('#'+req).val());
    $('#descRequisito').val($('#'+desc).val());
    $('#aplic').val(a);
    $('#f_resp').val($('#'+resp).val());
    $('#status').val(s);
    cssStatus('status', 'status');
    cssResp();
    
    $('#requisito').prop('disabled', true);
    $('#aplic').attr("disabled", true);
    $('#f_resp').attr("disabled", true);
    $('#status').attr("disabled", true);

    exit_w1();
    $('#btn_cancelar').removeClass('nav-close');

    if (getWKNumState() != 2) {
    $('#btn_salvar').removeClass('nav-close');
    }
    $('#btn_filtrar').addClass('nav-close');

    var tb = $('#tb_filter tr');
    if (tb.length > 2) {
        for (var i = 2; i < tb.length; i++) {
            tb[i].remove();
        }
    }
    
}

function cancelarAc() {

    $('#requisito').prop('disabled', false);
    $('#aplic').attr("disabled", false);
    $('#f_resp').attr("disabled", false);
    $('#status').attr("disabled", false);
    $('#btn_cancelar').addClass('nav-close');
    if (getWKNumState() != 2) {
    $('#btn_salvar').addClass('nav-close');
    }
    $('#btn_filtrar').removeClass('nav-close');

    $('#requisito').val("");
    $('#aplic').val("");
    $('#status').val("");
    $('#descRequisito').val("");
    $('#acao').val("");
    $('#resultado').val("");
    $('#resultado').val("");
    $('#prazo').val("");
    $('#realizado').val("");
    $('#f_resp').val("");
    $('#resp').val("");
    $('#area').val("");
    cssStatus('status', 'status');
    cssResp();
};

//REGISTRO
var nRegisterCount =0;
function salvarAc() {

    var norma = $("#norma").val()[0];
    var requisito = $('#requisito').val();
    var acao = $('#acao').val();
    var respon = $('#gestor').val();
    var resultado = $('#resultado').val();
    var prazo = $('#prazo').val();
    var realizado = $('#realizado').val();
    var area = $('#area').val();
    var resp = $('#f_resp').val();
    var status = $('#status').val();

    if (status == 1) {
        status = 'Em Aberto'
    }
    else if (status == 2) {
        status = 'Finalizado'
    }
    else {
        status = 'Atrasado'
    }

    var dia_closure = prazo.substring(8, 12);
    var mes_closure = prazo.substring(5, 7);
    var ano_closure = prazo.substring(0, 4);

    var prazoE = dia_closure + "/" + mes_closure + "/" + ano_closure;


    var dia_closure = realizado.substring(8, 12);
    var mes_closure = realizado.substring(5, 7);
    var ano_closure = realizado.substring(0, 4);

    if (dia_closure == "" && mes_closure == "" && ano_closure == "") {
        var realizadoE = "";
    }
    else {
        var realizadoE = dia_closure + "/" + mes_closure + "/" + ano_closure;
    }

    wdkAddChild('tb_registroTcss');

    if (getWKNumState() == 1) {
        var rowTable = $('#tb_registroTcss')[0].rows.length;
        nRegisterCount = rowTable - 2;

    }
    else {
        nRegisterCount++;
    }

    $('#tb_normaR___'+nRegisterCount).val(norma);
    $('#tb_requisitoR___'+nRegisterCount).val(requisito);
    $('#tb_acao___'+nRegisterCount).val('Ação');
    $('#t_tb_acao___'+nRegisterCount).val(acao+" - Gestor "+respon);
    $('#tb_responsavel___'+nRegisterCount).val(resp);
    $('#tb_area___'+nRegisterCount).val(area);
    $('#tb_resultado___'+nRegisterCount).val('Resultado');
    $('#t_tb_result___'+nRegisterCount).val(resultado);
    $('#tb_prazo___'+nRegisterCount).val(prazoE);
    $('#tb_realizado___'+nRegisterCount).val(realizadoE);
    $('#tb_statusR___'+nRegisterCount).val(status);

    cssStatus('status','tb_statusR___'+nRegisterCount);

    var idSelect = $('#requisito').val();
    var table = $('#tb_requisito tr');
    var tbRow = table.length - 2;

    for (var i = 1; i <= tbRow; i++) {

        var id = $('#tb_requisito___'+i).val();

        if (id == idSelect) {
            $('#tb_status___'+i).val(status);
            $('#tb_resp___'+i).val(resp);
            cssStatus('status','tb_status___'+i);
        }

    }

    cancelarAc();
};

//Valida antes de Salvar
function saveValition() {
    var acao = $('#acao').val();
    //var result = $('#resultado').val();
    var prazo = $('#prazo').val();
    var resp = $('#resp').val();

    if (acao == "" || prazo == "" || resp == "") {
        alert('Preencha todos os campos corretamente');
    }
    else {
        salvarAc();
    }
};

// Status automático de prazos e encerramentos
$(document).on('change', "#prazo",
    function atualizaStatus() {

        var hoje = parseInt(hojeCalculo());
        var prazo = parseInt((($('#prazo').val()).replace('-',"")).replace('-',""));
        if ($('#realizado').val() == "" ) {
            var realizado = "";
        }
        else {
            var realizado = parseInt((($('#realizado').val()).replace('-',"")).replace('-',""));
        }
        
       if (realizado == "") {
           if (hoje <= prazo) {
               $('#status').val(1);
           }
           else {
               $('#status').val(3);
           }
       }
       else {
           if (realizado <= prazo) {
            $('#status').val(2);
           }
           else {
            $('#status').val(3);
           }
       }

       cssStatus('status', 'status');        
    }
);

$(document).on('change', "#realizado",
    function atualizaStatus() {

        var hoje = parseInt(hojeCalculo());
        var prazo = parseInt((($('#prazo').val()).replace('-',"")).replace('-',""));
        if ($('#realizado').val() == "" ) {
            var realizado = "";
        }
        else {
            var realizado = parseInt((($('#realizado').val()).replace('-',"")).replace('-',""));
        }        
        
       if (realizado == "") {
           if (hoje <= prazo) {
               $('#status').val(1);
           }
           else {
               $('#status').val(3);
           }
       }
       else {
           if (realizado <= prazo) {
            $('#status').val(2);
           }
           else {
            $('#status').val(3);
           }
       }

       cssStatus('status', 'status');        
    }
);

$(document).on('change', "#resp",
    function atualizaResp() {
        var resp = $('#resp').val();
        $("#f_resp").val(resp);
        cssResp();
    }
);

//MODAL
//Abrir
function open_w1() {

    $("#W1").removeClass("nav-close");
}
//Fechar
function exit_w1() {

    $("#W1").addClass("nav-close");

}

//Usuário
function usuario(user) {

    var us = getWKUser();

    //Monta as constraints para consulta
    var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", us, us, ConstraintType.MUST);

    var constraints   = new Array(c1);
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);
     
    $('#'+user).val(dataset.values[0].colleagueName);

}

//DATA DE HOJE
function hojeCalculo() {

    // Obtém a data/hora atual
	var data = new Date();
	
    // Guarda cada pedaço em uma variável
    var dia = data.getDate();           // 1-31
    var mes = data.getMonth() +1;          // 0-11 (zero=janeiro)
    var ano4 = data.getFullYear();      // 4 dígitos
    
    // Formata a data e a hora (note o mês + 1)

    if (dia < 10) {
        dia = '0'+dia;
    }
    if (mes < 10) {
        mes = '0'+mes;
    }

    str_data = ((ano4+'-'+mes+'-'+dia).replace('-',"")).replace('-',"");

    return str_data;

};

function triagem() {
    if (getWKNumState() == 2) {
        $('#div_column2').addClass('nav-close');
        $('#div_column3').removeClass('nav-close');
    }
}

function colleagueSelect() {

    var c1 = DatasetFactory.createConstraint("colleagueGroupPK.groupId", "Tondini", "Tondini", ConstraintType.MUST);

    var constraints = new Array(c1);
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("colleagueGroup", null, constraints, null);
    

    for (var i = 0; i < dataset.values.length; i++) { 

        $('#resp').append($('<option>', {

            value: dataset.values[i]["colleagueGroupPK.colleagueId"],
            text: dataset.values[i]["colleagueGroupPK.colleagueId"]
        }));

        $('#f_resp').append($('<option>', {

            value: dataset.values[i]["colleagueGroupPK.colleagueId"],
            text: dataset.values[i]["colleagueGroupPK.colleagueId"]
        }));
    }

}