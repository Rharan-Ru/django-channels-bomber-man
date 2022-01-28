import json
from channels.generic.websocket import AsyncWebsocketConsumer

players = {}


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'Game-Room'
        print('Connected')
        print(self.channel_name)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, code):
        print('Disconnected')
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data=None, bytes_data=None):
        receive_dict = json.loads(text_data)
        if 'new-player' in receive_dict:
            # Send playes data to new-user only
            new_player = receive_dict['new-player']
            self.user_room = new_player
            await self.channel_layer.group_add(
                self.user_room,
                self.channel_name,
            )
            if len(players) > 0:
                await self.channel_layer.group_send(
                    self.user_room,
                    {
                        'type': 'new_player',
                        'other-players': players,
                    }
                )

            # Send new-user data to all users connected
            players[new_player] = {'pos_x': 0, 'pos_y': 0}
            print("New Player")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'control_room',
                    'new-player': new_player,
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
        elif 'remove-player' in receive_dict:
            player_removed = receive_dict['remove-player']
            players.pop(player_removed)
            print(f"Removed player: {player_removed}")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'remove_player',
                    'player-removed': player_removed,
                }
            )

    async def control_room(self, event):
        print("Control-room data:")
        print(event)
        new_player = event['new-player']
        await self.send(json.dumps({
            'playerData': new_player,
        }))

    async def new_player(self, event):
        print("New-player data:")
        print(event)
        other_players = event['other-players']
        await self.send(json.dumps({
            'otherPlayers': other_players,
        }))
        await self.channel_layer.group_discard(
            self.user_room,
            self.channel_name,
        )

    async def remove_player(self, event):
        print("Remove-player data:")
        print(event)
        player_removed = event['player-removed']
        await self.send(json.dumps({
            'playerRemoved': player_removed,
        }))

    async def move_players(self, event):
        print("Move player data:")
        print(event)
        player = event['player']
        pos_x = event['pos-x']
        pos_y = event['pos-y']
        await self.send(json.dumps({
            'player': player,
            'posX': pos_x,
            'posY': pos_y,
        }))
