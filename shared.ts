/**
 * Shared Variables
 */
//% weight=100 color=#f03056 icon="ᯤ"
namespace shared {
    let names: any[] = []
    let values: any[] = []
    let received: any[] = []

    /**
     * @param group Radio group that is going to be used, default=1.
     */
    //%block
    export function init(group: number = 1) {
        radio.setGroup(group)
        radio.setTransmitPower(7)
    }

    export function receive (received_string: string) { //TODO: sync_only
        if (received_string.indexOf("$") != 0) {
            let split = received_string.split(";")
            received.push(new Packet(split[0], split[1]))
            return
        }
        
        let parts = received_string.split(";")
        let task = parts[0]
        let variable_name = parts[1]

        if (task == "$s") { //set
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

    /**
     * @param var_name Name of the variable to be set.
     * @param var_value New value of the variable.
     */
    //%block
    export function set (var_name: string, var_value: number|string|any[]) { //TODO: sync_only
        if (names.indexOf(var_name) == -1) {
            names.push(var_name)
            values.push(var_value)
        }
        else {
            values[names.indexOf(var_name)] = var_value
        }

        let variable_type = null

        switch (typeof var_value) {
            case "number":
                variable_type = "n"
                break
            case "string":
                variable_type = "s"
                break
                variable_type = "l"
        }

        let str = "$s;" + var_name + ";" + variable_type + ";" + JSON.stringify(var_value)

        radio.sendString(str)
    }

    /**
     * @param var_name Name of the variable whose value is returned.
     */
    //%block
    export function get (var_name: string) {
        if (names.indexOf(var_name) == -1) { return 0 }
        return values[names.indexOf(var_name)]
    }

    /**
     * @param value_type Type of the packet to be send, fpr example "start_game"
     * @param value The value to be send, for example the name of a player.
     */
    //%block
    export function send (value_type: string, value: string|null = null) {
        radio.sendString(value_type + ";" + value)
    }

    //%block
    export function get_received () {
        let copy = received.slice()
        received = []
        return copy
    }
}


radio.onReceivedString(function(receivedString: string) {
    shared.receive(receivedString)
})