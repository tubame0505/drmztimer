import * as Phaser from 'phaser';
import {ButtonAlarm, ButtonAlarmConfig} from "./class/ButtonAlarm";

class MyScene extends Phaser.Scene {
    constructor() {
        // Phaser.Sceneのコンストラクタにはstringかオブジェクト（Phaser.Types.Scenes.SettingsConfig）を渡す
        // 以下は { key: 'myscene' } を渡したのと同義になる
        super('myscene');
    }

    preload() {
        // アセット読み込み
        this.load.image('sky', 'assets/sky1.png');
        this.load.audio('beep', 'assets/Countdown06-2.mp3');
    }

    create() {
        const { width, height } = this.game.canvas;
        // 画像とテキストを配置
        this.add.image(width/2, height/2, 'sky');
        const textStyle0: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
            fontSize: '12px'
        };
        this.add.text(0, 520, "デルメゼタイマー：クリックするとタイマーがスタート\n\n音源はオトロジック(CC BY 4.0)からお借りしました。\n", textStyle0)
        // ボタン配置
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
            fontSize: '48px'
        };
        /*
        const buttonAlarmConfig: ButtonAlarmConfig = {
            x: 200,
            y: 300,
            width: 200,
            height: 50,
            padding: 5,
            initialText: "CLICK",
            textStyle: textStyle,
            time1: 146500 / 10,
            time2: 17550 / 10,
            alarm_time: 3000 / 10
        }
        */
        const buttonAlarmConfig1: ButtonAlarmConfig = {
            x: 400,
            y: 100,
            width: 800,
            height: 200,
            padding: 5,
            initialText: "コールサファイア",
            textStyle: textStyle,
            time1: 146500 / 10,
            time2: 0 / 10,
            alarm_time: 3000 / 10
        }
        const buttonAlarmConfig2: ButtonAlarmConfig = {
            x: 400,
            y: 300,
            width: 800,
            height: 200,
            padding: 5,
            initialText: "スクランブルサファイア",
            textStyle: textStyle,
            time1: 146500 / 10,
            time2: 17550 / 10,
            alarm_time: 3000 / 10
        }
        const button1 = new ButtonAlarm(this, buttonAlarmConfig1);
        const button2 = new ButtonAlarm(this, buttonAlarmConfig2);
        this.add.existing(button1);
        this.add.existing(button2)
        // timer作成
        const timer = this.time.addEvent({
            delay: 10,
            loop: true
        })
        timer.callback = () => {
            button1.onTick();
            button2.onTick();
        }
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,  // webGLを使うかcanvasを使うかをphaserが自動で判断してくれる
    width: 800,
    height: 600,
    //resolution: window.devicePixelRatio,  // Retina環境で多少見た目がよくなる
    parent: 'game-app',  // #game-app内にcanvasを生成
    scene: MyScene
};

new Phaser.Game(config);