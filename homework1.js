require('colors')

function isPrimes(num) {
    for (let i = 2, max = Math.sqrt(num); i <= max; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num > 1;
}

const Colors = {Green: 0, Yellow: 1, Red: 2}
const startRange = process.argv[2];
const endRange = process.argv[3];
let isColor = Colors.Green;
let noPrimes = true;


const printColor = (num) => {
    isColor++;
    if (isColor > Colors.Red)
        isColor = Colors.Green;
    if (noPrimes) noPrimes = false;
    switch (isColor) {
        case Colors.Red:
            console.log(`${num}`.red);
            break;
        case Colors.Green:
            console.log(`${num}`.green);
            break;
        case Colors.Yellow:
            console.log(`${num}`.yellow);
            break;
    }
}

for (let i = startRange; i <= endRange; i++){
    if (isPrimes(i)) printColor(i);
}
if(noPrimes)
    console.log(`В этом диапазоне нет простых чисел[${startRange},${endRange}]`.red);
