export default function WaiterDays() {
    let array =[]
    // Function to cut the schedule to have at most 3 items per day
    function cutShedule(result) {
        let Days = { sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }

        result.forEach(item => {
            const day = item.day;
            if (Days.hasOwnProperty(day)) {
                Days[day].push(item);
            }
        });

        for (let day in Days) {
            Days[day] = Days[day].slice(0, 3)
        }

        return Days
    }

    // Function to return all schedule information and overbooked days
    function returnAllShedule(result) {
        
        //initialize variables for the days and their fomats

        let allDays = { sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }
        let overDaysObject = { sunday: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: "", saturday: "" }
        let overDays = []
        

        //loop through each result and separate the schedule objects

        result.forEach(item => {
            const day = item.day;
            if (allDays.hasOwnProperty(day)) {
                allDays[day].push(item);
            }
        });

        //loop through the days and get the days with more than three waiters
        for (let day in allDays) {
            if (allDays[day].length > 3) {
                overDays.push(day)
            }
        }
       //store the days with more than three waiters
        overDays.forEach(item => {
            const day = item;
            if (allDays.hasOwnProperty(day)) {
                overDaysObject[day] = 'over';

            }
        });

         array=allDays

        return {
            allDays,
            overDaysObject
        }
    }
    function daysWithUser(currentUser){
        let daysWithUserArray=[]

        for (const day in array) {
            array[day].forEach(element => {
                if(element.waiter_name===currentUser){
                    daysWithUserArray.push(element.day)
                }
                
            });
        }
        return daysWithUserArray
    }

    return {
        cutShedule,
        returnAllShedule,
        daysWithUser
    };
};