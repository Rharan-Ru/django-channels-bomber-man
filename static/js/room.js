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
        if (data.playerData) {
            createPlayer(data.playerData);
        };
        if (data.otherPlayers) {
            createOtherPlayers(data.otherPlayers);
        };
        if (data.playerRemoved) {
            removePlayer(data.playerRemoved);
        };
        if (data.player) {
            changePosition(data.player, data.posX, data.posY);
        };
        if (data.bomb) {
            createBomb(data.bomb);
        };
    };
});

function newPlayer(player) {
    webSocket.send(JSON.stringify({
        'new-player': player,
    }));
};

function sendCreateBomb(position) {
    webSocket.send(JSON.stringify({
        'bomb': position,
    }));
};

function initGame(user){
    if (user === username) {
        var BeginningPosX = 0;
        var BeginningPosY = 0;
    };
    var edgeX = 560;
    var edgeY = 360;
    document.onkeydown = KeyPressed;
    function KeyPressed(k) {
        Player = document.querySelector('#' + username);
        var LeftBtn = 37;
        var RightBtn = 39;
        var UpBtn = 38;
        var DownBtn = 40;
        var bomb = 90;
        switch (k.keyCode) {
            case RightBtn:
                var teste = BeginningPosX + 40;
                var x_y = `[${teste}px,${BeginningPosY}px]`;
                var colision = verifyColision(x_y);
                if (colision != true) {
                    if (teste > edgeX) {
                        BeginningPosX = edgeX;
                        break;
                    };
                    BeginningPosX = BeginningPosX += 40;
                    sendMove();
                    break;
                };
                Player.style.left = BeginningPosX + "px";
                break;
            case LeftBtn:
                var teste = BeginningPosX - 40;
                var x_y = `[${teste}px,${BeginningPosY}px]`;
                var colision = verifyColision(x_y);
                if (colision != true) {
                    if (teste < 0) {
                        BeginningPosX = 0;
                        break;
                    };
                    BeginningPosX = BeginningPosX -= 40;
                    sendMove();
                    break;
                };
                Player.style.left = BeginningPosX + "px";
                break;
            case UpBtn:
                var teste = BeginningPosY - 40;
                var x_y = `[${BeginningPosX}px,${teste}px]`;
                var colision = verifyColision(x_y);
                if (colision != true) {
                    if (teste < 0) {
                        BeginningPosY = 0;
                        break;
                    };
                    BeginningPosY = BeginningPosY -= 40;
                    sendMove();
                    break;
                };
                Player.style.top = BeginningPosY + "px";
                break;
            case DownBtn:
                var teste = BeginningPosY + 40;
                var x_y = `[${BeginningPosX}px,${teste}px]`;
                var colision = verifyColision(x_y);
                if (colision != true) {
                    if (teste > edgeY) {
                        BeginningPosY = edgeY;
                        break;
                    };
                    BeginningPosY = BeginningPosY += 40;
                    sendMove();
                    break;
                };
                Player.style.top = BeginningPosY + "px";
                break;
            case bomb:
                console.log('Boom');
                sendCreateBomb({'x': BeginningPosX, 'y': BeginningPosY});
                break;
        };
    };
    function sendMove() {
        webSocket.send(JSON.stringify({
            'player': Player.id,
            'pos-x': BeginningPosX,
            'pos-y': BeginningPosY,
        }));
    };
    function verifyColision(x_y) {
        var ids = [...document.querySelectorAll('#background > div')].map(({ id, style }) => `[${style.left},${style.top}]`);
        if (ids.includes(x_y)){
            return true;
        };
    };
};

function changePosition(player, x, y) {
    Player = document.querySelector('#' + player);
    Player.style.left = x + "px";
    Player.style.top = y + "px";
};

function createPlayer(user) {
    var arena = document.querySelector('#background');
    var Player = document.createElement('div');
    Player.id = user;
    Player.className = 'players';
    arena.appendChild(Player);
    if (user === username) {
        initGame(user);
    }
};

function createBomb(position) {
    console.log(position);
    var arena = document.querySelector('#background');
    var bomb = document.createElement('div');
    bomb.id = 'bomb';
    bomb.className = 'bomb';
    bomb.style.left = position.x + "px";
    bomb.style.top = position.y + "px";
    bomb.innerHTML = 5;
    arena.appendChild(bomb);

    var filas = [];
    var time = 5;
    var myVar = setInterval(explode, 1000);
    filas.push(myVar);

    function explode(){
        time -=1;
        var bomb = document.querySelector('#bomb');
        bomb.innerHTML = time;
        if(time == 0){
            var bomb = document.querySelector('#bomb');
            bomb.parentNode.removeChild(bomb);
            filas.forEach(clearInterval);
        };
    };
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
