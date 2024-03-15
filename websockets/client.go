package main

type Client struct {
	id string
	messages chan []byte
}
