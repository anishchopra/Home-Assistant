# Constants
TURNED_OFF = "turned off"
TURNED_ON = "turned on"
FAN_MESSAGE = "the fan"
LIGHT_MESSAGE = "the light"

# Functions
def set_light_state_message(room, state):
    return "Okay, I have " + state + " " + LIGHT_MESSAGE + " in " + room + "."

def set_fan_state_message(room, state):
    return "Okay, I have " + state + " " + FAN_MESSAGE + " in " + room + "."

# Testing Statements
# print(set_light_state_message("the bedroom", TURNED_ON))
# print(set_light_state_message("the bathroom", TURNED_OFF))
# print(set_fan_state_message("the dining room", TURNED_ON))
# print(set_fan_state_message("the kitchen", TURNED_OFF))