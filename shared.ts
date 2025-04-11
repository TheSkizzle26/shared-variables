/**
 * Shared Variables
 */
//% weight=100 color=#f03056 icon="ᯤ"
namespace shared {
    /**
     * reference only, not used
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block
    function foo (n: number, s: string): void {
        // Add code here
    }

    let names: any[] = []
    let values: any[] = []

    //%block
    export function init(group: number = 1) {
        radio.setGroup(group)
        radio.setTransmitPower(7)
    }

    export function receive (received_string: string) { //TODO: sync_only
        let parts = received_string.split(";")
        let task = parts[0]
        let variable_name = parts[1]

        if (task == "s") { //set
            let variable_type = parts[2]
            let value = null

            switch (variable_type) {
                case "n": //number
                    value = +parts[3]
                    break
                case "s": //string
                    value = parts[3]
                    break
                case "l": //list
                    value = JSON.parse(parts[3])
                    break
            }

            if (names.indexOf(variable_name) == -1) {
                names.push(variable_name)
                values.push(value)
                return
            }

            values[names.indexOf(variable_name)] = value
        }
    }

    //%block
    export function set (variable_name: string, value: number|string|any[]) { //TODO: sync_only
        if (names.indexOf(variable_name) == -1) {
            names.push(variable_name)
            values.push(value)
        }
        else {
            values[names.indexOf(variable_name)] = value
        }

        let variable_type = null

        switch (typeof value) {
            case "number":
                variable_type = "n"
                break
            case "string":
                variable_type = "s"
                break
                variable_type = "l"
        }

        let str = "s;" + variable_name + ";" + variable_type + ";" + JSON.stringify(value)

        radio.sendString(str)
    }

    //%block
    export function get (variable_name: string) {
        if (names.indexOf(variable_name) == -1) { return }
        return values[names.indexOf(variable_name)]
    }
}


radio.onReceivedString(function(receivedString: string) {
    shared.receive(receivedString)
})