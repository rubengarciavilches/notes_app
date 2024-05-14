# Portfolio & Notes App

This is the front end part of a project aimed at creating a simple Notes App, it uses React, HTML, SCSS and API calls.
In addition to the Notes App, there is my portfolio, just aiming at providing anyone who visits with access to the 
Notes App and resources relevant to me.\
Please refer to the back-end part of the project in order to have a working Notes App, available at my GitHub: 
https://github.com/rubengarciavilches/rubengv_spring

### Notes App: 
It allows the user to create, read, update and delete any number of notes, which are constantly updated with the server,
in addition to that, it manages the authentication of users while using the app, restricting access only to the relevant
parts, it allows the use of temporary accounts for the purpose of testing the website.

### Portfolio:
It _very elegantly_ (basic HTML & CSS) displays information relevant to Rubén García, a person very close to me, 
and whom I would genuinely recommend to any and all recruiters or developers currently looking at this project
(it is me, I am Rubén), it is accessible in English and Spanish.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing 
purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need to have installed Node.js and npm for this project to work, you can do so from https://nodejs.org/en/download, 
it includes npm, you will also need an editor of your choosing, [VS Code](https://code.visualstudio.com/) is very often 
recommended, although this project was developed using [WebStorm](https://www.jetbrains.com/webstorm/), free for
Students and Teachers.

If the ``npm`` commands do not work, you might have to restart the terminal or editor being used.

### Installing

You need to follow very few steps in order to get this project working.\
Open the project in your preferred editor or in the terminal, and install all the node dependencies.
Please take note that you have to run this code at the directory where `package.json` is present.

### `npm install`

Now all the dependencies should have been installed, let your editor or IDE some time to update its indexes.\
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

All parts of the Portfolio will work at this moment, the Notes App will require the back-end to be running and reachable.

You may have to specify your current back-end port or website in `src/dbcalls.ts`

## Deployment

For the deployment of this part of the project, Vercel was chosen for the simplicity it provides, you may follow the 
instructions for that at:

You may also deploy the front-end manually, using commands like the following to build it, and deploy it locally:

```
npm install
npm run build

npm install -g serve
serve -s build &
```

This approach may need further work, we recommend the Vercel approach or other pre-built solutions.

## Built With

* [React](https://react.dev/) - The web framework used.
* [SCSS](https://sass-lang.com/) - Better management of style files.
* [Vercel](https://vercel.com/) - Deployment website chosen.

## License

This project is licensed under the MIT License.

## Acknowledgments

* [Icons8](https://icons8.com/) - Icons used.
* [Stackoverflow](https://sass-lang.com/) - Better management of style files.
* [Vercel](https://vercel.com/) - Deployment website chosen.
* [Dog](https://www.rubengv.com/dog.jpg) - For emotional support and code review.