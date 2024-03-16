package main

import "errors"

type Client struct {
	id       string
	messages chan []byte
}

type Message struct {
	Action string      `json:"action"`
	Value  interface{} `json:"value"`
}

type Response struct {
	Ok    bool        `json:"ok"`
	Value interface{} `json:"value,omitempty"`
	Error string      `json:"error,omitempty"`
}

func (c *Client) HandleMessage(message Message) (interface{}, error) {
	switch message.Action {
	case "ping":
		return "pong", nil
	default:
		return nil, errors.New("invalid action")
	}
}
