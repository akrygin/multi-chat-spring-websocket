package com.alex.chat.controller;

import com.alex.chat.dto.Message;
import com.alex.chat.dto.OutputMessage;
import com.alex.chat.service.ChatService;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Date;

@Controller
@RequestMapping("/")
public class ChatController {

    private ChatService chatService;

    public void setChatService(ChatService chatService) {
        this.chatService = chatService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public String viewApplication(Model model) {
        model.addAttribute("channels", chatService.getChannels());
        return "multi-chat";
    }

//    @MessageMapping("/chat/{channel}")
//    public OutputMessage sendMessage(@DestinationVariable String channel, Message message) {
//        return new OutputMessage(message, new Date(), channel);
//    }

    @MessageMapping("/chat")
    public OutputMessage sendMessage(Message message,
                                     @Header("type") String messageType,
                                     @Header("zone_id") int zoneId) {
        return new OutputMessage(message, new Date(), messageType, zoneId);
    }
}
