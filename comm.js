const MqttClient = {
    CONNECTING_COLOR: "darkyellow",
    CONNECTED_COLOR: "darkgreen",
    CONNECTION_ERROR_COLOR: "darkred",
    WAIT_FOR_BOARD_COLOR: "lightblue",
    start: function () {
        this.connect()
    },
    mqttToken: "aaa3c72f-8e9e-40a4-b937-caf1c384e15b",
    keepAliveTimeout: null,
    pingTimeout: null,
    setConnectStatus: function (color, tooltip) {
        console.log(`MQTT: ${tooltip}`)
        const img = document.getElementById("connect-indicator");
        img.querySelector("title").innerHTML = tooltip
        img.querySelector("g").style.fill = color
    },
    onConnect: function () {
        this.setConnectStatus(this.WAIT_FOR_BOARD_COLOR, "Connected to MQTT")
        this.client.subscribe(`/${this.mqttToken}/keepalive`, 1)
    },

    onConnectionLost: function (e) {
        MqttClient.onConnectionError(e)
        clearInterval(this.pingTimeout)
        window.setTimeout(() => {
            MqttClient.connect.call(MqttClient)
        }, 1000)
    },

    onConnectionError: function (e) {
        this.setConnectStatus(this.CONNECTION_ERROR_COLOR, `MQTT error: ${e.errorMessage} (${e.errorCode})`)
    },
    onMessageArrived: function (msg) {
        this.setConnectStatus(this.CONNECTED_COLOR, "Connected")
        clearTimeout(this.keepAliveTimeout)
        this.keepAliveTimeout = setTimeout(() => {
            this.setConnectStatus(this.WAIT_FOR_BOARD_COLOR, "Board timeout")
        }, 10000)
    },
    client: null,
    connect: function () {

        this.setConnectStatus(this.CONNECTING_COLOR, "Connecting to MQTT")

        // Create a client instance
        this.client = new Paho.MQTT.Client("broker.emqx.io", 8084, "/mqtt", "mqtt_cl1");

        // set callback handlers
        this.client.onConnectionLost = (e) => MqttClient.onConnectionLost.call(MqttClient, e);
        this.client.onMessageArrived = (msg) => MqttClient.onMessageArrived.call(MqttClient, msg);

        // connect the client
        this.client.connect(
            {
                onSuccess: () => this.onConnect.call(MqttClient),
                onFailure: (e) => this.onConnectionError.call(MqttClient, e),
                cleanSession: true,
                useSSL: true,
            });
    },
    restartPython: function() {
        const msg = new Paho.MQTT.Message("rst");
        msg.destinationName = `/${this.mqttToken}/python/restart`
        console.info(`Sendind message to ${msg.destinationName}`)
        this.client.send(msg)
    },
    executePython: function(js) {
        const msg = new Paho.MQTT.Message(js);
        msg.destinationName = `/${this.mqttToken}/python/run`
        console.info(`Sendind message to ${msg.destinationName}`)
        this.client.send(msg)
    }
}


