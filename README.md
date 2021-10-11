# game-platform-example

- https://konghq.com/blog/kong-gateway-tutorial/
- https://docs.konghq.com/enterprise/2.5.x/deployment/installation/docker/

## Kong Configuration

__Service__

```
name: rsocket-svc-friends
host: host.docker.internal
protocol: http
port: 9090
```

__Route__

```
name: catch-all
hosts: localhost
paths: /friends-service
```

## Kong Plugin Notes

Could create a Kong plugin that would leverage RSocket composite metadata/rsocket-routing spec and route to services that way.

- docs: https://docs.konghq.com/gateway-oss/2.4.x/plugin-development/custom-logic/#main
- grpc example: https://github.com/Kong/kong-plugin-grpc-gateway/tree/master/kong/plugins/grpc-gateway