const minidrone = require('minidrone');
const temporal = require('temporal');
const Sonus = require('sonus')
const speech = require('@google-cloud/speech')


const drone = new minidrone.Drone();
const client = new speech.SpeechClient()


const hotwords = [
    //{file:'commands/Land.pmdl', hotword: 'Land'},
    //{file:'commands/travis.pmdl', hotword: 'travis'},
    {file:'commands/snowboy.pmdl', hotword: 'snowboy'}
]

//const sonus = Sonus.init({ hotwords }, client)
const language = "en-US"
const sonus = Sonus.init({ hotwords, language: language, recordProgram: 'rec'  }, client)
let coordinates = [0,0,0]
let angle=0

drone.connect(function() {
    drone.setup(function () {
        drone.flatTrim()
        drone.startPing()
        drone.flatTrim()
        console.log("Connect" + drone.name)
        const commands = {
            'travis': function () {
                //drone.takeOff()
               // drone.flatTrim()
                console.log("take off")
            },
            'Lend': function () {
                //drone.land()
                console.log("Land")
            },
            'Move :direction':function(direction){
                //drone.forward({steps:12})
                let steps=0
                if(direction=="forward"){
                    coordinates[0]+=Math.cos(angle)*steps;
                    coordinates[1]+=Math.sin(angle)*steps;
                    console.log(coordinates)
                }
                if(direction=="backward"){
                    coordinates[0]-=Math.cos(angle)*steps;
                    coordinates[1]-=Math.sin(angle)*steps;
                    console.log(coordinates)
                }
                console.log("Move " + direction)
                console.log("ok")
            },
            'Go :direction':function(direction){
                let steps=0
                //drone.forward({steps:12})
                if(direction=="Up") {
                    coordinates[2] += steps
                    console.log(coordinates)
                }
                if(direction=="Down"){
                    coordinates[2]-=steps
                    console.log(coordinates)
                }
                console.log("Go " + direction)
                console.log("ok")
            },
            'turn :direction':function(direction){
                //drone.forward({steps:12})
                let steps=0
                if(direction == "right"){
                    angel+=3.6*steps
                    console.log(angel)
                }
                if(direction == "left"){
                    console.log(angel)
                    angel-=3.6*steps
                }
                console.log("Turn " + direction)
            },
            'come to me':function(){

            },
            '(give me) :flavor ice cream': function (flavor) {
                console.log('Fetching some ' + flavor + ' ice ceam for you sr')
            },
            'turn (the)(lights) :state (the)(lights)': function (state) {
                console.log('Turning the lights', (state == 'on') ? state : 'off')
            }
        }

        Sonus.annyang.addCommands(commands)

        Sonus.start(sonus)
        console.log('Say "' + hotwords[0].hotword + '"...')
        //sonus.on('hotword', (index, keyword) => console.log("!" + keyword))
        sonus.on('hotword', (index, result )=>console.log(result))
        sonus.on('partial-result', result => console.log("Partial", result))
        sonus.on('final-result', result => {
            console.log("Final", result)
            if (result.includes("stop")) {
                Sonus.stop()
            }
        })
    })
})
/*
drone.connect(function() {
    drone.setup(function() {
        drone.flatTrim()
        drone.startPing()
        drone.flatTrim()
        console.log("Connect" + drone.name)
        temporal.queue([
            {
                delay: 5000,
                task: function() {
                    drone.takeOff()
                    drone.flatTrim()
                },
            },
            {
                delay: 3000,
                task: function() {
                    drone.frontFlip()
                },
            },
            {
                delay: 5000,
                task: function() {
                    drone.land()
                },
            },
            {
                delay: 5000,
                task: function() {
                    temporal.clear()
                    process.exit(0)
                },
            },
        ])
    })
})*/
