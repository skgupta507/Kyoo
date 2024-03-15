package main

import (
	"context"
	"log"
	"net/http"
	"time"

	websocket "nhooyr.io/websocket"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			InsecureSkipVerify: true,
		})
		if err != nil {
			log.Println(err)
			return
		}
		defer c.Close(websocket.StatusInternalError, "Internal error")

		for {
			ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
			defer cancel()

			t, message, err := c.Read(ctx)
			if err != nil || t != websocket.MessageText {
				break
			}

			log.Printf("Received %v", message)

			err = c.Write(ctx, websocket.MessageText, message)
			if err != nil {
				break
			}
		}
	})

	log.Println("Listening on :7777")
	err := http.ListenAndServe(":7777", nil)
	log.Fatal(err)
}
