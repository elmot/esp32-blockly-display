const MqttClient = {
    CONNECTING_COLOR: "darkyellow",
    CONNECTED_COLOR: "darkgreen",
    CONNECTION_ERROR_COLOR: "darkred",
    WAIT_FOR_BOARD_COLOR: "lightblue",
    MQTT_PARAMS_KEY: "mqtt-params",

    keepAliveTimeout: null,
    pingTimeout: null,

    start: function () {
        this.connect()
    },


    setConnectStatus: function (color, tooltip) {
        console.debug(`MQTT: ${tooltip}`)
        const img = document.getElementById("connect-indicator");
        img.querySelector("title").innerHTML = tooltip
        img.querySelector("path").style.fill = color
    },
    onConnect: function () {
        this.setConnectStatus(this.WAIT_FOR_BOARD_COLOR, "Connected to MQTT")
        this.client.subscribe(`/keepalive`, 1)
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
    onMessageArrived: function (_) {
        this.setConnectStatus(this.CONNECTED_COLOR, "Connected")
        clearTimeout(this.keepAliveTimeout)
        this.keepAliveTimeout = setTimeout(() => {
            this.setConnectStatus(this.WAIT_FOR_BOARD_COLOR, "Board timeout")
        }, 10000)
    },
    client: null,
    notEmpty: function (s) {
        return typeof s === "string" && s.trim().length > 0
    },
    connect: function () {

        this.setConnectStatus(this.CONNECTING_COLOR, "Connecting to MQTT")

        // Create a client instance
        let params = null
        try {
            params = JSON.parse(window.localStorage.getItem(this.MQTT_PARAMS_KEY))
        } catch (_) {
        }
        if (params == null) params = {host: "localhost", path: "path"}
        let portNum = parseInt(params.port)
        if (isNaN(portNum)) portNum = 8884
        this.client = new Paho.MQTT.Client(params.host, portNum, params.path, "elmot-toy-webpage" + Math.random());

        // set callback handlers
        this.client.onConnectionLost = (e) => MqttClient.onConnectionLost.call(MqttClient, e);
        this.client.onMessageArrived = (msg) => MqttClient.onMessageArrived.call(MqttClient, msg);

        if (this.notEmpty(params.host) &&
            this.notEmpty(params.port) &&
            this.notEmpty(params.path) &&
            this.notEmpty(params.user) &&
            this.notEmpty(params.password)) {
            // connect the client
            this.client.connect(
                {
                    onSuccess: () => this.onConnect.call(MqttClient),
                    onFailure: (e) => this.onConnectionError.call(MqttClient, e),
                    cleanSession: true,
                    useSSL: true,
                    userName: params.user,
                    password: params.password,
                });
        } else {
            Blockly.dialog.alert("Invalid MQTT connection params")
        }
    },
    restartPython: function () {
        const msg = new Paho.MQTT.Message("rst");
        msg.destinationName = `/python/restart`
        console.info(`Sendind message to ${msg.destinationName}`)
        this.client.send(msg)
    },
    executePython: function (js) {
        const msg = new Paho.MQTT.Message(js);
        msg.destinationName = `/python/run`
        console.info(`Sendind message to ${msg.destinationName}`)
        this.client.send(msg)
    }
}


