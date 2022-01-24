import json
from channels.generic.websocket import AsyncWebsocketConsumer

players = {}


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'Game-Room'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data=None, bytes_data=None):
        receive_dict = json.loads(text_data)
        print(receive_dict)
        if 'new-player' in receive_dict:
            new_player = receive_dict['new-player']
            if new_player not in players:
                players[new_player] = {'pos_x': 0, 'pos_y': 0}
            print(players)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'control_room',
                    'new-player': new_player,
                    'other-players': players,
                }
            )
        elif 'pos-x' in receive_dict or 'pos-y' in receive_dict:
            player = receive_dict['player']
            pos_x = receive_dict['pos-x']
            pos_y = receive_dict['pos-y']
            players[player] = {'pos_x': pos_x, 'pos_y': pos_y}
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'move_players',
                    'player': player,
                    'pos-x': pos_x,
                    'pos-y': pos_y,
                }
            )

    async def control_room(self, event):
        new_player = event['new-player']
        other_players = event['other-players']
        print(event)
        await self.send(json.dumps({
            'playerData': new_player,
            'otherPlayers': other_players,
        }))

    async def move_players(self, event):
        player = event['player']
        pos_x = event['pos-x']
        pos_y = event['pos-y']
        await self.send(json.dumps({
            'player': player,
            'posX': pos_x,
            'posY': pos_y,
        }))
