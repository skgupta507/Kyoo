package main

import "errors"

type Client struct {
	id            string
	messages      chan []byte
	subscriptions []string
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

func NewClient() *Client{
	return &Client{
		messages: make(chan []byte, MAX_MESSAGE_QUEUE),
		subscriptions: make([]string, 0),
	}
}

func (c *Client) HandleMessage(message Message) (interface{}, error) {
	switch message.Action {
	case "ping":
		return "pong", nil
	case "subscribe":
		c.subscriptions = append(c.subscriptions, message.Value.(string))
		return nil, nil
	default:
		return nil, errors.New("invalid action")
	}
}

func (c *Client) ListenChannels() {
}
