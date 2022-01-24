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
//            createPlayer(data.playerData);
            createOtherPlayers(data.otherPlayers);
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

//function createPlayer(user) {
//    console.log(user);
//    var arena = document.querySelector('#background');
//    var Player = document.createElement('div');
//    Player.id = user;
//    Player.className = 'players';
//    arena.appendChild(Player);
//};

var BeginningPosX = 0;
var BeginningPosY = 0;
var edgeX = 360;
var edgeY = 360;
document.onkeydown = KeyPressed;
function KeyPressed(k) {
    Player = document.querySelector('#' + username);

    var LeftBtn = 37;
    var RightBtn = 39;
    var UpBtn = 38;
    var DownBtn = 40;

    console.log(k.keyCode);
    if (k.keyCode == RightBtn) {
        console.log(BeginningPosX);
        BeginningPosX = BeginningPosX += 40;
        if (BeginningPosX > edgeX) {
            BeginningPosX = edgeX;
        };
        Player.style.left = BeginningPosX + "px";
    }
    else if (k.keyCode == LeftBtn) {
        console.log(BeginningPosX);
        BeginningPosX = BeginningPosX -= 40;
        if (BeginningPosX < 0) {
            BeginningPosX = 0;
        };
        Player.style.left = BeginningPosX + "px";
    }
    else if (k.keyCode == UpBtn) {
        console.log(BeginningPosY);
        BeginningPosY = BeginningPosY -= 40;
        if (BeginningPosY < 0) {
            BeginningPosY = 0;
        };
        Player.style.top = BeginningPosY + "px";
    }
    else if (k.keyCode == DownBtn) {
        console.log(BeginningPosY);
        BeginningPosY = BeginningPosY += 40;
        if (BeginningPosY > edgeY) {
            BeginningPosY = edgeY;
        };
        Player.style.top = BeginningPosY + "px";
    };
    webSocket.send(JSON.stringify({
        'player': Player.id,
        'pos-x': BeginningPosX,
        'pos-y': BeginningPosY,
    }));
};

function changePosition(player, x, y) {
    Player = document.querySelector('#' + player);
    Player.style.left = x + "px";
    Player.style.top = y + "px";
}

function createOtherPlayers(users) {
    var arena = document.querySelector('#background');
    arena.innerHTML = '';
    console.log(users)
    for (player in users) {
        console.log(player, users[player]);
        var Player = document.createElement('div');
        Player.id = player;
        Player.className = 'players';
        Player.style.left = users[player].pos_x + "px";
        Player.style.top = users[player].pos_y + "px";
        arena.appendChild(Player);
    };
};
