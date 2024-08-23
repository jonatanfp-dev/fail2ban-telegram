# Create a Telegram Bot and Integrate It with Fail2ban for Alerts

## 1. Create a Telegram Bot

1. Open the Telegram app and search for the user `@BotFather`.
2. Start a conversation with `@BotFather` by typing `/start`.
3. Type `/newbot` to begin the process of creating a new bot.
4. Follow the instructions provided:
   - Choose a **name** for your bot.
   - Select a **username** that ends in `bot` (for example, `MySuperBot` and `MySuperBot_bot`).
5. After creating your bot, `@BotFather` will provide you with a **Token**.
6. This Token is a unique code that you will need to interact with your bot from your code. **Keep the Token in a safe place**.
7. Send a message to the bot (e.g., "Hello") to register the chat.
8. Open a browser and enter the following URL, replacing `TOKEN` with your bot’s token:

   `https://api.telegram.org/botTOKEN/getUpdates`

9. Press Enter. You should receive a response in JSON format. If you get an empty JSON, make sure you have sent a message to the bot beforehand.
10. Look in the JSON for the `chat` key, and within it, `id`. That is your `Chat ID`.

    **Example JSON Response:**

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
              "first_name": "YourName",
              "username": "YourUsername"
            },
            "chat": {
              "id": 123456789,
              "first_name": "YourName",
              "username": "YourUsername"
            },
            "date": 1615156262,
            "text": "Hello"
          }
        }
      ]
    }
    ```

## 2. Configure Fail2ban for Integration with Telegram

1. If Fail2ban is not installed on your system, install it using the following command (for Ubuntu Server):

   ```bash
   sudo apt-get install fail2ban
   ```

2. Configure the `jail.local` file (or `jail.conf` if you prefer). You can follow various online tutorials, but here is a basic example of the configuration:

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

   **Configuration Example:**

   ```ini
   [DEFAULT]
   ignoreip = 127.0.0.1 ::1
   backend = auto

   [sshd]
   enabled = true
   filter = sshd
   port = 22
   logpath = /var/log/auth.log
   maxretry = 3
   findtime = 600
   bantime = 1200
   action = iptables-multiport[name=sshd, port="22", protocol=tcp] telegram
   ```

   Note: Ensure that `action = telegram` is correctly configured in your file. The rest depends on how you want to adjust your Fail2ban rules.

3. Create the necessary folder:

   ```bash
   sudo mkdir /etc/fail2ban/scripts/
   ```

4. Navigate to the folder where you want to download the repository (in this example, `Downloads`):

   ```bash
   cd ~/Downloads/
   ```

5. Download the repository from GitHub:

   ```bash
   git clone https://github.com/jonatanfp-dev/fail2ban-telegram.git
   ```

6. Navigate to the repository folder:

   ```bash
   cd fail2ban-telegram
   ```

7. Copy the `telegram.conf` file:

   ```bash
   sudo cp telegram.conf /etc/fail2ban/action.d/
   ```

8. Also, copy the `telegram.sh` script:

   ```bash
   sudo cp telegram.sh.en /etc/fail2ban/scripts/telegram.sh
   ```

   1. Edit the file to insert your `token` and `chat_id`:

      ```bash
      sudo nano /etc/fail2ban/scripts/telegram.sh
      ```

   2. Change the values of `API_TOKEN` and `CHAT_ID`:
      ```bash
      # Example: Paste your token here and it should look something like
      API_TOKEN="342523667645756856896796966757"
      # Example: Paste your chat_id here and it should look something like
      CHAT_ID="123456789"
      ```

9. Restart Fail2ban to apply the changes:

   ```bash
   sudo systemctl restart fail2ban
   ```

10. Check the status of Fail2ban to ensure it is running correctly:

    ```bash
    sudo systemctl status fail2ban
    ```