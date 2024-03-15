package main

import "sync"

type Server struct {
	clients map[*Client]struct{}
	mutex   sync.RWMutex
}

func NewServer() *Server {
	return &Server{
		clients: make(map[*Client]struct{}),
	}
}

func (server *Server) RegisterClient(client *Client) {
	server.mutex.Lock()
	defer server.mutex.Unlock()

	server.clients[client] = struct{}{}
}

func (server *Server) DeleteClient(client *Client) {
	server.mutex.Lock()
	defer server.mutex.Unlock()

	delete(server.clients, client)
}
