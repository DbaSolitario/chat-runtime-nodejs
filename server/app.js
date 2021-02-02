var express = require('express');
const app = express()
const server = require('http').createServer(app)
const mysql = require('mysql');
const path = require('path');
var bodyParser = require('body-parser');

var usuarios = [];
var ultimas_mensagens = [];

const io = require('socket.io')(server, {
    origins: ['*'],
    cors: {
        origin: "*",
        credentials: true
    },
    transports: ['websocket', 'polling', 'flashsocket']
})

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) =>{
    res.sendFile('/clientDir/index.html');
})
app.use(express.static(path.join('/clientDir')));

app.post('/sendform', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    con.query(`insert into formdatarequest(email, transportadora, codigoRastreio) values ('${req.body.email}', '${req.body.transportadora}', '${req.body.codigo}') `, (err,rows) => {
        if(err) throw err;
      });
    res.send(req.body)
})

io.on('connection', (socket) => {

    socket.join('client')

    console.log('New Client Connected - ID:' + socket.id)

    socket.on("entrar", function (apelido, callback) {
        if (!(apelido in usuarios)) {
            socket.apelido = apelido;
            usuarios[apelido] = socket;
            mensagem = {
                mensagem: apelido + " acabou de entrar na sala",
                horas: pegarDataAtual()
            }
            for (indice in ultimas_mensagens) {
                socket.emit("atualizar mensagens", ultimas_mensagens[indice]);
            }
            io.sockets.emit("atualizar mensagens", mensagem);
            armazenaMensagem(mensagem);
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on("enviar mensagem", function (mensagem_enviada, callback) {
        mensagem = {
            mensagem: mensagem_enviada,
            horas: pegarDataAtual(),
            user: socket.apelido
        }
        socket.broadcast.emit("atualizar mensagens", mensagem)
        armazenaMensagem(mensagem);

        callback();
    });

    socket.on("disconnect", function () {
        if(socket.apelido != undefined){
            delete usuarios[socket.apelido];
            mensagem = {
                mensagem:  socket.apelido + " Saiu da Sala",
                horas: pegarDataAtual()
            }
            armazenaMensagem(mensagem);
            io.sockets.emit("atualizar mensagens", mensagem);
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

function armazenaMensagem(mensagem) {
    if (ultimas_mensagens.length > 20) {
        ultimas_mensagens.shift();
    }

    ultimas_mensagens.push(mensagem);
}

server.listen(3000)

console.log('Server Listening on 3000')


// DB CONNECTION PART

const con = mysql.createConnection({
    host: 'den1.mysql2.gear.host',
    user: 'facul',
    password: 'Mk294_8COY~7',
    database:'facul'
  });
  
  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });