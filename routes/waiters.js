//import modules
import WaiterDays from "../waiter_days.js";
const waiterDays = WaiterDays()
let currentUser = ""

//Define function to add retrieve and delete waiters
export default function WaiterRoutes(waiterSchedule) {

//Define a function to log in 
    async function login(req, res) {

        try {
//Check if the user is admin or waiter 
            const role = await waiterSchedule.login(req.body.users, req.body.password);
            currentUser = req.body.users

//Redirect user to admin pages if their role is admin
            if (role === 'admin') {

                res.redirect('/home');

//Redirect user to waiter pages if their role is waiter
            } else if (role === 'waiter') {
                const result = await waiterSchedule.getEachDay()
                const groupedDays = waiterDays.cutShedule(result)
                const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject

//render the waiter page 
            res.render('Waiters/waiters', {
                    name: req.body.users,
                    groupedDays,
                    overGroupedDaysClass
                });

            }
        } catch (error) {
            req.flash('error', error.message)
            res.redirect('/login')
        }

    }


    async function addSchedule(req, res) {
        // Extract username from URL parameters
        const username = req.params.username;
        currentUser = username // Store the current user

        // Extract selected days from the request body
        let selectedDays = req.body.day;

        // Convert single selected day to an array if it's a string
        if (typeof selectedDays === 'string') {
            selectedDays = [selectedDays];
        }
        if (selectedDays) {

            try {
                // Attempt to add the selected working days for the user
                await waiterSchedule.addWaiterWorkingDate(username, selectedDays)
                currentUser = username

                // Fetch updated schedule and render the Waiters page
                const result = await waiterSchedule.getEachDay()
                const groupedDays = waiterDays.cutShedule(result)
                const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject
                req.flash('success', "Successfully booked")
                res.render('Waiters/waiters', {
                    name: username,
                    groupedDays,
                    overGroupedDaysClass
                });
            } catch (error) {
                // If an error occurs, render the Waiters page with error message
                const result = await waiterSchedule.getEachDay()
                const groupedDays = waiterDays.cutShedule(result)
                const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject
                req.flash('error', error.message)
                res.render('Waiters/waiters', {
                    name: username,
                    groupedDays,
                    overGroupedDaysClass
                });
            }

        } else {
            // If no days were selected, show an error flash message
            req.flash('error', "please select Day")
        }

    }
    //Redirect to the waiter route
    function getWaiter(req, res) {
        res.redirect('/waiter');
    }

    async function updateShedule(req, res) {
        try {
            // Fetch updated schedule and render the Waiters page
            const result = await waiterSchedule.getEachDay()
            const groupedDays = waiterDays.cutShedule(result)
            const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject

            // Render the Waiters page with updated schedule information
            res.render('Waiters/waiters', {
                name: currentUser,
                groupedDays,
                overGroupedDaysClass,
            });
        } catch (error) {
            // If an error occurs, show an error flash message
            req.flash('error', error.message)
        }
    }

    async function getShedule(req, res) {

        try {
            // Fetch the schedule and related information
            const result = await waiterSchedule.getEachDay()
            const groupedDays = waiterDays.cutShedule(result)
            const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject

            // Render the schedule page with fetched information
            res.render('Waiters/schedule', {
                schedule: await waiterSchedule.getWaiterWorkingDate(currentUser),
                groupedDays,
                overGroupedDaysClass,
                currentUser
            });
        } catch (error) {
            // If an error occurs, show an error flash message and redirect back to the waiter's page
            req.flash('error', error.message)
            res.redirect(`/waiter/${currentUser}`)
        }

    }

    async function getUsernameSchedule(req, res) {
        const username = req.params.username;
        currentUser = username
        const day = req.body.day;
        try {
             // Delete the waiter's working date for the selected day
            await waiterSchedule.deletWaiterWorkingDate(username, day)
        } catch (error) {
            // If an error occurs, show an error flash message
            req.flash('error', error.message)
        }

        // Redirect back to the schedule page
        res.redirect('/schedule');
    }
    return {
        login,
        addSchedule,
        updateShedule,
        getShedule,
        getUsernameSchedule,
        getWaiter
    }
}