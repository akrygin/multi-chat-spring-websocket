package com.alex.chat.model;

import com.alex.chat.dto.Channel;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Created by akrygin on 09.08.2015.
 */
@Repository
public class MockChatChannelsModel {

    @Resource(name = "messageSource")
    protected MessageSource resource;

    public List<Channel> getChannelList(){
        List<Channel> channelList = new ArrayList<>();
        Locale locale = LocaleContextHolder.getLocale();
        String defaultValue = resource.getMessage("label.mainform.channelsdropdown.defaultvalue", new Object[0], locale);
        String value = resource.getMessage("label.mainform.channelsdropdown.value", new Object[0], locale);
        for (int i = 0; i < 10; i++){
            Channel channel = new Channel();
            if (i == 0){
                channel.setId(i);
                channel.setName(defaultValue);
            } else {
                channel.setId(i);
                channel.setName(value + " " + i);
            }
            channelList.add(channel);
        }
        return channelList;
    }
}
