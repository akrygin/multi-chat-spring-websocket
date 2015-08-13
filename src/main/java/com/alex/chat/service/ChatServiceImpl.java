package com.alex.chat.service;

import com.alex.chat.dto.Channel;
import com.alex.chat.model.MockChatChannelsModel;

import java.util.List;

public class ChatServiceImpl implements ChatService {

    private MockChatChannelsModel chatChannelsModel;

    public void setChatChannelsModel(MockChatChannelsModel chatChannelsModel) {
        this.chatChannelsModel = chatChannelsModel;
    }

    @Override
    public List<Channel> getChannels(){
        return chatChannelsModel.getChannelList();
    }
}
