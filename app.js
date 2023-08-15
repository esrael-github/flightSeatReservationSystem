/**
 * Cotributed by Esrael Geremew 
 * IMPLMENTATION TIPS: Mimorization approach is used to improves the perforamce of a program
 *  by storing previously processed values.
 * Total Space Complexity = Input Space + Auxiliary Space(global+local)
 **/
let seatInputs = [], pQueue, flight = [];//Input Space - list of variables for I/O storage 

let totalSeats = 0, resultSeat = [], rsCounter=0, i = 0, j; //Axulary Spaces FOR data processing 
let nextType = 0, cat, row, col = -1, nextPID = 0; //Axulary Spaces to adopt Mimorization approach

let myCounter=0, app_status_inicator = -1;//Axulary Spaces reserved for app status checking

//A function to get the next aviliable seat attributs
function nextSeat() { 
    myCounter++;
    if (col === -1) {
        resultSeat = [];
        if (nextType === 1) { // Test cases for 'Window type' seats
            resultSeat.push(0);
            rsCounter += seatInputs[0][0];
            if (seatInputs.length > 1) {
                resultSeat.push(seatInputs.length - 1);
                rsCounter += seatInputs[seatInputs.length - 1][0];
            } else {
                if (seatInputs[0][1] > 1) { rsCounter += seatInputs[0][0] };
            };
        } else {
            for (i = 0; i < seatInputs.length; i++) { //inner loop
                if (nextType === 0) {//Test cases for 'Aisle type' seats  
                    if (seatInputs.length > 1) {
                        if (i === 0 || i === seatInputs.length - 1) {
                            if (seatInputs[i][1] > 1) {
                                resultSeat.push(i);
                                rsCounter += seatInputs[i][0];
                            }
                        } else {
                            resultSeat.push(i);
                            if (seatInputs[i][1] > 1) {
                                rsCounter += (seatInputs[i][0] * 2);
                            } else {
                                rsCounter += seatInputs[i][0];
                            }
                        }
                    };
                } else { //if (nextType === 2) { Test cases for 'Middel type' seats
                    if (seatInputs[i][1] > 2) {
                        resultSeat.push(i);
                        rsCounter += (seatInputs[i][0] * (seatInputs[i][1] - 2));
                    };
                }
            }
        }
        if (resultSeat.length > 0) {
            j = row = 0;
            cat = resultSeat[j];
            if (nextType === 0) {
                if (cat === 0) {
                    col = seatInputs[cat][1] - 1;
                } else { col = 0 };
            }else if (nextType === 1) {
                col = 0;
            } else { col = 1 };
            console.log('[Next Seat*] Type:'+nextType+', Result:'+rsCounter+'_per_'+totalSeats);
        } else {
            console.log('[Next Seat*] Type:'+nextType+', Result: No');
            nextType += 1;
            nextSeat();
        }
    } else {
        if (nextType === 0) {//Aisle seat cell test cases
            if (cat === seatInputs.length - 1) {
                j = 0, row += 1;
                cat = resultSeat[j];
                if (cat === 0) {
                    col = seatInputs[cat][1] - 1;
                } else {
                    col = 0;
                }
            } else {
                if (col === seatInputs[cat][1] - 1) {
                    if (j === resultSeat.length - 1) {
                        j = 0, row += 1;
                        cat = resultSeat[j];
                        if (cat === 0) {
                            col = seatInputs[cat][1] - 1
                        } else {
                            col = 0;
                        }
                    } else {
                        cat = resultSeat[++j];
                        col = 0;
                    }
                } else {
                    col = seatInputs[cat][1] - 1;
                }
            }
            if (seatInputs[cat][0] <= row) { nextSeat() };
        } else if (nextType === 1) {//window seat cell test cases
            if (resultSeat.length > 1) {
                if (j === 0) {
                    cat = resultSeat[++j];
                    col = seatInputs[cat][1] - 1;
                } else {
                    cat = resultSeat[--j];
                    row += 1, col = 0;
                }
            } else {
                if (col === seatInputs[cat][1] - 1) {
                    row += 1, col = 0;
                } else {
                    col = seatInputs[cat][1] - 1;
                }
            }
            if (seatInputs[cat][0] <= row) { nextSeat() };
        } else if (nextType === 2) { //middle seat test cases
            if (col === seatInputs[cat][1] - 2) {
                col = 1;
                if (j === resultSeat.length - 1) {
                    j = 0;
                    cat = resultSeat[j];
                    row += 1;
                } else {
                    cat = resultSeat[++j];
                }
            } else {
                col += 1;
            }
            if (seatInputs[cat][0] <= row) { nextSeat() };
        }
    }
}
//A function to assign seats as order of aisle -> window -> middle type
function assignNextFlight() {
    if (pQueue.length > totalSeats) {
        console.log(`=> Only the first ` + totalSeats +
            ` passengers will be able to fly away.`)
    };
    while (pQueue.length != 0) {
        nextPID = pQueue[0].PID;
        nextSeat(); //get next Seat cat,row and col 
        flight[cat][row][col] = nextPID; //asign the resulted seat to the passenger in queue
        console.log('[Seat]->[', cat, row, col, ']<=>[PID]->[', nextPID, ']');
        pQueue = pQueue.slice(1, pQueue.length)//FIFO princeple on Array elements with O(1)
        if (nextPID === totalSeats) { return nextPID };
        if (--rsCounter === 0) {
            console.log('.., reserved sucessfuly.')
            col = -1;
            nextType += 1;
        };
    }//end of pQueue loop
}//end of assignNextFlight func.
let View = {
    getFlightStatus : function(vReq_msg){
        let status_aler = 'Flight Status:->';
        if(app_status_inicator === 0){
            status_aler +='Data Processing ...';
            console.log(status_aler+'\n'+'Flight Chart:\n',flight,'\n'+vReq_msg);
        }else if(app_status_inicator === 1) {
            status_aler +='Rady ...';
            console.log(status_aler+'\n'+vReq_msg);
        }else{
            status_aler +='Not Rady ...';
            console.log(status_aler + vReq_msg+'!');
        }
    }
    };
//An object to get inputs and create flight model
let controller = { 
    init: function () {
        View.getFlightStatus('Set Flight Data!')
        const rl = require('readline-sync'); //thrid-part liberary for user inputs
        //Get user input-1: list of columen-major seat inputs
        console.log(`Sample Seat Inputs(Col-major) :`, [[3, 2], [4, 3], [2, 3], [3, 4]]);
        let stringInput = String(rl.question('[Column-major] Enter Seat Inputs:'));
        arrayInput = controller.parseInput(stringInput); // Parse string input to array
        //Get user input-2: number of passengers wating in Queue
        let queLent = Number(rl.question(`Enter Number of Passengers:`));//length of pQueue
        //Check the validation of user inputs 
        if (controller.isInputValid(arrayInput, queLent) === false) { 
            View.getFlightStatus('Terminated');
            return false };
        //Generate flight and queue models
        arrayInput.forEach(myInput => {
            seatInputs.push([myInput[1], myInput[0]]); //generat row-major seat-inputs
            totalSeats += (myInput[1] * myInput[0]);
            //generate new seat model
            newSeat = new Array(myInput[1]).fill().map(() => new Array(myInput[0]).fill(null))
            flight.push(newSeat); //Update flight chart
        });
       pQueue = Array(queLent).fill().map(() => (
            { Name: null, PID: ++nextPID, Seat: null } ));
        app_status_inicator++;
        View.getFlightStatus('Flight Data Models Created Sucessfuly!')
    },
    //get a string from input in the format '[[x,y],[x,y]]' and return an array [[x,y],[x,y]]
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
controller.init();
//Initialize Flight Seatting Algorithm 
const nextFlight = assignNextFlight();
console.log('[Done] Row-major Flight Seatting:\n', flight);
console.log("App Time Complexity =", myCounter);
/**
 * Version: 1.0.1
 * Improvment: Queue element accesss 
 * Time complexity: Ordere of Passengers to one [O(P) Vs. O(1)] 
 */

/**Error Logo:- not fixed 
Sample Seat Inputs(Col-major) : [ [ 3, 2 ], [ 4, 3 ], [ 2, 3 ], [ 3, 4 ] ]
[Column-major] Enter Seat Inputs:console.log('Flight Chart: ',flight);
Enter Number of Passengers:56  */