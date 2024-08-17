#!/bin/bash

# Configuración de Telegram
# Ejemplo:
# API_TOKEN="342523667645756856896796966757"
# CHAT_ID="123456789"
API_TOKEN="aqui tu toquen entre las comillas"
CHAT_ID="Y aqui igual pero con el chat_id"

# Archivos de registro
LOG_FILE="/var/log/fail2ban_script.log"

# Función para registrar mensajes
log_message() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" >>"$LOG_FILE"
}

# Función para enviar un mensaje a Telegram
send_message() {
  local message="$1"
  local url="https://api.telegram.org/bot$API_TOKEN/sendMessage"
  local response

  response=$(curl -s -X POST -d chat_id="$CHAT_ID" -d text="$message" -d parse_mode="HTML" "$url")
  if [[ $? -eq 0 ]]; then
    log_message "Mensaje enviado con éxito: $message"
  else
    log_message "Error al enviar mensaje: $response"
  fi
}

# Verificar los argumentos
if [[ $# -lt 1 ]]; then
  log_message "Uso incorrecto del script. Se requiere al menos una acción."
  exit 1
fi

# Obtener la acción
ACTION="$1"
shift

# Obtener parámetros adicionales según la acción
case "$ACTION" in
start | stop)
  IP=""
  NAME="$1"
  ;;
ban | unban)
  IP="$1"
  NAME="$2"
  ;;
*)
  log_message "Acción desconocida: $ACTION"
  exit 1
  ;;
esac

# Log de parámetros recibidos
log_message "Parámetros recibidos - Acción: $ACTION, IP: ${IP:-<no IP>}, Nombre: ${NAME:-<no name>}"

# Construir el mensaje basado en la acción
case "$ACTION" in
start)
  MESSAGE="🚀 La jail de <b><i>$NAME</i></b> está ahora activa."
  ;;
stop)
  MESSAGE="🛑 La jail de <b><i>$NAME</i></b> se ha detenido."
  ;;
ban)
  if [[ -n "$IP" ]]; then
    MESSAGE="🔒 La IP <b><i>$IP</i></b> ha sido bloqueada en <b><i>$NAME</i></b> por Fail2ban."
  else
    MESSAGE="🔒 La IP ha sido bloqueada en <b><i>$NAME</i></b> por Fail2ban."
  fi
  ;;
unban)
  if [[ -n "$IP" ]]; then
    MESSAGE="🌐 La IP <b><i>$IP</i></b> ha sido liberada por Fail2ban de la jail de <b><i>$NAME</i></b>."
  else
    MESSAGE="🌐 La IP ha sido liberada por Fail2ban de la jail de <b><i>$NAME</i></b>."
  fi
  ;;
esac

# Enviar el mensaje
send_message "$MESSAGE"
