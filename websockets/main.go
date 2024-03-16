package main

import (
	"log"
	"net/http"

	websocket "nhooyr.io/websocket"
	wsjson "nhooyr.io/websocket/wsjson"
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
			var message Message
			err := wsjson.Read(r.Context(), c, &message)
			if err != nil {
				log.Printf("err: %v", err)
				break
			}

			ret, err := client.HandleMessage(message)
			var resp Response
			if err == nil {
				if ret != nil {
					resp = Response{
						Ok:    true,
						Value: ret,
					}
				} else {
					resp = Response{Ok: true}
				}
			} else {
				resp = Response{
					Ok:    false,
					Error: err.Error(),
				}
			}

			err = wsjson.Write(r.Context(), c, resp)
			if err != nil {
				break
			}
		}
	})

	log.Println("Listening on :7777")
	err := http.ListenAndServe(":7777", nil)
	log.Fatal(err)
}
