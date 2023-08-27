// Execute the following code when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {

    // If there is an element with class "error"
    if (document.querySelector('.error')) {
        // If the innerHTML of the element is not empty
        if (document.querySelector('.error').innerHTML !== '') {
            // Set a timeout to clear the message after 3 seconds
            setTimeout(function () {
                document.querySelector('.error').innerHTML = '';
            }, 3000);
        }
    }
    //Get the input for signup name if it exists
    if (document.querySelector(".signUpName")) {
    const nameInput = document.querySelector(".signUpName");
    nameInput.addEventListener('keydown', function (press) {
        //validate if it is real name
        const letterRegex = /^[a-zA-Z ]*$/;
        if (!letterRegex.test(press.key)) {
            //Add the messageclass
            document.querySelector('.errorM').classList.add("mess");
            document.querySelector('.errorM').innerHTML = "Please enter real name of only letters";
            //Add remove the element
            setTimeout(function () {
                document.querySelector('.errorM').classList.remove("mess");
                document.querySelector('.errorM').innerHTML = '';
            }, 2500)
            //prevent the character
            press.preventDefault();
        }
    });
   }
    if (document.querySelector('.success')) {
        // If the innerHTML of the element is not empty
        if (document.querySelector('.success').innerHTML !== '') {
            // Set a timeout to clear the message after 3 seconds
            setTimeout(function () {
                document.querySelector('.success').innerHTML = '';
            }, 3000);
        }
    }
    // Select all elements with the class "delete"
    if (document.querySelectorAll(".delete")) {
        // Loop through each delete button
        document.querySelectorAll(".delete").forEach((button) => {
            button.addEventListener("click", (event) => {
                if (!confirm("Are you sure you want to remove this booking?")) {
                    event.preventDefault();
                }
            });
        });
    }

  // Declare a variable days to late check if the class exists
    let weekDays = [".Sunday", ".Monday", ".Tuesday", ".Wednesday", '.Thursday', ".Friday", ".Saturday"]
  // loop through each day class
    weekDays.forEach(item => {
        if (document.querySelectorAll(item)) {
            // Loop through each day button
            document.querySelectorAll(item).forEach((button) => {
                button.addEventListener("click", (event) => {
                    //check if the checkboc is checked
                    if (event.target.checked) {
                        if (!confirm("This day has enough waiters Do you want to continue with this day? Press 'Cancel' to consider another day, and 'OK' to proceed.")) {
                            event.preventDefault();
                        }
                    }
                    
                });
            });
        }
    });

});


