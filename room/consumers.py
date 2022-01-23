import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass
        # self.room_group_name = 'Game-Room'
        #
        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name,
        # )
        # await self.accept()

    async def disconnect(self, code):
        pass
        # await self.channel_layer.group_discard(
        #     self.room_group_name,
        #     self.channel_name,
        # )

    async def receive(self, text_data=None, bytes_data=None):
        pass
        # receive_dict = json.loads(text_data)
        #
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'control_room',
        #         'receive_dict': receive_dict,
        #     }
        # )

    async def control_room(self, event):
        pass
