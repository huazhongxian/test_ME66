/*
Riven
load dependency
"newland": "file:../pxt-newland"
*/

//% color="#5c7cfa" weight=10 icon="\uf16b"
//% groups='["Basic", "Graphic", Classifier", "Tag/Code", "Audio", "Face", "Wifi", "CloudAI", "AI"]'
namespace newland {
  //type起个新类型
  type EvtAct = () => void
  type EvtNum = (num: number) => void
  type EvtCardNum = (num: number) => void
  type Evtxye = (x: number, y: number, e: number) => void
  type Evtxy = (x: number, y: number) => void
  type EvtFaceNum = (x: number) => void
  type Evtxyobj = (txt: string, x: number, y: number) => void
  type Evtxywh = (x: number, y: number, w: number, h: number) => void
  type Evtxyr = (x: number, y: number, r: number) => void
  type Evtpp = (x1: number, y1: number, x2: number, y2: number) => void
  type Evttxt = (txt: string) => void
  type Evtsxy = (
      id: string,
      x: number,
      y: number,
      w: number,
      h: number,
      rX: number,
      rY: number,
      rZ: number
  ) => void
  type Evtss = (t1: string, t2: string) => void
  type Evtsn = (t1: string, n: number) => void
  type Evtssnns = (t1: string, t2: string, n: number, n1: number, t3: string) => void

  let classifierEvt: Evttxt = null
  let kmodelEvt: EvtNum = null
  let speechCmdEvt: Evttxt = null
  let facetokenEvt: Evtssnns = null
  let facefoundEvt: Evtsn = null



  let btnEvt: Evtxye = null
  let circleEvt: Evtxyr = null
  let rectEvt: Evtxywh = null
  let colorblobEvt: Evtxywh = null
  let lineEvt: Evtpp = null
  let imgtrackEvt: Evtxywh = null
  let qrcodeEvt: Evttxt = null
  let barcodeEvt: Evttxt = null
  let apriltagEvt: Evtsxy = null
  let facedetEvt: Evtxy = null
  let facenumEvt: EvtFaceNum = null
  let objectdetEvt: Evtxyobj = null
  let carddetEvt: EvtCardNum = null
  let ipEvt: Evttxt = null
  let mqttDataEvt: Evtss = null

  let lastCmd: Array<string> = null
  let faceNum = 0


  const PortSerial = [
    [SerialPin.P0, SerialPin.P8],
    [SerialPin.P1, SerialPin.P12],
    [SerialPin.P2, SerialPin.P13],
    [SerialPin.P14, SerialPin.P15],
  ]

  export enum SerialPorts {
    PORT1 = 0,
    PORT2 = 1,
    PORT3 = 2,
    PORT4 = 3,
  }

  export enum LcdDirection {
    //% block=Front
    Front = 0,
    //% block=Back
    Back = 2,
  }

  export enum screenDirection {
    //% block=Front
    Front = 0,
    //% block=Back
    Back = 1,
  }

  export enum cameraDirection {
    //% block=Off
    Off = 0,
    //% block=On
    On = 1,
  }

  function trim(n: string): string {
    while (n.charCodeAt(n.length - 1) < 0x1f) {
      n = n.slice(0, n.length - 1)
    }
    return n
  }

  serial.onDataReceived('\n', function () {
    let a = serial.readUntil('\n')
    if (a.charAt(0) == 'K') {
      a = trim(a)
      let b = a.slice(1, a.length).split(' ')
      let cmd = parseInt(b[0])
      if (cmd == 42) {
        if (classifierEvt) {
          classifierEvt(b[1])
        }
      } else if (cmd == 46) {
        if (kmodelEvt) {
          kmodelEvt(parseInt(b[1]))
        }
      } else if (cmd == 3) {
        if (btnEvt) {
          btnEvt(parseInt(b[1]), parseInt(b[2]), parseInt(b[3])) // btna btnb
        }
      } else if (cmd == 10) {
        // circle position
        if (circleEvt) {
          circleEvt(parseInt(b[1]), parseInt(b[2]), parseInt(b[3])) // x y r
        }
      } else if (cmd == 11) {
        // rect return
        if (rectEvt) {
          rectEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          ) // x y w h
        }
      } else if (cmd == 12) {
        // line track
        if (lineEvt) {
          lineEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          )
        }
      } else if (cmd == 15) {
        // color blob
        if (colorblobEvt) {
          colorblobEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          )
        }
      } else if (cmd == 17) {
        // image track return
        if (imgtrackEvt) {
          imgtrackEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          )
        }
      } else if (cmd == 20) {
        // qrcode return
        if (qrcodeEvt) {
          qrcodeEvt(b[1])
        }
      } else if (cmd == 22) {
        // barcode return
        if (barcodeEvt) {
          barcodeEvt(b[1])
        }
      } else if (cmd == 23) {
        // april tag return
        if (apriltagEvt) {
          apriltagEvt(
              b[1],
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4]),
              parseInt(b[5]),
              Math.roundWithPrecision(parseFloat(b[6]), 2),
              Math.roundWithPrecision(parseFloat(b[7]), 2),
              Math.roundWithPrecision(parseFloat(b[8]), 2)
          )
        }
      } else if (cmd == 31) {
        // face position
        if (facedetEvt && b[1]) {
          facedetEvt(parseInt(b[1]), parseInt(b[2]))
        }
      } else if (cmd == 32) {
        // face number
        if (facenumEvt && b[1]) {
          facenumEvt(parseInt(b[1]))
        }
        //  faceNum = parseInt(b[1])
      } else if (cmd == 51) {
        if (objectdetEvt && b[1]) {
          objectdetEvt(b[1], parseInt(b[2]), parseInt(b[3]))
        }
      } else if (cmd == 54) {
        // ip
        if (ipEvt) {
          ipEvt(b[1])
        }
      } else if (cmd == 55) {
        if (mqttDataEvt) {
          mqttDataEvt(b[1], b[2])
        }
      } else if (cmd == 61) {
        if (carddetEvt && b[1]) {
          carddetEvt(parseInt(b[1]))
        }
      } else if (cmd == 65) {
        if (speechCmdEvt) {
          speechCmdEvt(b[1])
        }
      } else if (cmd == 75) {
        if (facetokenEvt) {
          // K75 token age gender ismask expression
          facetokenEvt(b[1], b[3], parseInt(b[2]), parseInt(b[4]), b[5])
        }
      } else if (cmd == 77) {
        if (facefoundEvt) {
          facefoundEvt(b[1], parseInt(b[2]))
        }
      } else {
        lastCmd = b.slice(1); // deep copy?
      }
      control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + cmd)
    }
  })

  function asyncWrite(msg: string, evt: number): void {
    serial.writeLine(msg)
    //control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + evt)

  }

  /**
   * init serial port
   * @param tx Tx pin; eg: SerialPin.P13
   * @param rx Rx pin; eg: SerialPin.P14
   */
  //% blockId=newland_init block="Newland init|Tx pin %tx|Rx pin %rx"
  //% group="Basic" weight=100
  export function newland_init(tx: SerialPin, rx: SerialPin): void {
    serial.redirect(tx, rx, BaudRate.BaudRate115200)
    basic.pause(500)
    serial.setTxBufferSize(128)
    serial.setRxBufferSize(128)
    serial.readString()
    serial.writeString('\n\n')
    // take control of the ext serial port from Newland
    asyncWrite(`K0`, 0)
    basic.pause(300)
  }

  //% blockId=newland_init_pw block="Newland init powerbrick|Port %port"
  //% group="Basic" weight=99
  export function newland_init_pw(port: SerialPorts): void {
    newland_init(PortSerial[port][0], PortSerial[port][1])
  }

  //% blockId=newland_lcd_direction block="Newland LCD Dir%dir"
  //% group="Basic" weight=98
  export function newland_lcd_direction(dir: LcdDirection): void {
    let str = `K6 ${dir}`
    serial.writeLine(str)
    basic.pause(100)
  }


  //% blockId=newland_screen_direction block="Newland screen Dir%dir"
  //% group="Basic" weight=98
  export function newland_screen_direction(dir: screenDirection): void {
    serial.readString()
    let str = `K7 ${dir}`
    serial.writeLine(str)
    basic.pause(1000)
  }


  //% blockId=newland_camera_switch block="Newland camera Dir%dir"
  //% group="Basic" weight=98
  export function newland_camera_switch(dir: cameraDirection): void {
    serial.readString()
    let str = `K8 ${dir}`
    serial.writeLine(str)
    basic.pause(1000)
  }

  //% blockId=newland_clear_display block="Newland newland_clear_display"
  //% group="Basic" weight=88
  export function newland_clear_display(): void {
    serial.readString()
    let str = `K9`
    serial.writeLine(str)
    basic.pause(1000)
  }



  /**
   * @param name savepath; eg: name.wav
   */
  //% blockId=newland_screenshot1 block="Newland Screenshot %name"
  //% group="Basic" weight=95
  export function newland_screenshot1(name: string): void {
    let str = `K71 ${name}`
    serial.writeLine(str)
  }

  /**
   * @param name jpeg to display; eg: name.wav
   */
  //% blockId=newland_display1 block="Newland Display %name"
  //% group="Basic" weight=94 blockGap=40
  export function newland_display1(name: string): void {
    let str = `K72 ${name}`
    serial.writeLine(str)
  }






  /**
   * @param t string to display; eg: hello
   * @param d delay; eg: 1000
   */
  //% blockId=newland_print block="Newland print %t X %x Y %y||delay %d ms"
  //% x.min=0 x.max=320
  //% y.min=0 y.max=240
  //% group="Basic" weight=97
  export function newland_print(t: string, x: number, y: number, d: number = 1000): void {

    let str = `K4 ${x} ${y} ${d} ${t}`
    serial.writeLine(str)
  }

  //% blockId=newland_onbtn block="on Button"
  //% weight=96
  //% group="Basic" draggableParameters=reporter
  export function newland_onbtn(
      handler: (btnA: number, btnB: number, btnEnter: number) => void
  ): void {
    btnEvt = handler
  }

  /**
   * @param name savepath; eg: name.jpg
   */
  //% blockId=newland_screenshot block="Newland Screenshot %name"
  //% group="Basic" weight=95
  export function newland_screenshot(name: string): void {
    let str = `K2 ${name}`
    serial.writeLine(str)
  }

  /**
   * @param name jpeg to display; eg: name.jpg
   */
  //% blockId=newland_display block="Newland Display %name"
  //% group="Basic" weight=94 blockGap=40
  export function newland_display(name: string): void {
    let str = `K1 ${name}`
    serial.writeLine(str)
  }

  /*//% blockId=newland_reset_cls block="Newland Reset Classifier"
  //% group="Classifier" weight=90
  export function newland_reset_cls(): void {
    let str = `K40`
    serial.writeLine(str)
  }*/

  /**
   * @param tag tag index; eg: cat
   */
  /*//% blockId=newland_addtag block="Newland Add Tag %tag"
  //% group="Classifier" weight=89
  export function newland_addtag(tag: string): void {
    let str = `K41 ${tag}`
    serial.writeLine(str)
  }*/

  //% blockId=newland_run block="Newland Run Classifer"
  //% group="Classifier" weight=88
  export function newland_run(): void {
    let str = `K42`
    serial.writeLine(str)
    // asyncWrite(str, 42)
  }

  //% blockId=newland_classified block="on Identified"
  //% group="Classifier" weight=87 draggableParameters=reporter
  export function newland_classified(handler: (classId: string) => void) {
    classifierEvt = handler
  }

  /**
   * @param path json to save; eg: class.json
   */
  /*//% blockId=newland_cls_save block="Newland Save Classifier %path"
  //% group="Classifier" weight=86
  export function newland_cls_save(path: string): void {
    let str = `K43 ${path}`
    serial.writeLine(str)
  }*/

  /**
   * @param path json to save; eg: class.json
   */
  /*//% blockId=newland_cls_load block="Newland Load Classifier %path"
  //% group="Classifier" weight=85
  export function newland_cls_load(path: string): void {
    let str = `K44 ${path}`
    serial.writeLine(str)
  }*/


  /**
   * @param th threshold; eg: 2000
   */
  //% blockId=newland_track_circle block="Newland track circle threshold%th"
  //% group="Graphic" weight=80
  //% th.min=1000 th.max=5000
  export function newland_track_circle(th: number): void {
    let str = `K10 ${th}`
    serial.writeLine(str)

  }

  //% blockId=newland_oncircletrack block="on Find Circle"
  //% group="Graphic" weight=79 draggableParameters=reporter blockGap=40
  export function newland_oncircletrack(
      handler: (x: number, y: number, r: number) => void
  ) {
    circleEvt = handler
  }

  /**
   * @param th threshold; eg: 6000
   */
  /*//% blockId=newland_track_rect block="Newland track rectangle %th"
   //% group="Graphic" weight=78
   export function newland_track_rect(th: number): void {
     let str = `K11 ${th}`
     serial.writeLine(str)
   }

   //% blockId=newland_onrecttrack block="on Find Rectangle"
   //% group="Graphic" weight=77 draggableParameters=reporter blockGap=40
   export function newland_onrecttrack(
       handler: (x: number, y: number, w: number, h: number) => void
   ) {
     rectEvt = handler
   } */

  /**
   * @param key color key; eg: red
   */
  //% blockId=newland_colorcali block="Newland color calibration %key"
  //% group="Graphic" weight=76
  export function newland_colorcali(key: string) {
    let str = `K16 ${key}`
    serial.writeLine(str)
  }

  /**
   * @param th threshold; eg: 2000
   */
  //% blockId=newland_track_line block="Newland track line %th"
  //% group="Graphic" weight=75
  export function newland_track_line(th: string): void {
    let str = `K12 ${th}`
    serial.writeLine(str)
  }

  //% blockId=newland_onlinetrack block="on Line Update"
  //% group="Graphic" weight=74 draggableParameters=reporter
  export function newland_onlinetrack(
      handler: (x1: number, y1: number, x2: number, y2: number) => void
  ) {
    lineEvt = handler
  }

  /**
   * @param key color key; eg: red
   * 0-red,1-green,2-blue
   */
  //% blockId=newland_track_colorblob block="Newland track color blob %key"
  //% group="Graphic" weight=73
  export function newland_track_colorblob(key: string): void {
    let str = `K15 ${key}`
    serial.writeLine(str)
  }

  //% blockId=newland_oncolorblob block="on Color blob"
  //% group="Graphic" weight=72 draggableParameters=reporter blockGap=40
  export function newland_oncolorblob(
      handler: (x: number, y: number, w: number, h: number) => void
  ) {
    colorblobEvt = handler
  }

  //% blockId=newland_qrcode block="Newland QR code"
  //% group="Tag/Code" weight=70
  export function newland_qrcode() {
    let str = `K20`
    serial.writeLine(str)
  }

  //% blockId=newland_onqrcode block="on QR code"
  //% group="Tag/Code" weight=69 draggableParameters=reporter blockGap=40
  export function newland_onqrcode(handler: (link: string) => void) {
    qrcodeEvt = handler
  }

  //% blockId=newland_barcode block="Newland BAR code"
  //% group="Tag/Code" weight=68
  export function newland_barcode() {
    let str = `K22`
    serial.writeLine(str)
  }

  //% blockId=newland_onbarcode block="on Barcode code"
  //% group="Tag/Code" weight=67 draggableParameters=reporter blockGap=40
  export function newland_onbarcode(handler: (code: string) => void) {
    barcodeEvt = handler
  }

  /* //% blockId=newland_apriltag block="Newland April Tag"
 //% group="Tag/Code" weight=66
 export function newland_apriltag() {
   let str = `K23`
   serial.writeLine(str)
 }

 //% blockId=newland_onapriltag block="on AprilTag"
 //% group="Tag/Code" weight=65 draggableParameters=reporter blockGap=40
 export function newland_onapriltag(
     handler: (
         id: string,
         x: number,
         y: number,
         w: number,
         h: number,
         tX: number,
         tY: number,
         tZ: number
     ) => void
 ) {
   apriltagEvt = handler
 }*/

  //% blockId=newland_loadyoloface block="Newland Load Face yolo"
  //% group="AI" weight=60
  export function newland_loadyoloface() {
    let str = `K30`
    serial.writeLine(str)
  }

  //% blockId=newland_facedetect block="Newland face detect"
  //% group="AI" weight=59
  export function newland_facedetect() {
    let str = `K31`
    // serial.writeLine(str)
    // basic.pause(200)
    asyncWrite(str, 31)
    basic.pause(300)
    let strOther = `K32`
    asyncWrite(strOther, 32)
  }


  //改为人脸数量
  //% blockId=newland_facecount block="Newland face number"
  //% group="AI" weight=57 draggableParameters=reporter blockGap=40
  export function newland_facecount(handler: (x: number) => void) {
    // let str = `K32`
    // asyncWrite(`K32`, 32)
    // return faceNum
    facenumEvt = handler
  }

  //% blockId=newland_onfindface block="on Find Face"
  //% group="AI" weight=58 draggableParameters=reporter blockGap=40
  export function newland_onfindface(handler: (x: number, y: number) => void) {
    facedetEvt = handler
  }

  //% blockId=newland_loadobjectdetection block="Newland Load Object detectio"
  //% group="AI" weight=53
  export function newland_loadobjectdetection() {
    let str = `K50`
    serial.writeLine(str)
  }

  /**
   * @param th threshold; eg: 0.5
   */
  //% blockId=newland_detection block="Newland object detectio %th"
  //% group="AI" weight=52
  export function newland_detection(th: number): void {
    let str = `K51 ${th}`
    // serial.writeLine(str)
    // basic.pause(200)
    asyncWrite(str, 51)
  }


  //% blockId=newland_detectionname block="on detectio Name"
  //% group="AI" weight=51 draggableParameters=reporter blockGap=40
  export function newland_detectionname(handler: (txt: string, x: number, y: number) => void) {
    objectdetEvt = handler
  }


  //% blockId=newland_loaddigitalrecognition block="Newland  load digital recognition detectio"
  //% group="AI" weight=63
  export function newland_loaddigitalrecognition() {
    let str = `K60`
    serial.writeLine(str)
  }

  /**
   * @param th threshold; eg: 0.5
   */
  //% blockId=newland_digitalrecognition block="Newland digital recognition %th"
  //% group="AI" weight=62
  export function newland_digitalrecognition(th: number) {
    let str = `K61 ${th}`
    // serial.writeLine(str)
    // basic.pause(200)
    asyncWrite(str, 61)
  }

  //% blockId=newland_digitalid block="newland digitalid Value"
  //% group="AI" weight=61 draggableParameters=reporter blockGap=40
  export function newland_digitalid(handler: (x: number) => void) {
    carddetEvt = handler
  }

  /**
   * @param ssid SSID; eg: ssid
   * @param pass PASSWORD; eg: password
   */
  /*  //% blockId=newland_join_ap block="Join Ap %ssid %pass"
    //% group="Wifi" weight=50
    export function newland_join_ap(ssid: string, pass: string) {
      serial.writeLine(`K50 ${ssid} ${pass}`)
    }*/

  /*  //% blockId=newland_getip block="Wifi Get IP"
    //% group="Wifi" weight=49
    export function newland_get_ip() {
      // serial.writeLine(`K54`)
      let str = `K54`
      asyncWrite(str, 54)
    }*/

  /*  //% blockId=newland_ip_onread block="on IP Data"
    //% group="Wifi" weight=48 draggableParameters=reporter
    export function newland_ip_onread(
      handler: (ip: string) => void
    ) {
      ipEvt = handler
    }*/

  /*  //% blockId=newland_gettime block="Newland get time"
    //% group="Wifi" weight=47
    export function newland_gettime(): Array<string> {
      asyncWrite(`K56`, 56)
      return lastCmd
    }*/

  /**
   * @param host Mqtt host; eg: iot.kittenbot.cn
   * @param cid Client ID; eg: clientid
   * @param port Host Port; eg: 1883
   * @param user Username; eg: user
   * @param pass Password; eg: pass
   */
  /*  //% blockId=newland_mqtt_host block="Mqtt Host %host| clientID%cid||Port%port User%user Pass%pass"
    //% group="Wifi" weight=46
    export function newland_mqtt_host(
      host: string,
      cid: string,
      port: number = 1883,
      user: string = null,
      pass: string = null
    ) {
      if (user && pass) {
        serial.writeLine(`K51 ${host} ${cid} ${port} ${user} ${pass}`)
      } else {
        serial.writeLine(`K51 ${host} ${cid} ${port}`)
      }
    }*/

  /**
   * @param topic Topic to subscribe; eg: /topic
   */
  /*
    //% blockId=newland_mqtt_sub block="Mqtt Subscribe %topic"
    //% group="Wifi" weight=45
    export function newland_mqtt_sub(topic: string) {
      serial.writeLine(`K52 ${topic}`)
    }
  */

  /**
   * @param topic Topic to publish; eg: /topic
   * @param data Data to publish; eg: hello
   */
  /*
    //% blockId=newland_mqtt_pub block="Mqtt Publish %topic %data"
    //% group="Wifi" weight=44
    export function newland_mqtt_pub(topic: string, data: string) {
      serial.writeLine(`K53 ${topic} ${data}`)
    }
  */

  /**
   * @param topic Mqtt Read; eg: /topic
   */
  /*  //% blockId=newland_mqtt_read block="Mqtt Read %topic"
    //% group="Wifi" weight=43
    export function newland_mqtt_read(topic: string) {
      topic = topic || ''
      let str = `K55 ${topic}`
      serial.writeLine(str)
      // asyncWrite(str, 55)

    }*/

  /*  //% blockId=newland_mqtt_onread block="on Mqtt Data"
    //% group="Wifi" weight=42 draggableParameters=reporter
    export function newland_mqtt_onread(
      handler: (data: string, topic: string) => void
    ) {
      mqttDataEvt = handler
    }*/


  /**
   * @param file Wav File to record; eg: say.wav
   */
  /*//% blockId=newland_audio_rec block="WAV Rec %file"
  //% group="Audio" weight=40
  export function newland_audio_rec(file: string) {
    serial.writeLine(`K61 ${file}`)
  }*/

  /**
   * @param file Wav File to play; eg: say.wav
   */
  /*//% blockId=newland_audio_play block="WAV Play %file"
  //% group="Audio" weight=39
  export function newland_audio_play(file: string) {
    serial.writeLine(`K62 ${file}`)
  }*/

  /*//% blockId=newland_audio_noisetap block="Calibrate noise"
  //% group="Audio" weight=38
  export function newland_audio_noisetap(): void {
    serial.writeLine(`K63`)
  }*/

  /**
   * @param classid Speech Cmd add; eg: cmd
   */
  /*//% blockId=newland_speechcmd_addmodel block="Speech Cmd add %classid"
  //% group="Audio" weight=37
  export function newland_speechcmd_addmodel(classid: string) {
    serial.writeLine(`K64 ${classid}`)
  }*/

  /*//% blockId=newland_speechcmd_listen block="Speech Cmd Listen"
  //% group="Audio" weight=36
  export function newland_speechcmd_listen(): void {
    let str = `K65`
    serial.writeLine('K65')
    // asyncWrite(str, 65)
  }*/

  /*//% blockId=newland_speechcmd_onrecognize block="on Speech Cmd"
  //% group="Audio" weight=35 draggableParameters=reporter
  export function newland_speechcmd_onrecognize(
    handler: (classId: string) => void
  ) {
    speechCmdEvt = handler
  }*/

  /**
   * @param path json to save; eg: cmd.json
   */
  /*//% blockId=newland_speechcmd_save block="Newland Save speech cmd %path"
  //% group="Audio" weight=34
  export function newland_speechcmd_save(path: string): void {
    let str = `K66 ${path}`
    serial.writeLine(str)
  }*/

  /**
   * @param path json to save; eg: cmd.json
   */
  /*//% blockId=newland_speechcmd_load block="Newland Load speech cmd %path"
  //% group="Audio" weight=33 blockGap=40
  export function newland_speechcmd_load(path: string): void {
    let str = `K67 ${path}`
    serial.writeLine(str)
  }*/

  /*//% blockId=newland_cloud_facerecognize block="Newland Cloud Face Recognize"
  //% group="CloudAI" weight=30
  export function newland_cloud_facerecognize() {
    let str = `K75`
    serial.writeLine(`K75`)
    // asyncWrite(str, 75)
  }*/

  /*//% blockId=newland_cloud_onregface block="on Recognize Face"
  //% group="CloudAI" weight=29 draggableParameters=reporter
  export function newland_cloud_onregface(
    handler: (token: string, sex: string, age: number, mask: number, expression: string) => void
  ) {
    facetokenEvt = handler
  }*/

  /*//% blockId=newland_cloud_faceaddgroup block="add face token %TOKEN to Group %GROUP with name %NAME"
  //% group="CloudAI" weight=28
  export function newland_cloud_faceaddgroup(
    TOKEN: string,
    GROUP: string,
    NAME: string
  ) {
    serial.writeLine(`K76 ${TOKEN} ${GROUP} ${NAME}`)
  }*/

  /*//% blockId=newland_cloud_facesearch block="search face token %TOKEN in group %GROUP"
  //% group="CloudAI" weight=27
  export function newland_cloud_facesearch(TOKEN: string, GROUP: string) {
    let str =`K77 ${TOKEN} ${GROUP}`
    serial.writeLine(str)
    // asyncWrite(str, 77)
  }*/

  /* //% blockId=newland_cloud_onfindface block="on Find Face"
   //% group="CloudAI" weight=26 draggableParameters=reporter blockGap=40
   export function newland_cloud_onfindface(
     handler: (name: string, confidence: number) => void
   ) {
     facefoundEvt = handler
   }*/

  /**
   * @param TXT text to speech; eg: hello world
   */
  /*//% blockId=newland_cloud_tts block="TTS %TXT"
  //% group="CloudAI" weight=25
  export function newland_cloud_tts(TXT: string) {
    let str = TXT.split(' ').join('.')
    serial.writeLine(`K78 ${str}`)
  }*/


  /*//% blockId=newland_reset block="Newland reset"
  //% group="Basic" weight=10
  //% advanced=true
  export function newland_reset(): void {
    serial.writeLine(`K99`)
  }*/

  /*//% blockId=newland_stop_kpu block="Newland Stop kpu"
  //% group="Basic" weight=9 blockGap=40
  //% advanced=true
  export function newland_stop_kpu(): void {
    let str = `K98`
    serial.writeLine(str)
  }*/

  /**
   * @param txt string to display; eg: 你好世界
   */
  //% blockId=newland_print_unicode block="Print UNICODE X %x Y %y %txt||delay %delay ms"
  //% x.min=0 x.max=320
  //% y.min=0 y.max=240
  //% group="Basic" weight=100
  //% advanced=true
  export function newland_print_unicode(
      x: number,
      y: number,
      txt: string,
      delay: number = 1000
  ): void {
    let s: string = '${';
    for (let i = 0; i < txt.length; i++) {
      s += txt.charCodeAt(i)
      if (i != (txt.length - 1)) s += ','
    }
    s += '}'
    let str = `K5 ${x} ${y} ${delay} ${s}`
    serial.writeLine(str)
  }


  /**
   * @param path kmodel to load; eg: model.kmodel
   */
  /*//% blockId=newland_loadkmodel block="Load KNN model %path"
  //% group="Classifier" weight=90
  //% advanced=true
  export function newland_loadkmodel(path: string) {
    let str = `K45 ${path}`
    serial.writeLine(str)
  }*/

  /*//% blockId=newland_inference block="KNN inference"
  //% group="Classifier" weight=89
  //% advanced=true
  export function newland_inference() {
    let str = `K46`
    serial.writeLine(`K46`)
    // asyncWrite(str, 46)
  }*/

  /*//% blockId=newland_on_inference block="on Inference"
  //% group="Classifier" weight=88 draggableParameters=reporter blockGap=40
  //% advanced=true
  export function newland_on_inference(handler: (index: number) => void) {
    kmodelEvt = handler
  }*/

}



