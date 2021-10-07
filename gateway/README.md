
## Database Setup

```
docker pull kong/kong-gateway:2.5.0.0-alpine
```

```
docker tag kong/kong-gateway:2.5.0.0-alpine kong-ee
```

```
docker-compose up -d kong-ee-database
```

```
docker run --rm --network=gateway_kong-ee-net \
  -e "KONG_DATABASE=postgres" \
  -e "KONG_PG_HOST=kong-ee-database" \
  -e "KONG_PG_PASSWORD=kong" \
  -e "KONG_PASSWORD=CHANGEME" \
  kong-ee kong migrations bootstrap
```

```
docker-compose down
```