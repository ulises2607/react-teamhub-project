# API Endpoints Testing Guide

Este documento contiene ejemplos de cómo probar todos los endpoints de nuestra API Discord-clone.

**IMPORTANTE**: Todos los comandos de terminal deben ejecutarse desde el directorio `backend`:
```bash
cd backend
```

## Base URL
```
http://localhost:3000/api/v1
```

## 1. Autenticación

### Registro de Usuario
```http
POST http://localhost:3000/api/v1/register
Content-Type: application/json

{
  "user": {
    "email": "usuario2@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "username": "usuario2"
  },
  "profile": {
    "name": "Usuario Dos"
  }
}
```

### Login
```http
POST http://localhost:3000/api/v1/login
Content-Type: application/json

{
  "user": {
    "email": "usuario2@example.com",
    "password": "password123"
  }
}
```

### Obtener Información del Usuario Actual
```http
GET http://localhost:3000/api/v1/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Logout
```http
DELETE http://localhost:3000/api/v1/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

## 2. Servidores

### Crear Servidor
```http
POST http://localhost:3000/api/v1/servers
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "server": {
    "name": "Mi Servidor",
    "image_url": "https://example.com/server-image.jpg"
  }
}
```

### Obtener Lista de Servidores
```http
GET http://localhost:3000/api/v1/servers
Authorization: Bearer YOUR_JWT_TOKEN
```

### Obtener Servidor Específico
```http
GET http://localhost:3000/api/v1/servers/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### Actualizar Servidor
```http
PUT http://localhost:3000/api/v1/servers/1
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "server": {
    "name": "Servidor Actualizado",
    "image_url": "https://example.com/new-image.jpg"
  }
}
```

### Unirse a Servidor por Código de Invitación
```http
POST http://localhost:3000/api/v1/servers/join
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "invite_code": "ABC123DEF"
}
```

### Eliminar Servidor
```http
DELETE http://localhost:3000/api/v1/servers/1
Authorization: Bearer YOUR_JWT_TOKEN
```

## 3. Canales

### Obtener Canales de un Servidor
```http
GET http://localhost:3000/api/v1/servers/1/channels
Authorization: Bearer YOUR_JWT_TOKEN
```

### Crear Canal en Servidor
```http
POST http://localhost:3000/api/v1/servers/1/channels
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "channel": {
    "name": "nuevo-canal",
    "channel_type": "text",
    "position": 1
  }
}
```

### Obtener Canal Específico
```http
GET http://localhost:3000/api/v1/servers/1/channels/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### Actualizar Canal
```http
PUT http://localhost:3000/api/v1/servers/1/channels/1
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "channel": {
    "name": "canal-actualizado",
    "position": 2
  }
}
```

### Eliminar Canal
```http
DELETE http://localhost:3000/api/v1/servers/1/channels/2
Authorization: Bearer YOUR_JWT_TOKEN
```

## 4. Mensajes

### Obtener Mensajes de un Canal
```http
GET http://localhost:3000/api/v1/servers/1/channels/1/messages
Authorization: Bearer YOUR_JWT_TOKEN
```

### Enviar Mensaje
```http
POST http://localhost:3000/api/v1/servers/1/channels/1/messages
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "message": {
    "content": "¡Hola mundo! Este es mi primer mensaje."
  }
}
```

### Enviar Mensaje con Archivo
```http
POST http://localhost:3000/api/v1/servers/1/channels/1/messages
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "message": {
    "content": "Mensaje con archivo adjunto",
    "file_url": "https://example.com/file.pdf"
  }
}
```

### Editar Mensaje
```http
PUT http://localhost:3000/api/v1/servers/1/channels/1/messages/1
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "content": "Mensaje editado"
}
```

### Eliminar Mensaje
```http
DELETE http://localhost:3000/api/v1/servers/1/channels/1/messages/1
Authorization: Bearer YOUR_JWT_TOKEN
```

## 5. Rutas Directas (Para acceso directo con IDs conocidos)

### Obtener Canal Directamente
```http
GET http://localhost:3000/api/v1/channels/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### Obtener Mensaje Directamente
```http
GET http://localhost:3000/api/v1/messages/1
Authorization: Bearer YOUR_JWT_TOKEN
```

## Respuestas de Ejemplo

### Respuesta Exitosa (Servidor)
```json
{
  "success": true,
  "message": "Servidor creado exitosamente",
  "data": {
    "id": 1,
    "name": "Mi Servidor",
    "image_url": "https://example.com/server-image.jpg",
    "invite_code": "ABC123DEF",
    "owner": {
      "id": 1,
      "name": "Test User",
      "image_url": null
    },
    "members_count": 1,
    "channels_count": 1,
    "is_owner": true,
    "member_role": "owner",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Servidor no encontrado",
  "error": "not_found"
}
```

## Notas Importantes

1. **Autenticación**: Todos los endpoints (excepto register y login) requieren el header `Authorization: Bearer YOUR_JWT_TOKEN`.

2. **Permisos**: 
   - Solo el owner del servidor puede eliminar el servidor
   - Solo members con permisos pueden crear/editar/eliminar canales
   - Solo el autor del mensaje o admins pueden editar/eliminar mensajes

3. **Canales por Defecto**: 
   - Al crear un servidor, se crea automáticamente un canal "general"
   - El canal "general" no se puede eliminar

4. **Membresía Automática**: 
   - Al crear un servidor, el usuario se convierte automáticamente en owner y member
   - Al unirse a un servidor, el usuario se convierte en member con rol "guest"

5. **Validaciones**:
   - Los nombres de servidor deben ser únicos por usuario
   - Los nombres de canal deben ser únicos por servidor
   - Los mensajes no pueden estar vacíos (content o file_url requerido)
