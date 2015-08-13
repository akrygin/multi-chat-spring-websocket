package com.alex.chat.dto;

public class Message {

  private String message;
  private int id;
  private int userId;
  
  public Message() {
    
  }
  
  public Message(int id, String message, int userId) {
    this.id = id;
    this.message = message;
    this.userId = userId;
  }

  public int getUserId() {
    return userId;
  }

  public void setUserId(int userId) {
    this.userId = userId;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }
}
