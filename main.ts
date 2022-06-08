input.onButtonPressed(Button.A, function () {
    TELLO.Send_command("cw 90", "6")
})
input.onButtonPressed(Button.B, function () {
    TELLO.Send_command("land", "4")
})
TELLO.connectWifi(
SerialPin.P2,
SerialPin.P1,
BaudRate.BaudRate115200,
"TELLO-60132C",
""
)
basic.pause(5000)
TELLO.UDP("192.168.10.1", "8889")
if (TELLO.isWifiConnected()) {
    basic.showIcon(IconNames.Yes)
} else {
    basic.showIcon(IconNames.No)
}
if (TELLO.isUDPConnected()) {
    basic.showIcon(IconNames.Happy)
} else {
    basic.showIcon(IconNames.Sad)
}
TELLO.Send_command("command", "7")
