document.onkeydown = KeyPressed;
var BeginningPosX = 0;
var BeginningPosY = 0;
var edgeX = 360;
var edgeY = 360;

function KeyPressed(k) {

    var LeftBtn = 37;
    var RightBtn = 39;
    var UpBtn = 38;
    var DownBtn = 40;

    var Player = document.getElementById("monke");
    console.log(k.keyCode);
    if (k.keyCode == RightBtn) {
        console.log(BeginningPosX);
        BeginningPos = BeginningPosX += 40;
        if (BeginningPosX > edgeX) {
            BeginningPosX = edgeX;
        };
        Player.style.left = BeginningPosX + "px";
    }
    else if (k.keyCode == LeftBtn) {
        console.log(BeginningPosX);
        BeginningPos = BeginningPosX -= 40;
        if (BeginningPosX < 0) {
            BeginningPosX = 0;
        };
        Player.style.left = BeginningPosX + "px";
    }
    else if (k.keyCode == UpBtn) {
        console.log(BeginningPosY);
        BeginningPos = BeginningPosY -= 40;
        if (BeginningPosY < 0) {
            BeginningPosY = 0;
        };
        Player.style.top = BeginningPosY + "px";
    }
    else if (k.keyCode == DownBtn) {
        console.log(BeginningPosY);
        BeginningPos = BeginningPosY += 40;
        if (BeginningPosY > edgeY) {
            BeginningPosY = edgeY;
        };
        Player.style.top = BeginningPosY + "px";
    }
}