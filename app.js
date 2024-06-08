/**
 * Introduction: This commit bulids data models of the FSR algorithm:-
 *      [1] Flight Chart (row-major) model, and 
 *      [2] Passengers Queue (FIFO) model
 * Technology: Node.js (back-end)
 * Required User Inputs:
 *      Example Seat Input (Col-major): [[3,2], [4,3], [2,3], [3,4]]
 *      Number of Passengers: Enter any +ve intiger number 
 * Contributed by: Esrael G.
 **/
let seatInputs = [], pQueue = [], fChart = [];//Input Space - list of variables for I/O storage 
//Axulary Space - list of (global variables) for computation:
let totalSeats = 0, resultSeat = [], rsCatList, i = 0, j; //data processing 
let nextType = 0, cat, row, col = -1, nextPID = 0; //Mimorization approach
let myCounter = 0, rsCounter = 0;//uitilized in latter implmentaion 

let model = { //an object to get inputs and create flight model
    init: function () {
        const rl = require('readline-sync'); //thrid-part liberary for accepting user input
        let stringInput, qLent;
        console.log(`Example Seat Inputs(Col-major):`, [[3, 2], [4, 3], [2, 3], [3, 4]]);
        stringInput = String(rl.question('Enter Seat Inputs:'));//Get seat inputs
        qLent = Number(rl.question(`Enter Number of Passengers:`));//Any +ve intiger number

        arrayInput = model.parseInput(stringInput); // Parse string input to array
        model.isInputValid(arrayInput, qLent)//verifies user inputs 
        //Generate Fligh Chart model
        arrayInput.forEach(myInput => {
            seatInputs.push([myInput[1], myInput[0]]); //generat row-major seat-inputs
            newSeat = new Array(myInput[1]).fill().map(() => new Array(myInput[0]).fill(null))
            fChart.push(newSeat); //add new set to flight chart
            totalSeats += (myInput[1] * myInput[0]);
        });
        //Generate Passengers Queue (FIFO) as a dictionary
        pQueue = Array(qLent).fill().map(() => ({ Name: null, PID: ++nextPID, Seat: null }));
    },
    //Accept a string from input in the format '[[x,y],[x,y]]' and return an array [[x,y],[x,y]]
    parseInput: function (strInput) {
        strInput = strInput.replace(/\s/g, ''); //remove extra spaces
        strInput = strInput.substring(2, strInput.length - 2); //remove first and last 2 symbol
        let arrayInput = strInput.split("],[").map((element) => { //transform string to array
            return element.split(",");
        });
        for (i = 0; i < arrayInput.length; i++) {//replace strings to numbers
            for (j = 0; j < arrayInput[i].length; j++) {
                arrayInput[i][j] = parseInt(arrayInput[i][j]);
            };
        };
        return arrayInput;
    },
    isInputValid: function (seatInputs, passengers) {
        if (seatInputs.length > 8) {
            console.log('Too many sections with the rows and columns!');
            return false;
        };
        for (i = 0; i < seatInputs.length; i++) {
            for (j = 0; j < seatInputs[i].length; j++) {
                if (seatInputs[i][j] < 1) {
                    console.log('The rows and columns must be more than 0!');
                    return false;
                };
                if (Number.isNaN(seatInputs[i][j])) {
                    console.log('The rows and columns must be a number!');
                    return false;
                };
            }
        }
        if (passengers < 1 || passengers % 1 != 0) {
            console.log('Incorrect input!');
            return false;
        };
    }
}

//Driver codes 
model.init();
if (fChart.length !== 0 && pQueue.length !== 0) {
    console.log(`\nPassengers Queue [FIFO]:`)
    console.table(pQueue);
    console.log(`\nFlight Chart [row-major]:\n`, fChart)
} else {
    console.log("Data Encoding Error, try agin!")
}