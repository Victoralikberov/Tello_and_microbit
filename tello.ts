//% color=#009b5b icon="\uf1eb"
namespace TELLO {

    let wifi_connected: boolean = false
    let udp_connected: boolean = false

    // write AT command with CR+LF ending
    function sendAT(command: string, wait: number = 100) {
        serial.writeString(command + "\u000D\u000A")
        basic.pause(wait)
    }

    // wait for certain response from ESP8266
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
        return result
    }
    //% block="Wifi connected ?"
    export function isWifiConnected() {
        return wifi_connected
    }
    //% block="UDP Connected ?"
    export function isUDPConnected() {
        return udp_connected
    }
    //% block="Initialize ESP8266|RX (Tx of micro:bit) %tx|TX (Rx of micro:bit) %rx|Baud rate %baudrate|Wifi SSID = %ssid|Wifi PW = %pw"
    //% tx.defl=SerialPin.P0
    //% rx.defl=SerialPin.P1
    //% ssid.defl=your_ssid
    //% pw.defl=your_pw
    export function connectWifi(tx: SerialPin, rx: SerialPin, baudrate: BaudRate, ssid: string, pw: string) {
        wifi_connected = false
        serial.redirect(
            tx,
            rx,
            baudrate
        )
        sendAT("AT+RESTORE", 1000) // restore to factory settings
        sendAT("AT+CWMODE=1") // set to STA mode
        sendAT("AT+RST", 1000) // reset
        sendAT("AT+CWJAP=\"" + ssid + "\",\"" + pw + "\"", 0) // connect to Wifi router
        wifi_connected = waitResponse()
        basic.pause(100)
    }
    //% block="Start UDP communication|TELLO_IP  %ip|TELLO_Port  %port"
    //% ip.defl=192.168.10.1
    //% port.defl=8889
    export function UDP(ip: string, port: string) {
        udp_connected = false
        sendAT("AT+CIPSTART=\"UDP\",\"" + ip + "\"," + port + ",1112,2", 0)
        udp_connected = waitResponse()
        basic.pause(100)
    }
    //% block="Send UDP command|command  %command|number of bytes  %bytes"
    //% command.defl=
    //% bytes.defl=
    export function Send_command(command: string, bytes: string) {
        sendAT("AT+CIPSEND=" + bytes + "")
        serial.writeString(command + "\u000D\u000A")
        basic.pause(1000)
    }
}
