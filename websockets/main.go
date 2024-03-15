package main

import (
	"log"
	"net/http"

	websocket "nhooyr.io/websocket"
)

const MAX_MESSAGE_QUEUE = 16

func main() {
	server := NewServer()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			InsecureSkipVerify: true,
		})
		if err != nil {
			log.Println(err)
			return
		}
		defer c.CloseNow()

		client := &Client{
			messages: make(chan []byte, MAX_MESSAGE_QUEUE),
		}
		server.RegisterClient(client)
		defer server.DeleteClient(client)

		for {
			t, message, err := c.Read(r.Context())
			if err != nil || t != websocket.MessageText {
				break
			}

			log.Printf("Received %v", message)

			err = c.Write(r.Context(), websocket.MessageText, message)
			if err != nil {
				break
			}
		}
	})

	log.Println("Listening on :7777")
	err := http.ListenAndServe(":7777", nil)
	log.Fatal(err)
}
