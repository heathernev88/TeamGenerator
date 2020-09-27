const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employees = [];

const allEmployees = [
    {
        type: "input",
        message: "What is the name of the employee",
        name: "name",
    },
    {
        type: "input",
        message: "What is that employees ID number?",
        name: "id"
        
    },
    {
        type: "input",
        message: "What is the email address of the employee?",
        name: "email"
        
    },
    {
        type: 'list',
        message: "What is the role of that employee?",
        name: "role",
        choices: ["Manager", "Engineer", "Intern"]
    }
]

function employeeRole (role) {
    return [
        {
        type: 'input',
        name: 'officeNumber',
        message: "What is the Manager's office number?",
        when: () => role == "Manager"
        },
        {
        type: 'input', 
        name: 'school',
        message: "What school does the intern attend?",
        when: () => role == "Intern"
        },
        {
        type: 'input', 
        name: 'github',
        message: 'What is the Github username of the engineer?',
        when: () => role == "Engineer"
        }
    ]
}

const anotherEmployee = {
    type: "confirm",
    name: 'another',
    message: "Would you like to add another employee?"
}



function promptQuestions() {
    inquirer.prompt(allEmployees).then((answers) => {
        inquirer.prompt(employeeRole(answers.role)).then ((answersRole) => {
            inquirer.prompt(anotherEmployee).then ((answersAnother) => {
                let teamMember;
                switch (answers.role) {
                    case "Manager":
                        teamMember = new Manager (answers.name, answers.id, answers.email, answersRole.officeNumber);
                        break; 
                    case "Engineer":
                        teamMember = new Engineer (answers.name, answers.id, answers.email, answersRole.github);
                        break; 
                    case "Intern":
                        teamMember = new Intern (answers.name, answers.id, answers.email, answersRole.school);
                        break; 

                    } 
                    employees.push(teamMember)

                    if(answersAnother.another) {
                        promptQuestions()
                    } else {
                        let html = render(employees);
                        fs.writeFile(outputPath, html, 'utf8', function (error) {
                            if (error) {
                                throw error;
                            } else {
                                console.log("Your file was succesfully created")
                            }

                        })
                    }
            })
        })
    })
}

promptQuestions();