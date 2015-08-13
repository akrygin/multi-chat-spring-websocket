package com.alex.chat.dto;

import java.util.Date;

public class OutputMessage extends Message {

	private Date time;
	private String channel;
	
	public OutputMessage(Message original, Date time, String channel) {
		super(original.getId(), original.getMessage(), original.getUserId());
		this.time = time;
		this.channel = channel;
	}
	
	public Date getTime() {
		return time;
	}
	
	public void setTime(Date time) {
		this.time = time;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}
}
