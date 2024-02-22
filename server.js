const inquirer = require('inquirer');


// This is an array of questions, each question stores a type, message, and name
const questions = [{
    type: 'input',
    message: 'Please enter a title for this Readme:',
    name: 'title'
},
{
    type: 'input',
    message: 'Please also enter a description:',
    name: 'description'
},
{
    type: 'input',
    message: 'Please enter installation instructions:',
    name: 'installation'
},
{
    type: 'input',
    message: 'Please enter usage information:',
    name: 'usage'
},
{
    type: 'input',
    message: 'Please enter contribution guidelines:',
    name: 'contribution'
},
{
    type: 'input',
    message: 'Please enter test instructions:',
    name: 'test'
},
{
    type: 'list',
    message: 'Please choose a license:',
    name: 'license',
    choices: ['MIT', 'GPL-3.0', 'Apache-2.0', 'No license']
},
{
    type: 'input',
    message: 'Please enter your GitHub username:',
    name: 'username'
},
{
    type: 'input',
    message: 'Please enter your email address:',
    name: 'email'
}];


// Function to initialize app
function init() {
    /* The line below stores the questions that the user will see */
    inquirer.prompt(questions)

        .then((answers) => {
            // Using user feedback from .prompt to create a readme file
            const readmeContent = generateMarkdown(answers);
            writeToFile(fileName, readmeContent);
        })
        .catch((error) => {
            // Prompt couldn't be rendered in the current environment
            if (error.isTtyError) {
            } else {
                // Something else went wrong
            }
        });
}

// Function call to initialize app
init();