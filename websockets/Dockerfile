FROM golang:1.21-alpine as build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o ./websockets

FROM alpine
WORKDIR /app
COPY --from=build /app/websockets /app/websockets

EXPOSE 7777
CMD ./websockets
