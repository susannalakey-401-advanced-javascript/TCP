const net = require('net');
const inquirer = require('inquirer');

const moment = require('moment');
moment().format();

const client = new net.Socket();

client.connect(3001, 'localhost', () => { });

let name;
const messages = [];
const usersList = [];

function sendTime(text) {
  let time;
  if (text.substr(0, 6) === '/time') {
    time = moment().format('LT');
  } else {
    time = `<${name}> ${text}`
  }
  const event = JSON.stringify({
    eventType: 'time',
    payload: `<${name}> ${time}`
  })
  client.write(event);
}

function sendMessage(text) {
  let message;
  if (text.substr(0, 4) === '/me ') {
    message = `${name} ${text.substr(4)}`
  } else {
    message = `<${name}> ${text}`
  }
  const event = JSON.stringify({
    eventType: 'message',
    payload: message
  })
  client.write(event)
}

function listUsers(text) {
  let users;
  if (text.substr(0, 5) === '/who') {
    users = usersList;
  } else {
    message = `<${name}> ${text}`
  }
  const event = JSON.stringify({
    eventType: 'who',
    payload: users
  })
  client.write(event)
}

client.on('data', data => {
  const event = JSON.parse(data);
  if (event.eventType === 'message') {
    messages.push(event.payload)
    console.clear()
    messages.forEach(message => console.log(message))
    console.log('');
  } else if (event.eventType === 'time') {
    console.log(event.payload)
  } else if (event.eventType === 'who') {
    console.log(event.payload)
  }
});

async function getName() {
  console.clear();
  const input = await inquirer.prompt([{ name: 'name', message: 'What is your name?' }])
  name = input.name;
  usersList.push(name);
  console.log('Your name is', name)
}


async function getInput() {
  const input = await inquirer.prompt([{ name: 'text', message: ' ' }])
  if (input.text === '/time') {
    sendTime(input.text)
  } else if (input.text === '/who') {
    listUsers(input.text)
  }
  else {
    sendMessage(input.text);
  }
  getInput();
  // console.log('Your input is ', input)
}


getName();
getInput();