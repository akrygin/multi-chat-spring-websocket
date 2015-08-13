package com.alex.chat.service;

import com.alex.chat.dto.Channel;

import java.util.List;

/**
 * Created by akrygin on 09.08.2015.
 */
public interface ChatService {
    List<Channel> getChannels();
}
