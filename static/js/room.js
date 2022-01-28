console.log('Hello guys');

var usernameInput = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');
var username;
var webSocket;


btnJoin.addEventListener('click', () => {
    username = usernameInput.value;
    console.log('username: ', username);
    if (username == ''){
        return;
    };

    usernameInput.value = '';
    usernameInput.disabled = true;
    usernameInput.style.visibility = 'hidden';

    btnJoin.disabled = true;
    btnJoin.style.visibility = 'hidden';

    var labelUsername = document.querySelector('#label-username');
    labelUsername.innerHTML = username;

    var loc = window.location;
    var wsStart = window.location.protocol == "https:" ? "wss://" : "ws://";

    var endPoint = wsStart + loc.host + loc.pathname;
    console.log(endPoint);

    webSocket = new WebSocket(endPoint);
    webSocket.addEventListener('open', (e) => {
        console.log('Connection Open');
        newPlayer(username);
    });
    webSocket.addEventListener('close', (e) => {
        console.log('Connection Closed')
    });
    webSocket.addEventListener('error', (e) => {
        console.log('Error', e)
    });

    webSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        console.log(data);
        if (data.playerData) {
<<<<<<< HEAD
            createPlayer(data.playerData);
        };
        if (data.otherPlayers) {
            createOtherPlayers(data.otherPlayers);
=======
            createPlayer(data.playerData, data.otherPlayers);
>>>>>>> 09e8ae856b36d180f93968f1cc7470a60fe872da
        };
        if (data.playerRemoved) {
            removePlayer(data.playerRemoved);
        };
        if (data.player) {
            changePosition(data.player, data.posX, data.posY);
        };
    };
});

function newPlayer(player) {
    webSocket.send(JSON.stringify({
        'new-player': player,
    }));
};

<<<<<<< HEAD
var BeginningPosX = 0;
var BeginningPosY = 0;
var edgeX = 560;
var edgeY = 360;
function initGame(){
    document.onkeydown = KeyPressed;
    function KeyPressed(k) {
        Player = document.querySelector('#' + username);
        var LeftBtn = 37;
        var RightBtn = 39;
        var UpBtn = 38;
        var DownBtn = 40;
        var bomb = 90;

        console.log(k.keyCode);
        switch (k.keyCode) {
            case RightBtn:
                console.log(BeginningPosX);
                BeginningPosX = BeginningPosX += 40;
                if (BeginningPosX > edgeX) {
                    BeginningPosX = edgeX;
                };
                Player.style.left = BeginningPosX + "px";
                webSocket.send(JSON.stringify({
                    'player': Player.id,
                    'pos-x': BeginningPosX,
                    'pos-y': BeginningPosY,
                }));
                break;
            case LeftBtn:
                console.log(BeginningPosX);
                BeginningPosX = BeginningPosX -= 40;
                if (BeginningPosX < 0) {
                    BeginningPosX = 0;
                };
                Player.style.left = BeginningPosX + "px";
                webSocket.send(JSON.stringify({
                    'player': Player.id,
                    'pos-x': BeginningPosX,
                    'pos-y': BeginningPosY,
                }));
                break;
            case UpBtn:
                console.log(BeginningPosY);
                BeginningPosY = BeginningPosY -= 40;
                if (BeginningPosY < 0) {
                    BeginningPosY = 0;
                };
                Player.style.top = BeginningPosY + "px";
                webSocket.send(JSON.stringify({
                    'player': Player.id,
                    'pos-x': BeginningPosX,
                    'pos-y': BeginningPosY,
                }));
                break;
            case DownBtn:
                console.log(BeginningPosY);
                BeginningPosY = BeginningPosY += 40;
                if (BeginningPosY > edgeY) {
                    BeginningPosY = edgeY;
                };
                Player.style.top = BeginningPosY + "px";
                webSocket.send(JSON.stringify({
                    'player': Player.id,
                    'pos-x': BeginningPosX,
                    'pos-y': BeginningPosY,
                }));
                break;
            case bomb:
                console.log('Boom')
=======
function createPlayer(user, users) {
    console.log(Object.keys(user));
    var arena = document.querySelector('#background');
    var Player = document.createElement('div');
    Player.id = Object.keys(user);
    Player.className = 'players';
    Player.style.left = users.pos_x + "px";
    Player.style.top = users.pos_y + "px";
    arena.appendChild(Player);
    if (username === Object.keys(user)){
        createOtherPlayers(users, user);
    };
    initGame(Player);
};

function createOtherPlayers(users, new_player) {
    var arena = document.querySelector('#background');
    console.log(users)
    for (player in users) {
        if (player != new_player) {
            console.log(player, users[player]);
            var Player = document.createElement('div');
            Player.id = player;
            Player.className = 'players';
            Player.style.left = users[player].pos_x + "px";
            Player.style.top = users[player].pos_y + "px";
            arena.appendChild(Player);
>>>>>>> 09e8ae856b36d180f93968f1cc7470a60fe872da
        };
    };
};

function changePosition(player, x, y) {
    Player = document.querySelector('#' + player);
    Player.style.left = x + "px";
    Player.style.top = y + "px";
};
<<<<<<< HEAD

function createPlayer(user) {
    var arena = document.querySelector('#background');
    var Player = document.createElement('div');
    Player.id = user;
    Player.className = 'players';
    arena.appendChild(Player);
    initGame();
};

function createOtherPlayers(users) {
    var arena = document.querySelector('#background');
    for (player in users) {
        var Player = document.createElement('div');
        Player.id = player;
        Player.className = 'players';
        Player.style.left = users[player].pos_x + "px";
        Player.style.top = users[player].pos_y + "px";
        arena.appendChild(Player);
    };
};

function removePlayer(user) {
    var player = document.querySelector('#' + user);
    player.parentNode.removeChild(player);
};

window.onbeforeunload = function() {
    // Send exit message to websocket
    webSocket.send(JSON.stringify({
        'remove-player': username,
    }));
    window.setTimeout(function () {
        window.location = '/';
    }, 0);
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser
};
=======

function initGame(jogador){
    console.log("created");
    Player = document.querySelector('#' + jogador.id);
    console.log('teste', Player.style.left);
    var BeginningPosX = Player.style.left;
    var BeginningPosY = Player.style.top;
    var edgeX = 560;
    var edgeY = 360;
    document.onkeydown = KeyPressed;
    function KeyPressed(k) {
        console.log(k.keyCode)
        var LeftBtn = 37;
        var RightBtn = 39;
        var UpBtn = 38;
        var DownBtn = 40;
        var bomb = 90;

        switch (k.keyCode) {
            case RightBtn:
                console.log(BeginningPosX);
                BeginningPosX = BeginningPosX += 40;
                if (BeginningPosX > edgeX) {
                    BeginningPosX = edgeX;
                };
                Player.style.left = BeginningPosX + "px";
                break;
            case LeftBtn:
                console.log(BeginningPosX);
                BeginningPosX = BeginningPosX -= 40;
                if (BeginningPosX < 0) {
                    BeginningPosX = 0;
                };
                Player.style.left = BeginningPosX + "px";
                break;
            case UpBtn:
                console.log(BeginningPosY);
                BeginningPosY = BeginningPosY -= 40;
                if (BeginningPosY < 0) {
                    BeginningPosY = 0;
                };
                Player.style.top = BeginningPosY + "px";
                break;
            case DownBtn:
                console.log(BeginningPosY);
                BeginningPosY = BeginningPosY += 40;
                if (BeginningPosY > edgeY) {
                    BeginningPosY = edgeY;
                };
                Player.style.top = BeginningPosY + "px";
                break;
        };
        webSocket.send(JSON.stringify({
            'player': Player.id,
            'pos-x': BeginningPosX,
            'pos-y': BeginningPosY,
        }));
    };
};
>>>>>>> 09e8ae856b36d180f93968f1cc7470a60fe872da
