package com.alex.chat.dto;

import java.util.Date;

public class OutputMessage extends Message {

	private Date time;
	private String channel;
    private int zoneId;
	
	public OutputMessage(Message original, Date time, String channel, int zoneId) {
		super(original.getId(), original.getMessage(), original.getUserId());
		this.time = time;
		this.channel = channel;
        this.zoneId = zoneId;
	}

    public OutputMessage(Message original, Date time) {
        super(original.getId(), original.getMessage(), original.getUserId());
        this.time = time;
        this.channel = "";
    }

    public int getZoneId() {
        return zoneId;
    }

    public void setZoneId(int zoneId) {
        this.zoneId = zoneId;
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
