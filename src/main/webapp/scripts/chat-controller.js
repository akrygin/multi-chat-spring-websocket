//TODO Need to refactor this piece of shit
(function($) {
    $.fn.ChatController = function() {
        var user_id = Math.floor(Math.random() * 100000000);
        var service = {};
        var socket = {
            client: null,
            stomp: null
        };
        var messageIds = [];

        service.RECONNECT_TIMEOUT = 30000;
        service.SOCKET_URL = "/multi-chat/chat";
        service.CHAT_TOPIC = "/topic/chat/";
        service.CHAT_BROKER = "/app/chat";

        console.log("ready!");

        service.send = function(message, user_id) {
            var id = Math.floor(Math.random() * 1000000);
            socket.stomp.send(service.CHAT_BROKER + "/" + $('#channels_list').val(), {
                priority: 9
            }, JSON.stringify({
                message: message,
                id: id,
                userId: user_id
            }));
            messageIds.push(id);
        };

        var display_next_message = function(message_id, message, isSelf, time) {
            $('#messages_txt').append('<div message_id="'+ message_id +'"></div>');
            var message_block = $('[message_id='+ message_id +']');
            message_block.append('<div class="message_time">'+ $.format.date(time, "HH:mm:ss") +'</div>');
            message_block.append('<div class="message_gap">:&nbsp;</div>');
            message_block.append('<div class="message_text">'+ message +'</div>');
            if (isSelf){
                $('[message_id='+ message_id +']').find('.message_text').attr("self_message", '');
            }
        };

        var initialize = function() {
            var curr_channel = $('#channels_list');
            if (curr_channel.val() != 0) {
                socket.client = new SockJS(service.SOCKET_URL + "/" + curr_channel.val());
                socket.stomp = Stomp.over(socket.client);
                socket.stomp.connect({}, function(){
                    var id = Math.floor(Math.random() * 1000);
                    var message = ("Connected to channel " + $('#channels_list').val() + " ... ");
                    var message_id = "server_connection_" + id;
                    display_next_message(message_id, message, false, new Date());
                    $('#input_text').val('');
                    console.log(message);
                    socket.stomp.subscribe(service.CHAT_TOPIC + curr_channel.val(), function(data) {
                        console.log('Message from server received...');
                        var message = $.parseJSON(data.body);
                        var isSelf = message.userId == user_id;
                        display_next_message(message.id, message.message, isSelf, new Date(message.time));
                        $('#input_text').val('');
                    });
                });
                socket.stomp.onopen = function(){
                    console.log(user_id + " connected");
                };
                socket.stomp.onclose = function(){
                    console.log(user_id + " disconnected");
                };
            }
        };

        var message_button = $('#send_message_button');
        message_button.attr("temp_user_id", user_id);
        message_button.on('click', function () {
            console.log('Message to server sent...');
            var message = $('#input_text').val();
            if(message != '' && socket.stomp != null && socket.stomp.connected){
                service.send(message, user_id);
            } else {
                $('#input_text').val('');
            }
        });
        $('#input_text').keyup(function(e) {
            if(e.keyCode == 13) {
                $('#send_message_button').click();
            }
        });
        $('#disconnect_button').on('click', function(){
            var id = Math.floor(Math.random() * 1000);
            var channels = $('#channels_list');
            var channel_id = channels.val();
            if (channel_id != 0) {
                disconnect(socket.stomp);
                var message = ("Disconnected from channel " + channel_id + " ... ");
                var message_id = "server_disconnection_id_" + id + "_from_channel_" + channel_id;
                display_next_message(message_id, message, false, new Date());
                channels.val('0');
                $('#input_text').val('');
            }
        });

        var disconnect = function(stomp_obj) {
            if (stomp_obj != null) {
                stomp_obj.disconnect();
            }
        };

        $('#channels_list').change(function () {
            //var optionSelected = $(this).find("option:selected");
            disconnect(socket.stomp);
            initialize();
        });

        //$('#channels_list').change();

        initialize();

        return this;
    };
})(jQuery);

$(document).ready(function () {
    $('#mainWrapper').ChatController();
});