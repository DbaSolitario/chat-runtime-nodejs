
const socket = io("http://192.168.0.114:3000", {
    autoConnect: true
})

var user = ""

$(document).ready(() => {
    defaultTriggers()
    user = ""
    $("#chat_window").hide()
    $(".alert").hide()
    $('.page').hide()
    formEvents()

    $('#mainForm').on('submit', function (event) {
        event.preventDefault()
        var formData = {
            email: $("#email").val(),
            transportadora: $("#transportadora").val(),
            codigo: $("#codigoRastreio").val()
        }
        $.ajax({
            type: 'POST',
            url: "http://192.168.0.114:3000/sendform",
            data: formData,
            crossDomain: true,
            success: function (result) {
                console.log(result)
                $('.alert-success').show('slow')
                setTimeout(
                    function () {
                        $(".alert-success").hide('slow')
                    }
                    , 5000);
                $("#email").val('')
                $("#transportadora").val('')
                $("#codigoRastreio").val('')
            },
            error: function (e) {
                console.log(e)
                $('.alert-danger').show('slow')
                setTimeout(
                    function () {
                        $(".alert-danger").hide('slow')
                    }
                    , 5000);
            }
        })
    })

    $('#btn-chat').on('click', function (event) {
        socket.emit("enviar mensagem", $("#btn-input").val(), function () {
            $(".msg_container_base").append(`
            <div class="row msg_container base_sent">
                    <div class="col-md-10 col-xs-10">
                        <div class="messages msg_sent">
                            <p>${$("#btn-input").val()}</p>
                            <time datetime="${pegarDataAtual()}">${pegarDataAtual()}</time>
                        </div>
                    </div>
                    <div class="col-md-2 col-xs-2 avatar">
                        <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
                    </div>
                </div>
            `)
            $("#btn-input").val('');
        });
    })

    $('#ativarChat').on('click',function(){
        if($('.page').attr('style') == ''){
            $('#ativarChat').text("Clique Aqui para logar no chat") 
            $('.page').hide()
            $("#mainForm").show()
        }
        else{
            $('#ativarChat').text("Clique Aqui para fechar o formulário") 
            $('.page').show()
            $("#mainForm").hide()
        }
    })

    $("#login").submit(function (e) {
        e.preventDefault();
        if($(this).find(".apelido").val() != ''){
            socket.emit("entrar", $(this).find(".apelido").val(), function (valido) {
                if (valido) {
                    $(".page").hide();
                    $("#chat_window").show();
                    user = $(this).find(".apelido").val()
                    $('#ativarChat').hide()
                     $("#mainForm").show()
                } else {
                    $(".apelido").val("");
                    alert("Nome já utilizado nesta sala");
                }
            });
        }
        
    });

})

function pegarDataAtual() {
    var dataAtual = new Date();
    var dia = (dataAtual.getDate() < 10 ? '0' : '') + dataAtual.getDate();
    var mes = ((dataAtual.getMonth() + 1) < 10 ? '0' : '') + (dataAtual.getMonth() + 1);
    var ano = dataAtual.getFullYear();
    var hora = (dataAtual.getHours() < 10 ? '0' : '') + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes() < 10 ? '0' : '') + dataAtual.getMinutes();
    var segundo = (dataAtual.getSeconds() < 10 ? '0' : '') + dataAtual.getSeconds();

    var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
    return dataFormatada;
}

function defaultTriggers() {
    socket.on('connect', () => {
        console.log('Connected')
    })
    socket.on('disconnect', () => {
        console.log('Disconnected')
    })
    socket.on('dataupdate', (data) => {
        //$('body').html(data.data)
        console.log(data)
    })

    socket.on("atualizar mensagens", function (mensagem) {
        var avatar = ` 
            <div class="col-md-2 col-xs-2 avatar">
                <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">
            </div>`
        $(".msg_container_base").append(`
                    <div class="row msg_container base_receive">
                            ${(mensagem.user != undefined ? avatar : '')}
                            <div class="col-md-10 col-xs-10">
                                <div class="messages msg_sent">
                                    <p>${(mensagem.user != undefined ? mensagem.user + ' - ' : '')} ${mensagem.mensagem}</p>
                                    <time datetime="${mensagem.horas}">${mensagem.horas}</time>
                                </div>
                            </div>
                        </div>
        `)
    });
}

function formEvents() {

    $(document).on('click', '.panel-heading span.icon_minim', function (e) {
        var $this = $(this);
        if (!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    });
    $(document).on('focus', '.panel-footer input.chat_input', function (e) {
        var $this = $(this);
        if ($('#minim_chat_window').hasClass('panel-collapsed')) {
            console.log($this)
            $this.parents('.panel').find('.panel-body').slideDown();
            $('#minim_chat_window').removeClass('panel-collapsed');
            $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    });

    var current = null;
    document.querySelector('#email').addEventListener('focus', function (e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: 0,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '240 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
    document.querySelector('#password').addEventListener('focus', function (e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: -336,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '240 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
    document.querySelector('#submit').addEventListener('focus', function (e) {
        if (current) current.pause();
        current = anime({
            targets: 'path',
            strokeDashoffset: {
                value: -730,
                duration: 700,
                easing: 'easeOutQuart'
            },
            strokeDasharray: {
                value: '530 1386',
                duration: 700,
                easing: 'easeOutQuart'
            }
        });
    });
}
