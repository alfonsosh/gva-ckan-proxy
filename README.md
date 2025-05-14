# GVA Oberta CKAN Resource Proxy

Este proyecto permite descargar recursos desde la API CKAN de Dades Obertes GVA usando su ID, y exponerlos como endpoint REST para integrar con asistentes o GPTs.

## Despliegue

1. Haz un fork o clónalo.
2. Sube el proyecto a Vercel.
3. Usa el endpoint:

```
https://<tu-vercel>.vercel.app/api/resource_download?id=<resource_id>
```
