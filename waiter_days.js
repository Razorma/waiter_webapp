export default function WaiterDays() {
    
    function cutShedule(result){
        let Days = { sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }

        result.forEach(item => {
            const day = item.day;
            if (Days.hasOwnProperty(day)) {
                Days[day].push(item);
            }
        });

        for(let day in Days){    
            Days[day]= Days[day].slice(0,3) 
        }

        return Days
    }
    function returnAllShedule(result){
        let allDays = { sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }
        let overDaysObject = { sunday: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: "", saturday: "" }
        let overDays = []

        result.forEach(item => {
            const day = item.day;
            if (allDays.hasOwnProperty(day)) {
                allDays[day].push(item);
            }
        });
        for(let day in allDays){    
            if(allDays[day].length > 3){
                overDays.push(day)
            }
        }

        overDays.forEach(item => {
            const day = item;
            if (allDays.hasOwnProperty(day)) {
                overDaysObject[day]='over';
                
            }
        });

        return {
            allDays,
            overDays
        }
    }
     
    return {
        cutShedule,
        returnAllShedule
    };
};