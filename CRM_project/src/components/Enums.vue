<script>
import axios from 'axios'
import { getDepartments } from './Utils'

export const RoleEnum = Object.freeze({
    0: {name: 'Admin', translation: 'Администратор' },
    1: {name: 'Leader', translation: 'Руководитель' },
    2: {name: 'Staff', translation: 'Административный работник' },
    3: {name: 'Teacher', translation: 'Учитель' },
})

export const TypesEnum=Object.freeze({
    'execute': {translation: "Ожидает выполнения"},
    'agree': {translation: "Ожидает согласования"},
    'accept': {translation: "Ожидает проверки"},
    'completed': {translation: "Выполнено"},
})

export const StatusEnum=Object.freeze({
    'danger': {description: "Задача ожидает выполнения", color: "!bg-[--crm-c-danger]", textColor: "text-white"},
    'wait': {description: "Задача на согласовании и проверке", color: "!bg-[--crm-c-light-yellow]", textColor: "text-black"},
    'complete': {description: "Задача выполенена", color: "!bg-[--crm-c-complete]", textColor: "text-white"},
})

export const TableEnum=Object.freeze({
    'users': {  title: "Пользователи",
                name: 'users',
                icon: 'fa-solid fa-user',
                cols: [
                    {name: 'full name', label: 'ФИО', field: 'full name', align: 'center'},
                    {name: 'email', label: 'email', field: 'email', align: 'center'},
                    {name: 'role', label: 'Роль', field: 'role', align: 'center'},
                    {name: 'post', label: 'Должность', field: 'post', align: 'center'},
                    {name: 'departments', label: 'Отделы', field: 'departments', align: 'center'},
                ],
                getUrl: '/api/user',
                dataMapper: (val) => ({
                    email: val.email,
                    'full name': val.profile.fio,
                    role: val.role,
                    id: val.id,
                    post: val.profile.post,
                    departments: val.profile.departments,

                }),
                deletingFunction: async function deleteUser(id){
                    try {
                        await axios.delete('../api/user', {params: {ids: id}});
                    } catch (error) {
                        console.error('Ошибка авторизации:', error.response?.data || error.message);
                    }
                },
    },
    'departments':{
                title: 'Отделы',
                name: 'departments',
                icon: 'fa-solid fa-people-group',
                cols: [
                    {name: 'title', label: 'Название', field: 'title', align: 'center'},
                    {name: 'head_department', label: 'Управляющий отдел', field: 'head_department', align: 'center'},
                    {name: 'supervisors', label: 'Руководители', field: 'supervisors', align: 'center'}],
                getUrl: '/api/user/department',
                dataMapper: (val) => ({
                    title: val.title,
                    'head_department': val.head_department,
                    supervisors: val.supervisors[0],
                    id: val.id
                }),
                deletingFunction: async function deleteUser(id){
                    try {
                        await axios.delete('../api/user/department', {params: {ids: id}});
                    } catch (error) {
                        console.error('Ошибка авторизации:', error.response?.data || error.message);
                    }
                },
    },
    'specializations':{
        title: 'Специализация',
        name: 'specializations',
        icon: 'fa-solid fa-pen-ruler',
        cols: [
            {name: 'title', label: 'Название', field: 'title', align: 'center'},
        ],
        getUrl: '/api/user/class/spec',
        dataMapper: (val) => ({
            title: val.title,
            id: val.id
        }),
        deletingFunction: async function deleteClass(id){
            try {
                await axios.delete('/api/user/class/spec', {params: {ids: id}});
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
    },
    'classes':{
                title: 'Классы',
                name: 'classes',
                icon: 'class',
                cols: [
                    {name: 'number', label: 'Номер', field: 'number', align: 'center'},
                    {name: 'parallel', label: 'Параллель', field: 'parallel', align: 'center'},
                    {name: 'spec', label: 'Специализация', field: 'spec', align: 'center'},
                ],
                getUrl: '/api/user/class',
                dataMapper: (val) => ({
                    number: val.number,
                    parallel: val.parallel,
                    spec: val.spec,
                    id: val.id
                }),
                deletingFunction: async function deleteClass(id){
                    try {
                        await axios.delete('../api/user/class', {params: {ids: id}});
                    } catch (error) {
                        console.error('Ошибка авторизации:', error.response?.data || error.message);
                    }
                },
    },
    'lessons':{
                title: 'Учебные предметы',
                name: 'lessons',
                icon: 'menu_book',
                cols: [{name: 'title', label: 'Название', field: 'title', align: 'center'},
                ],
                getUrl: '/api/user/lesson',
                dataMapper: (val) => ({
                    title: val.title,
                    id: val.id
                }),
                deletingFunction: async function deleteLesson(id){
                    try {
                        await axios.delete('../api/user/lesson', {params: {ids: id}});
                    } catch (error) {
                        console.error('Ошибка авторизации:', error.response?.data || error.message);
                    }
                },
    }
})

export const DialogEnum=Object.freeze({
    'users': {
        title: 'Пользователи',
        values:  [
        {name: "E-mail",
            model: "email",
            rules:
                [val => !!val || 'Обязательное поле',
                val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email']},

        {name: "Пароль",
            model: "password",
            hint: 'Может генерироваться автоматически',},

        {name: "ФИО",
            model: "fio",
            rules:
                [val => !!val || 'Обязательное поле']},

        {name: "Роль",
            model: "role",
            hint: 'По умолчанию - "Учитель"',
            options:
                [{value: 0,  label: 'Админ'},
                {value: 1,  label: 'Руководитель'},
                {value: 2,  label: 'Административный работник'},
                {value: 3,  label: 'Учитель'}]
        },
        {name: "Должность",
            model: "post",
            rules:
                [val => !!val || 'Обязательное поле'],
        },
        {name: "Подразделение",
            hint: 'Необязательное поле',
            hidden: true,
            model: "departments",
            options: await getDepartments()},

        {name: "Классы",
            hint: 'Необязательное поле',
            hidden: true,
            model: "classes"},

        {name: "Уроки",
            hint: 'Необязательное поле',
            hidden: true,
            model: "lessons"},
        ],
        params: {
            default_pass: null,
            email: '',
            pass_reset: '',
            password: '',
            role: 3,
            post: '',
            fio: '',
            departments: [],
            classes: [],
            lessons: []
        },
        creationFunction :  async function addUser(data){
            try {
                const  prepared_data = {
                    "email": data.email,
                    "password": data.password,
                    "profile": {
                        "fio": data.fio,
                        "post": data.post
                    },
                    "role": data.role
                }
                const response = await axios.post('/api/user', prepared_data);
                return response.data
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        editingFunction: async function editUser(params){
            try {
                let prepared_data = { default_pass : params.default_pass,
                                    email: params.email,
                                    id: params.id,
                                    pass_reset: params.pass_reset,
                                    password: params.password,
                                    profile: {
                                        classes: params.classes,
                                        departments: [params.departments],
                                        fio: params.fio,
                                        lessons: params.lessons,
                                        post: params.post
                                    },
                                    role: params.role
                                }
                console.log(prepared_data)
                const response = await axios.patch('../api/user', prepared_data);
                console.log(response)
                return response
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        getRecord: async function getNeededRecord(id){
            try {
                let details = await axios.get('/api/user', {
                    params: {
                        ids: id
                    }
                });
                let user = details.data.data[0]

                let params = {email: user.email, role: user.role, ...user.profile }
                console.log(params)
                return params
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        }
    },
    'departments':{
        title: 'Отделы',
        values:  [
        {name: "Название",
            model: "title",
            rules:
                [val => !!val || 'Обязательное поле',]},

        {name: "Управляющий отдел",
            model: "head_department",
            hint: 'Необязательное поле',
            options: await getDepartments()},
        ],
        params: {
            title: '',
            head_department: null,
        },
        creationFunction: async function addDepartment(data){
            try {
                const response = await axios.post('/api/user/department', data);
                console.log(response)
                return response.data
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        editingFunction: async function editDepartment(params){
            try {

                const response = await axios.patch('/api/user/department', params);
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        getRecord: async function getNeededRecord(id){
            try {
                let details = await axios.get('/api/user/department', {
                    params: {
                        ids: id
                    }
                });
                let record = details.data.data[0]

                let params = {...record}
                return params
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        }
    },
    'specializations': {
        title: 'Специализация',
        values:  [
        {name: "Название",
            model: "title",
            rules:
                [val => !!val || 'Обязательное поле',]},
        ],
        params: {
            title: '',
        },
        creationFunction: async function addSpec(data){
            try {
                const response = await axios.put('/api/user/class/spec', data);
                return response.data
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        getRecord: async function getNeededSpec(id){
            try {
                let details = await axios.get('/api/user/class/spec', {
                    params: {
                        ids: id
                    }
                });
                let record = details.data.data[0]

                let params = {...record}
                return params
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        editingFunction: async function editSpec(params){
            try {
                await axios.put('/api/user/class/spec', params);
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        }
    },
    'classes': {
        title: 'Классы',
        values:  [
        {name: "Номер",
            model: "number",
            rules:
                [val => !!val || 'Обязательное поле',]},

        {name: "Параллель",
            model: "parallel",
            hint: 'По умолчанию - 0',},

        {name: "Специализация",
            model: "specialization",
            hint: 'Необязательное поле',
        },
        ],
        params: {
            number: null,
            parallel: 0,
            specialization: null,
        },
        creationFunction: async function addClass(data){
            try {
                const response = await axios.post('/api/user/class', data);
                return response.data
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        getRecord: async function getNeededClass(id){
            try {
                let details = await axios.get('/api/user/class', {
                    params: {
                        ids: id
                    }
                });
                let record = details.data.data[0]

                let params = {...record}
                return params
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        editingFunction: async function editClass(params){
            try {
                await axios.patch('../api/user/class', params);
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        }
    },
    'lessons': {
        title: 'Уроки',
        values:  [
        {name: "Название",
            model: "title",
            rules:
                [val => !!val || 'Обязательное поле',]},
        ],
        params: {
            title: '',
        },
        creationFunction: async function addLesson(data){
            try {
                const response = await axios.post('/api/user/lesson', data);
                return response.data
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        getRecord: async function getNeededLesson(id){
            try {
                let details = await axios.get('/api/user/lesson', {
                    params: {
                        ids: id
                    }
                });
                let record = details.data.data[0]

                let params = {...record}
                return params
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        },
        editingFunction: async function editLesson(params){
            try {
                await axios.put('../api/user/lesson', params);
                
            } catch (error) {
                console.error('Ошибка авторизации:', error.response?.data || error.message);
            }
        }
    },
})

</script>