const EventEmitter = require('events');

class TimerEmitter extends EventEmitter {
    constructor() {
        super();
    }
}

class TimerHandler {
    static tick(name, payload) {
        if (Number.isInteger(payload)) {
            let numb = setInterval(() => {
                TimerHandler.log(name, payload);
                payload--;

                if (payload < 0) {
                    TimerHandler.stop(name, numb);
                }
            }, 1000);
        } else {
            TimerHandler.log(name, payload);
        }
    }

    static stop(name, intervalNumb) {
        clearInterval(intervalNumb);
        console.log(`${(name)} - Время закончилось!`)
    }

    static arrData(arr) {
        if ((arr[0] > 23) || (arr[1] > 30) || (arr[2] > 12)) {
            return new Error('!Введите допустимое значение!')
        }

        let unixTime = 0;
        if (arr[0]) {
            unixTime += arr[0] * 3600;
        }
        if (arr[1]) {
            unixTime += arr[1] * 86400;
        }
        if (arr[2]) {
            unixTime += arr[2] * 2629743;
        }
        if (arr[3]) {
            unixTime += arr[3] * 31556926;
        }

        return unixTime;
    }

    static log(name, payload) {
        console.log(`${(name)} Осталось времени: ${(payload)}`);
    }
}

class Timer {
    constructor(params) {
        this.name = params.name;
        this.payload = params.payload;
    }
}

const timerEmitter = new TimerEmitter();
timerEmitter.on('tick', TimerHandler.tick);

if (process.argv[2]) {
    const moreThanOneTimer = (process.argv[2].split(' ').length > 1)
    let arr = (moreThanOneTimer)
        ? process.argv[2].split(' ')
        : process.argv[2].split('-');

    const run = async () => {
        let timerNu = 1;
        if (moreThanOneTimer) {
            for (const el of arr) {
                const timer = new Timer(
                    {
                        name: `nu-${timerNu++}`,
                        payload: TimerHandler.arrData(el.split('-'))
                    });
                timerEmitter.emit('tick', timer.name, timer.payload);
            }
        } else {
            const timer = await new Timer({name: `nu-${timerNu++}`, payload: TimerHandler.arrData(arr)});
            timerEmitter.emit('tick', timer.name, timer.payload);
        }
    }
    run();
}

