export type ButtonAlarmConfig = {
    x: number,
    y: number,
    width: number,
    height: number,
    padding: number,
    initialText: string,
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle,
    time1: number,
    time2: number,
    alarm_time: number
}

export class ButtonAlarm extends Phaser.GameObjects.Container {
    private readonly box: Phaser.GameObjects.Rectangle;
    private readonly text: Phaser.GameObjects.Text;
    private readonly bar: Phaser.GameObjects.Graphics;

    private readonly config: ButtonAlarmConfig;
    private counter_max: number;
    private counter_val: number;
    private start_time: number;
    private isBeeped: boolean;


    constructor(
        public scene: Phaser.Scene,
        {x, y, width, height, padding=5, initialText='', textStyle={}, time1=100, time2=100, alarm_time = 0}: ButtonAlarmConfig
    ) {
        super(scene, 0, 0);
        // 白枠付きの黒いRectangleを作成
        this.box = new Phaser.GameObjects.Rectangle(
            this.scene,
            x, y, width, height, 0x000000
        ).setStrokeStyle(1, 0xffffff);
        this.box.setInteractive({
            useHandCursor: true
        })
        this.box.on(
            'pointerup',
            () => {this.onclick()}
        )
        this.add(this.box)
        // プログレスバーを作成
        this.bar = new Phaser.GameObjects.Graphics(
            this.scene
        );
        this.bar.clear()
        this.add(this.bar)
        // Textを作成
        this.text = new Phaser.GameObjects.Text(
            this.scene,
            width/4,
            y,
            initialText,
            textStyle
        )
        this.add(this.text)
        // Sound
        this.scene.sound.pauseOnBlur = false;

        this.counter_val = -1;
        this.counter_max = -1;
        this.start_time = 0;
        this.isBeeped = false;
        this.config = {
            x: x,
            y: y,
            width: width,
            height: height,
            padding: padding,
            initialText: initialText,
            textStyle: textStyle,
            time1: time1,
            time2: time2,
            alarm_time: alarm_time
        }
    }

    // クリック時の処理
    onclick () {
        if (this.counter_val == -1) {
            this.counter_max = this.config.time1;
            this.counter_val = this.config.time1;
            this.start_time = new Date().getTime();
            this.isBeeped = false;
        } else {
            this.counter_max = -1;
            this.counter_val = -1;
        }
    }
    // 定期処理 (10ms)
    public onTick() {
        // 減算処理
        if (this.counter_val < 0) {
            this.text.setText(this.config.initialText);
            return;
        } else {
            let progress = new Date().getTime() - this.start_time;  // スタートからの時間(ms)
            progress = Math.ceil(progress / 10);  // スタートからの時間(10ms)
            this.counter_val = this.counter_max - progress;
            this.onProgress();
        }
        // アラーム音判定
        if (this.counter_val <= this.config.alarm_time && !this.isBeeped) {
            this.scene.sound.play('beep');
            this.isBeeped = true;
        }
        // 残り時間0処理
        // 初期化
        if (this.counter_val <= 0 && this.config.time2 == 0) {
            this.counter_val = -1;
            this.counter_max = -1;
            this.text.setText(this.config.initialText);
            return;
        }
        // タイマーループ
        if (this.counter_val <= 0 && this.config.time2 > 0) {
            this.counter_max = this.config.time2;
            this.counter_val = this.config.time2;
            this.start_time = new Date().getTime();
            this.isBeeped = false;
        }
        // 残り時間表示
        let min = Math.ceil(this.counter_val / 100) - 1
        let sec = (this.counter_val % 100)
        let timerStr = String(min) + ':' + String(sec)
        this.text.setText(timerStr)
    }
    // プログレスバー描画
    private onProgress() {
        let progress = this.counter_val / this.counter_max;
        this.bar.clear();
        this.bar.fillStyle(0x888888, 0.8);
        this.bar.fillRect(
            this.config.x - this.config.width/2 + this.config.padding,
            this.config.y - this.config.height/2 + this.config.padding,
            (this.config.width - this.config.padding * 2) * progress,
            this.config.height - this.config.padding*2
        )
    }
}