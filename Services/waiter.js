let waiters = []
let filteredWaiters = []
let Days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

export default function WaiterSchedule(db) {
    let nameError = ""
    let name = ""
    let password = ""
    async function addWeiter(waiter, enteredPassword) {
        let nameRegex = /^[a-zA-Z ]*$/

        if (waiter.trim()!== '' && nameRegex.test(waiter)) {
            name = waiter.trim()
            password = enteredPassword
            const checkUsernameQuery = `
            SELECT user_name , password FROM waiters WHERE user_name = $1 AND password = $2 ;
        `;
            const result = await db.query(checkUsernameQuery, [name, password]);
            console.log('Query result:', result);

            if (result.length !== 0) {
                console.log(`username with the name '${name}' exists.`);
                return;
            }
            const insertQuery = `
                INSERT INTO waiters (user_name, password)
                VALUES ($1, $2);
            `;

            await db.query(insertQuery, [name, password]);
            console.log(`username with the name '${name}' added.`);


        } else {
            console.log(`please enter only letters`);
            nameError = "please enter only letters"
        }
    }
    async function login(waiter, enteredPassword) {
        const checkUsernameQuery = `
            SELECT user_name , password FROM waiters WHERE user_name = $1 AND password = $2 ;
        `;
            const result = await db.query(checkUsernameQuery, [waiter, enteredPassword]);
            console.log('Query result:', result);

            if (result.length !== 0) {
                console.log(`username with the name '${name}' exists.`);
                return;
            }
            name =  waiter
    }

    function getusername() {
        return name
    }

    function getEachDay() {
        const groupedDays = {}; 


        Days.forEach(day => {
            groupedDays[day] = [];
        });


        filteredWaiters.forEach(item => {
            const day = item.day.toLowerCase();


            if (groupedDays.hasOwnProperty(day)) {
                groupedDays[day].push(item);
            }
        });

        return groupedDays;
    }

    return {
        addWeiter,
        login,
        getusername,
        getEachDay
    };
};