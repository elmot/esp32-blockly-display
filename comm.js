const MqttClient = {
    CONNECTING_COLOR: "darkyellow",
    CONNECTED_COLOR: "darkgreen",
    CONNECTION_ERROR_COLOR: "darkred",
    WAIT_FOR_BOARD_COLOR: "blue",
    start: function () {
        this.connect()
    },

    onConnect: function () {
        document.getElementById("connect-circle").style.backgroundColor = MqttClient.WAIT_FOR_BOARD_COLOR
        document.getElementById("connect-tooltip").innerText = `Connected`
        this.client.subscribe("/editor/#", 1)
        const msg = new Paho.MQTT.Message("Connect");
        msg.destinationName = "/board"
        this.client.send(msg)
    },

    onConnectionLost: function (e) {
        MqttClient.onConnectionError(e)
        window.setTimeout(() => {
            MqttClient.connect.call(MqttClient)
        }, 1000)
    },

    onConnectionError: function (e) {
        const msg = `MQTT error: ${e.errorMessage} (${e.errorCode})`
        document.getElementById("connect-circle").style.backgroundColor = this.CONNECTION_ERROR_COLOR
        document.getElementById("connect-tooltip").innerHTML = msg
    },
    onMessageArrived: function (msg) {
        document.getElementById("connect-circle").style.backgroundColor = this.CONNECTED_COLOR
        if(msg.destinationName.startsWith("/load/")) {
            Blockly.serialization.workspaces.load(JSON.parse(msg.payloadMessage), workspace);
        }
    },
    client: null,
    connect: function () {

        document.getElementById("connect-circle").style.backgroundColor = this.CONNECTING_COLOR
        document.getElementById("connect-tooltip").innerText = `Connected`
        // Create a client instance
        this.client = new Paho.MQTT.Client("53b5babd8076408f85e05e65cbfff0ee.s1.eu.hivemq.cloud", 8884, "/mqtt", "mqtt_cl1");

        // set callback handlers
        this.client.onConnectionLost = (e) => MqttClient.onConnectionLost.call(MqttClient, e);
        this.client.onMessageArrived = (msg) => MqttClient.onMessageArrived.call(MqttClient, msg);

        // connect the client
        this.client.connect(
            {
                onSuccess: () => this.onConnect.call(MqttClient),
                onFailure: (e) => this.onConnectionError.call(MqttClient, e),
                userName: "jsbot1",
                password: "Genius11",
                cleanSession: true,
                useSSL: true,
            });
    },
    save: function(key,json) {
        const msg = new Paho.MQTT.Message(json)
        msg.retained = true
        msg.destinationName = `/save/${key}`
        this.client.send(msg)
    },
    load: function(key) {
        const msg = new Paho.MQTT.Message(key)
        msg.destinationName = `/request-load`
        document.getElementById("connect-circle").style.backgroundColor = this.WAIT_FOR_BOARD_COLOR
        this.client.send(msg)
    }
}


