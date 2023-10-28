//import modules
import express  from "express";
import WaiterDays from "../waiter_days.js";
import session from "express-session";
import jwtTokens from "../utils/jwtTokenHelpers.js";
let app = express();
app.use(session({ 
    secret: 'Razorma', 
    resave: false,
    saveUninitialized: true,
  }));


const waiterDays = WaiterDays()


//Define function to add retrieve and delete waiters
export default function WaiterRoutes(waiterSchedule) {

    //Define a function to log in 
    async function login(req, res) {

        try {
            //Check if the user is admin or waiter 
            const userInfo = await waiterSchedule.login(req.body.users, req.body.password);
            req.session.currentUser = req.body.users

            //Redirect user to admin pages if their role is admin
            if (userInfo.role === 'admin') {
                const tokens = jwtTokens(userInfo)
                res.cookie('user-token', tokens.accessToken, { httpOnly: true })
                res.redirect('/home');

                //Redirect user to waiter pages if their role is waiter
            } else if (userInfo.role === 'waiter') {
                const tokens = jwtTokens(userInfo)
                res.cookie('user-token', tokens.accessToken, { httpOnly: true })
                let userSchedule = []
                const result = await waiterSchedule.getEachDay()
                const groupedDays = waiterDays.cutShedule(result)
                const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject
                const daysWithUser = waiterDays.daysWithUser(req.body.users)
                const allDays = waiterDays.returnAllShedule(result).allDays
                for (const day in allDays) {
                    allDays[day].forEach(element => {
                        if(element.waiter_name===req.body.users){
                            userSchedule.push(element.waiter_name)
                        }
                        
                    });
                }
                if(userSchedule.length!==0){
                    res.redirect("/schedule")
                }else{
                //render the waiter page 
                res.render('Waiters/waiters', {
                    name: req.body.users,
                    groupedDays,
                    overGroupedDaysClass,
                    daysWithUser 
                });
               }

            }
        } catch (error) {
            req.flash('error', error.message)
            res.redirect('/login')
        }

    }


    async function addSchedule(req, res) {
        // Extract username from URL parameters
        const username = req.params.username;
        req.session.currentUser = username // Store the current user

        // Extract selected days from the request body
        let selectedDays = req.body.day;

        // Convert single selected day to an array if it's a string
        if (typeof selectedDays === 'string') {
            // selectedDays = [selectedDays];
            const result = await waiterSchedule.getEachDay()
            const groupedDays = waiterDays.cutShedule(result)
            const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject
            const daysWithUser = waiterDays.daysWithUser(req.params.username)
            if(daysWithUser.length===0){
                req.flash('error', "Please select more than one day")
                res.render('Waiters/waiters', {
                    name: username,
                    groupedDays,
                    overGroupedDaysClass,
                    daysWithUser
                });
                return
            }else{
                selectedDays = [selectedDays];
           }
        }
        if (selectedDays) {
            

                try {
                    // Attempt to add the selected working days for the user

                    await waiterSchedule.addWaiterWorkingDate(username, selectedDays)
                    req.session.currentUser = username

                    // Fetch updated schedule and render the Waiters page
                    const result = await waiterSchedule.getEachDay()
                    const groupedDays = waiterDays.cutShedule(result)
                    const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject
                    const daysWithUser = waiterDays.daysWithUser(req.params.username)
                    req.flash('success', "Successfully booked")
                    res.render('Waiters/waiters', {
                        name: username,
                        groupedDays,
                        overGroupedDaysClass,
                        daysWithUser
                    });
                } catch (error) {
                    // If an error occurs, render the Waiters page with error message
                    const result = await waiterSchedule.getEachDay()
                    const groupedDays = waiterDays.cutShedule(result)
                    const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject
                    const daysWithUser = waiterDays.daysWithUser(req.params.username)
                    req.flash('error', error.message)
                    res.render('Waiters/waiters', {
                        name: username,
                        groupedDays,
                        overGroupedDaysClass,
                        daysWithUser
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
            const daysWithUser = waiterDays.daysWithUser(req.session.currentUser)

            // Render the Waiters page with updated schedule information
            res.render('Waiters/waiters', {
                name: req.session.currentUser,
                groupedDays,
                overGroupedDaysClass,
                daysWithUser
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
            const daysWithUser = waiterDays.daysWithUser(req.session.currentUser)

            // Render the schedule page with fetched information
            res.render('Waiters/schedule', {
                schedule: await waiterSchedule.getWaiterWorkingDate(req.session.currentUser),
                groupedDays,
                overGroupedDaysClass,
                currentUser:req.session.currentUser,
                daysWithUser
            });
        } catch (error) {
            // If an error occurs, show an error flash message and redirect back to the waiter's page
            req.flash('error', error.message)
            res.redirect(`/waiter/${req.session.currentUser}`)
        }

    }

    async function getUsernameSchedule(req, res) {
        const username = req.params.username;
        req.session.currentUser = username
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