$(function() {
    var tabTitle = $( "#tab_title" ),
        tabContent = $( "#tab_content" ),
        tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
        tabCounter = 2;

    var stompObj;

    var tabs = $( "#tabs" ).tabs();
    var message_input_main = $('#input_text_from_tabs');
    var user_id = Math.floor(Math.random() * 100000000);
    var current_zone = $('#channels_list').val();

    // modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#dialog" ).dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Add: function() {
                addTab();
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            form[ 0 ].reset();
        }
    });

    var display_next_message = function(message_id, message, isSelf, time, type) {
        $('#messages_text_' + type).append('<div message_id="'+ message_id +'"></div>');
        var message_block = $('[message_id='+ message_id +']');
        message_block.append('<div class="message_time">'+ $.format.date(time, "HH:mm:ss") +'</div>');
        message_block.append('<div class="message_gap">:&nbsp;</div>');
        message_block.append('<div class="message_text">'+ message +'</div>');
        if (isSelf){
            $('[message_id='+ message_id +']').find('.message_text').attr("self_message", '');
        }
    };

    var create_block_for_input_messages = function () {
        $('[channel_type]').each(function(){
            $(this).append('<div id="messages_text_'+ $(this).attr('channel_type') +'"></div>');
        });
    };

    var clearTargetInput = function (message_type) {
        $('#input_text_' + message_type).val('');
    };

    $('#channels_list').select().change(function(){
        current_zone = $(this).val();
    });

    $("#create_connection").button().click(function () {
        var clientSocket = new SockJS("/multi-chat/chat");
        stompObj = Stomp.over(clientSocket);
        stompObj.connect({}, function () {
            console.log('tadaaaam');
            create_block_for_input_messages();
            stompObj.subscribe("/topic/chat", function (data) {
                console.log('Message from server received...' + data);
                var message = $.parseJSON(data.body);
                var isSelf = message.userId == user_id;
                var message_type = message.channel;
                if (current_zone == message.zoneId) {
                    display_next_message(message.id, message.message, isSelf, new Date(message.time), message_type);
                }
                clearTargetInput(message_type);
            });
        });
    });

    $('[id^="send_message_button_"]').button().click(function () {
        console.log('Message to server sent...');
        var message_type = $(this).parent().attr('channel_type');
        var message_text = $('#input_text_' + message_type).val();
        if(message_text != '' && stompObj != null && stompObj.connected){
            var id = Math.floor(Math.random() * 1000000);
            stompObj.send("/app/chat", {
                priority: 9,
                type: message_type,
                zone_id: current_zone
            }, JSON.stringify({
                message: message_text,
                id: id,
                userId: user_id
            }));
        } else {
            clearTargetInput(message_type);
        }
    });

    $('[id^="input_text_"]').keyup(function(e) {
        if(e.keyCode == 13) {
            var channel_type = $(this).parent().attr('channel_type');
            $('[id^="send_message_button_' + channel_type + '"]').click();
        }
    });

    // addTab form: calls addTab function on submit and closes the dialog
    var form = dialog.find( "form" ).submit(function( event ) {
        addTab();
        dialog.dialog( "close" );
        event.preventDefault();
    });

    // actual addTab function: adds new tab using the input from the form above
    function addTab() {
        var label = tabTitle.val() || "Tab " + tabCounter,
            id = "tabs-" + tabCounter,
            li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
            tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";

        tabs.find( ".ui-tabs-nav" ).append( li );
        tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
        tabs.tabs( "refresh" );
        tabCounter++;
    }

    // addTab button: just opens the dialog
    $( "#add_tab" )
        .button()
        .click(function() {
            dialog.dialog( "open" );
        });

    // close icon: removing the tab on click
    tabs.delegate( "span.ui-icon-close", "click", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );
    });

    tabs.bind( "keyup", function( event ) {
        if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
            var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
            $( "#" + panelId ).remove();
            tabs.tabs( "refresh" );
        }
    });
});