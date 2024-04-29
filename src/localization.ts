import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

//https://locize.com/blog/react-i18next/

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    portfolio: {
                        greetings: {
                            part1: 'Hello, I am Ruben.',
                            part2: 'I design and build things.'
                        },
                        about_me: {
                            part1: "University student with an affinity to tinkering, weightlifting, video games, cooking and baking.",
                            part2: "Pursing a BE in Computer Science at the Polytechnic University of Madrid (UPM).",
                            part3: "Worked at Accenture as a Developer.",
                            part4: "Applied Associate's Degree in Multiplatform App Development",
                        },
                        buttons: {
                            resume: "Get my Resume",
                            resume_link: "./resume_en.pdf",
                            notes_app: "Notes App",
                            github: "My Github",
                            linkedin: "LinkedIn",
                            hire_me: "Hire Me",
                        }
                    },
                    notes_app: {
                        header: "Easily organize all your notes",
                        basic_auth: {
                            sign_up: "Sign Up!",
                            username: "Username",
                            username_placeholder: "Write your username",
                            log_in: "Log In",
                            log_in_msg: "Log in to continue",
                            email: "Email address",
                            email_placeholder: "Write your email address",
                            password: "Password",
                            password_placeholder: "Write your password",
                            have_account_msg: "Already have an account?",
                            no_account_msg: "Don't have an account?",
                            log_in_guest: "Log in as Guest",
                            logged_in_msg: "You are logged in as ",
                            log_out: "Log Out"
                        },
                        note: {
                            title: "Title",
                            note_placeholder: "Take a note...",
                            confirm_delete: "Confirm Delete?",
                            cancel: "Cancel",
                            delete: "Delete",
                            save: "Save",
                            close: "Close",
                        },
                    }
                }
            },
            es: {
                translation: {
                    portfolio: {
                        greetings: {
                            part1: 'Hola, soy Rubén.',
                            part2: 'Diseño y construyo cosas'
                        },
                        about_me: {
                            part1: 'Estudiante universitario con afinidad por experimentar, levantar pesas, videojuegos, cocina y repostería.',
                            part2: 'Matriculado en Ingeniería Informática en la Universidad Politécnica de Madrid (UPM).',
                            part3: 'Trabajé en Accenture como Desarrollador.',
                            part4: "Grado Superior en Desarrollo de Aplicaciones Multiplataforma.",
                        },
                        buttons: {
                            resume: 'Mi Currículum',
                            resume_link: './resume_es.pdf',
                            notes_app: 'App de Notas',
                            github: 'Mi Github',
                            linkedin: "LinkedIn",
                            hire_me: 'Contrátame'
                        }
                    },
                    notes_app: {
                        header: "Organiza fácilmente todas tus notas",
                        basic_auth: {
                            sign_up: "¡Regístrate!",
                            username: "Nombre de usuario",
                            username_placeholder: "Escribe tu nombre de usuario",
                            log_in: "Iniciar sesión",
                            log_in_msg: "Inicia sesión para continuar",
                            email: "Correo electrónico",
                            email_placeholder: "Escribe tu dirección de correo electrónico",
                            password: "Contraseña",
                            password_placeholder: "Escribe tu contraseña",
                            have_account_msg: "¿Ya tienes una cuenta?",
                            no_account_msg: "¿No tienes una cuenta?",
                            log_in_guest: "Iniciar sesión como invitado",
                            logged_in_msg: "Has iniciado sesión como ",
                            log_out: "Cerrar sesión"
                        },
                        note: {
                            title: "Título",
                            note_placeholder: "Toma una nota...",
                            confirm_delete: "¿Confirmar eliminación?",
                            cancel: "Cancelar",
                            delete: "Eliminar",
                            save: "Guardar",
                            close: "Cerrar"
                        }
                    }
                }
            }
        }
    });

export default i18n;