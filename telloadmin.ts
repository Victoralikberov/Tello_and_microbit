//% color=#009b5b icon="\uf1eb"
namespace TELLO_Admin {
    // write AT command with CR+LF ending
    function sendAT(command: string, wait: number = 100) {
        serial.writeString(command + "\u000D\u000A")
        basic.pause(wait)
    }
    function waitResponse(): boolean {
        let serial_str: string = ""
        let result: boolean = false
        let time: number = input.runningTime()
        while (true) {
            serial_str += serial.readString()
            if (serial_str.length > 200) serial_str = serial_str.substr(serial_str.length - 200)
            if (serial_str.includes("OK") || serial_str.includes("ALREADY CONNECTED")) {
                result = true
                break
            } else if (serial_str.includes("ERROR") || serial_str.includes("SEND FAIL")) {
                break
            }
            if (input.runningTime() - time > 30000) break
        }
        basic.showString(serial_str)
        return result
    }
//% block="Battery?"
export function show_battery() {
    let executed: boolean = false
    sendAT("AT+CIPSEND=8")
    serial.writeString("battery?" + "\u000D\u000A")
    executed = waitResponse ()
    basic.pause(1000)
}
}