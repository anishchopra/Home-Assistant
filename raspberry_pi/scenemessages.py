TURNED_OFF_MESSAGE = "turned off"
TURNED_ON_MESSAGE = "turned on"
FAN_MESSAGE = "the fan"
LIGHT_MESSAGE = "the light"

def set_light_state_message(room, state):
    return "Okay, I have " + state + " " + LIGHT_MESSAGE + " in " + room + "."

def set_fan_state_message(room, state):
    return "Okay, I have " + state + " " + FAN_MESSAGE + " in " + room + "."