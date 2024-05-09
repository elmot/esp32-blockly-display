const led14Svg = "led14.svg"
Blockly.Blocks["led_14_segments"] = {
    init: function () {
        this.setColour(160);
        this.appendDummyInput().appendField(new Blockly.FieldImage(led14Svg, 80, 120));
        this.appendDummyInput().appendField("Position").appendField(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"]]), "POS")
        this.appendValueInput("SEGS").appendField("Segments")
        this.setNextStatement(true)
        this.setPreviousStatement(true)
    }
}

javascript.javascriptGenerator.forBlock["led_14_segments"] = function (block, generator) {
    const pos = block.getFieldValue("POS");
    let segsCode = generator.valueToCode(block, "SEGS", javascript.Order.ATOMIC);
    if (segsCode === "") segsCode = "''"
    return `segm14Output(${pos},${segsCode})\n`
}

Blockly.Blocks["sleep"] = {
    init: function () {
        this.setColour(160);
        this.appendDummyInput().appendField("\u231B")
        this.appendValueInput("SECONDS").appendField("Seconds")
        this.setNextStatement(true)
        this.setPreviousStatement(true)
    }
}

javascript.javascriptGenerator.forBlock["sleep"] = function (block, generator) {
    let time = generator.valueToCode(block, "SECONDS", javascript.Order.ATOMIC);
    if (time === "") time = 0
    return `await segm14Delay(${time})\n`
}

Blockly.Blocks["led_14_segments_text"] = {
    init: function () {
        this.setColour(160);
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(led14Svg, 20, 30))
            .appendField(new Blockly.FieldImage(led14Svg, 20, 30))
            .appendField(new Blockly.FieldImage(led14Svg, 20, 30))
            .appendField(new Blockly.FieldImage(led14Svg, 20, 30))
        this.appendValueInput("TEXT").appendField("Text")
        this.setNextStatement(true)
        this.setPreviousStatement(true)
    }
}

javascript.javascriptGenerator.forBlock["led_14_segments_text"] = function (block, generator) {
    let text = generator.valueToCode(block, "TEXT", javascript.Order.ATOMIC);
    if (text === "") text = "''"
    return `segm14Text(${text})\n`
}

