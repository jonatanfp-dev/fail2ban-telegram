# Crear un Bot de Telegram e Integrarlo con Fail2ban para Alertas

## 1. Crear un Bot de Telegram

1. Abre la aplicación de Telegram y busca el usuario `@BotFather`.
2. Inicia una conversación con `@BotFather` escribiendo `/start`.
3. Escribe `/newbot` para comenzar el proceso de creación de un nuevo bot.
4. Sigue las instrucciones que se te presenten:
   - Elige un **nombre** para tu bot.
   - Selecciona un **nombre de usuario** que termine en `bot` (por ejemplo, `MiSuperBot` y `MiSuperBot_bot`).
5. Después de crear tu bot, `@BotFather` te proporcionará un **Token**.
6. Este Token es un código único que necesitarás para interactuar con tu bot desde tu código. **Guarda el Token en un lugar seguro**.
7. Envía un mensaje al bot (por ejemplo, "Hola") para que se registre el chat.
8. Abre un navegador e ingresa la siguiente URL, reemplazando `TOKEN` con el token de tu bot:

   `https://api.telegram.org/botTOKEN/getUpdates`

9. Presiona Enter. Deberías recibir una respuesta en formato JSON. Si obtienes un JSON vacío, asegúrate de haber enviado un mensaje al bot previamente.
10. Busca en el JSON la clave `chat`, y dentro de ella, `id`. Ese es tu `Chat ID`.

    **Ejemplo de Respuesta en JSON:**

    ```json
    {
      "ok": true,
      "result": [
        {
          "update_id": 123456789,
          "message": {
            "message_id": 1,
            "from": {
              "id": 987654321,
              "is_bot": false,
              "first_name": "TuNombre",
              "username": "TuUsuario"
            },
            "chat": {
              "id": 123456789,
              "first_name": "TuNombre",
              "username": "TuUsuario"
            },
            "date": 1615156262,
            "text": "Hola"
          }
        }
      ]
    }
    ```

## 2. Configurar Fail2ban para Integración con Telegram

1. Si no tienes instalado Fail2ban en tu sistema, instálalo usando el siguiente comando (para Ubuntu Server):

   ```bash
   sudo apt-get install fail2ban
   ```

2. Configura el archivo `jail.local` (o `jail.conf` si prefieres). Puedes seguir diferentes tutoriales en línea, pero aquí te muestro un ejemplo básico de configuración:

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

   **Ejemplo de Configuración:**


   ```ini
      [DEFAULT]
      ignoreip = 127.0.0.1 ::1 192.168.23.0/24
      backend = auto

      [sshd]
      enabled = true
      filter = sshd
      port = 2301
      logpath = /var/log/auth.log
      maxretry = 3
      findtime = 600
      bantime = 1200
      action = iptables-multiport[name=sshd, port="2301", protocol=tcp] telegram
   ```

   Nota: Asegúrate de que `action = telegram` esté correctamente configurado en tu archivo. Lo demás depende de cómo desees ajustar tus reglas de Fail2ban.

3. Crea la carpeta necesaria:

   ```bash
   sudo mkdir /etc/fail2ban/scripts/
   ```

4. Navega a la carpeta donde quieras descargar el repositorio (en este ejemplo, `Descargas`):

   ```bash
   cd ~/Descargas/
   ```

5. Descarga el repositorio desde GitHub:

   ```bash
   git clone https://github.com/jonatanfp-dev/fail2ban-telegram.git
   ```

6. Navega a la carpeta del repositorio:

   ```bash
   cd fail2ban-telegram
   ```

7. Vamos a copiar el archivo `telegram.conf`

   ```bash
   sudo cp telegram.conf /etc/fail2ban/action.d/
   ```

8. También copiaremos en script `telegram.sh`

   ```bash
   sudo cp telegram.sh.es /etc/fail2ban/scripts/telegram.sh
   ```

   1. Editaremos para pegar nuestro `token` y `chat_id`

      ```bash
      sudo nano /etc/fail2ban/scripts/telegram.sh
      ```

   2. Cambiaremos los valores de `API_TOKEN` y de `CHAT_ID`:
      ```bash
      # Ejemplo: Aquí debes de pegar tu token y debería quedar algo similar
      API_TOKEN="342523667645756856896796966757"
      # Ejemplo: Aquí debes de pegar tu chat_id y debería quedar algo similar
      CHAT_ID="123456789"
      ```

9. Reinicia Fail2ban para aplicar los cambios:

   ```bash
   sudo systemctl restart fail2ban
   ```

10. Verifica el estado de Fail2ban para asegurarte de que esté funcionando correctamente:

    ```bash
    sudo systemctl status fail2ban
    ```